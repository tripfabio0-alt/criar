import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { prompt } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error('Chave GEMINI_API_KEY não configurada na Vercel.');
    }

    const systemPrompt = `Você é um Engenheiro de Software especialista em Senior Sistemas (LSP e SQL 2).
Gere respostas técnicas precisas seguindo rigorosamente os delimitadores ## indicados no prompt do usuário.
Não adicione texto explicativo fora dos blocos delimitados.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nRequisição: ${prompt}` }] }]
      })
    });

    const data = await geminiRes.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const responseText = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ resultado: responseText });

  } catch (err: any) {
    console.error('Erro na Vercel Function:', err);
    return res.status(500).json({ error: err.message });
  }
}
