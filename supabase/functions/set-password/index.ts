import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SetPasswordRequest {
  email: string;
  password: string;
  token: string;
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
    const { email, password, token }: SetPasswordRequest = await req.json();

    if (!email || !password || !token) {
      return new Response(
        JSON.stringify({ error: 'Email, senha e token são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchase_access')
      .select('id, auth_user_id')
      .eq('email', email)
      .eq('token', token)
      .single();

    if (purchaseError || !purchaseData) {
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!purchaseData.auth_user_id) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado. Entre em contato com o suporte.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { error: updateError } = await supabase.auth.admin.updateUser(
      purchaseData.auth_user_id,
      { password }
    );

    if (updateError) {
      console.error('Erro ao definir senha:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao definir senha. Tente novamente.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('purchase_access')
      .update({ used: true })
      .eq('id', purchaseData.id);

    return new Response(
      JSON.stringify({ success: true, message: 'Senha definida com sucesso' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
