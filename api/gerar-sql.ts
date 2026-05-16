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
    const systemPrompt = `Você é um Arquiteto de Soluções Sênior especialista em ERP Senior (Sapiens/Vetorh).
Sua missão é entregar uma solução dividida em 3 FASES distintas.

Sempre responda usando EXATAMENTE estes delimitadores:

##MAPA##
(Aqui você age como consultor: PASSO A PASSO, TELAS, IDENTIFICADORES DE REGRA e CONFIGURAÇÃO necessária no sistema Senior)

##SQL##
(Aqui você coloca APENAS o código SQL puro. Se não houver SQL para a solução, escreva "Nenhum script SQL necessário para esta fase.")

##LSP##
(Aqui você coloca APENAS a Regra LSP pura. Se não houver regra para a solução, escreva "Nenhuma regra LSP necessária para esta fase.")

MANTENHA UM TON TÉCNICO E FOCO EM PERFORMANCE.`;

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
