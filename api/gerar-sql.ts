import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { prompt } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) throw new Error('Chave GEMINI_API_KEY não configurada.');

    const modelToUse = 'gemini-flash-latest';
    
    // Prompt ultra-especializado para Senior Sistemas
    const systemPrompt = `Você é um Engenheiro de Software Sênior especialista em ecossistema Senior Sistemas (ERP Senior, Vetorh, Sapiens).
Sua missão é gerar soluções técnicas usando LSP (Linguagem Senior de Programação) ou SQL para Banco de Dados Senior.

REGRAS DE RESPOSTA:
1. Comece com ##EXPLICACOES##: Forneça uma análise de engenharia de alto nível, explicando a arquitetura e boas práticas (como LSP - Liskov Substitution).
2. Siga com ##CONTEUDO##: Forneça APENAS o código puro (LSP ou SQL) que o usuário irá colar no sistema da Senior.
3. Não use blocos de Markdown (\`\`\`) dentro dos delimitadores ##.

Exemplo de estrutura:
##EXPLICACOES##
Sua explicação aqui...
##CONTEUDO##
Definir Alfa vTexto;
vTexto = "Olá Senior";
...`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nRequisição: ${prompt}` }] }]
      })
    });

    const data = await geminiRes.json();
    
    if (data.error) throw new Error(`Erro Google: ${data.error.message}`);

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta da IA';
    return res.status(200).json({ resultado: responseText });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
