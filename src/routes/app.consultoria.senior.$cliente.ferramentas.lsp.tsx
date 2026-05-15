import React, { useState } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/app/consultoria/senior/$cliente/ferramentas/lsp')({
  component: LspGeneratorRoute,
});

function LspGeneratorRoute() {
  const { cliente } = useParams({ from: '/app/consultoria/senior/$cliente/ferramentas/lsp' });
  const [text, setText] = useState('');

  return (
    <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>ESTABILIDADE: GERADOR LSP ({cliente})</h1>
      <p style={{ marginBottom: '20px', color: '#888' }}>Clique e tente digitar abaixo. Se travar aqui, o problema é global.</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Teste de digitação..."
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '200px',
          background: '#111',
          color: '#fff',
          border: '1px solid #333',
          padding: '15px',
          fontSize: '16px',
          outline: 'none'
        }}
      />
    </div>
  );
}
