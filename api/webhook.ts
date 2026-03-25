import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type')
      .send('ok');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: CaktoWebhookPayload = req.body;
    
    const eventName = payload.event?.name;
    const customerEmail = payload.purchase?.customer?.email;
    const purchaseStatus = payload.purchase?.status;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Email do cliente não encontrado' });
    }

    const paymentStatus = purchaseStatus === 'paid' ? 'paid' : purchaseStatus === 'pending' ? 'pending' : 'failed';

    if (eventName === 'purchase_approved' || eventName === 'purchase_created') {
      const { data: existing } = await supabase
        .from('purchase_access')
        .select('id, auth_user_id')
        .eq('email', customerEmail)
        .single();

      if (existing) {
        await supabase
          .from('purchase_access')
          .update({ 
            payment_status: paymentStatus,
            used: false
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
          });
      }
    }

    if (eventName === 'purchase_refused') {
      await supabase
        .from('purchase_access')
        .update({ payment_status: 'failed' })
        .eq('email', customerEmail);
    }

    return res.status(200).json({ success: true, message: 'Webhook processado com sucesso' });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
