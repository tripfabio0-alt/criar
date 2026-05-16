import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) throw new Error("Não autorizado");

    const { prompt } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Prompt de Sistema Unificado Gemini Edition
    const systemPrompt = `Você é um Engenheiro de Software especialista em Senior Sistemas (LSP e SQL 2).
Gere respostas técnicas precisas seguindo rigorosamente os delimitadores ## indicados no prompt do usuário.
Não adicione texto explicativo fora dos blocos delimitados.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nRequisição: ${prompt}` }] }]
      })
    });

    const result = await geminiRes.json();
    
    if (result.error) throw new Error(result.error.message);
    
    const responseText = result.candidates[0].content.parts[0].text;

    // Log de Consumo
    await supabaseAdmin.from("uso_api_logs").insert({
      user_id: user.id,
      endpoint_chamado: "/gerar-sql",
      tokens_estimados: responseText.length / 4
    });

    return new Response(JSON.stringify({ resultado: responseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
