import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CaktoWebhookPayload {
  event: {
    id: string;
    name: string;
    custom_id: string;
    occurred_at: string;
  };
  purchase: {
    id: string;
    customer: {
      email: string;
      name: string;
    };
    status: 'paid' | 'pending' | 'failed';
    products: Array<{
      id: string;
      name: string;
    }>;
    created_at: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const payload: CaktoWebhookPayload = await req.json();
    
    const eventName = payload.event?.name;
    const customerEmail = payload.purchase?.customer?.email;
    const purchaseStatus = payload.purchase?.status;

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Email do cliente não encontrado' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const paymentStatus = purchaseStatus === 'paid' ? 'paid' : purchaseStatus === 'pending' ? 'pending' : 'failed';

    if (eventName === 'purchase_approved' || eventName === 'purchase_created') {
      const { data: existing } = await supabase
        .from('purchase_access')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (existing) {
        await supabase
          .from('purchase_access')
          .update({ 
            payment_status: paymentStatus,
            used: false,
            auth_user_id: null
          })
          .eq('email', customerEmail);
      } else {
        const token = crypto.randomUUID();
        
        await supabase
          .from('purchase_access')
          .insert({
            email: customerEmail,
            payment_status: paymentStatus,
            token: token,
            used: false,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
      }
    }

    if (eventName === 'purchase_refused') {
      await supabase
        .from('purchase_access')
        .update({ payment_status: 'failed' })
        .eq('email', customerEmail);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processado com sucesso' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
