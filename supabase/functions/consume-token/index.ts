import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token, auth_user_id } = await req.json();

    if (!token || !auth_user_id) {
      return new Response(
        JSON.stringify({ error: "Token e ID do usuário são obrigatórios" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: purchaseData, error: findError } = await supabase
      .from("purchase_access")
      .select("id, email, used, expires_at")
      .eq("token", token)
      .single();

    if (findError || !purchaseData) {
      return new Response(
        JSON.stringify({ error: "Token inválido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    if (purchaseData.used) {
      return new Response(
        JSON.stringify({ error: "Token já foi utilizado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("purchase_access")
      .update({ used: true, auth_user_id: auth_user_id })
      .eq("id", purchaseData.id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Erro ao consumir token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao consumir token" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
