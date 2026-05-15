import React, { useState, useRef } from 'react';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/app/consultoria/senior/$cliente/ferramentas/lsp')({
  component: LspGeneratorRoute,
});

const MOCK_RESPONSE = `
##TITULO##
Validação de Limite de Crédito de Cliente
##MODULO##
Mercado (Vendas)
##IDENTIFICADOR##
VEN-000492810
##DESCRICAO##
Bloqueia o faturamento de pedidos se o saldo devedor do cliente somado ao valor do pedido exceder o limite autorizado.
##SCRIPT##
@ Regra de Processo LSP - Validação de Limite de Crédito @
Definir Numero nLimiteCredito;
Definir Numero nSaldoDevedor;
Definir Numero nValorPedido;
Definir Alfa aCliente;
Definir Alfa aRetorno;

@ Busca informações financeiras do cliente @
BuscaReg("E085CLI", "CodCli", aCliente, nLimiteCredito);
BuscaReg("E156FIN", "SldDev", aCliente, nSaldoDevedor);

Se ((nSaldoDevedor + nValorPedido) > nLimiteCredito)
  aRetorno = "Limite de Crédito Excedido!";
  GeraLog("Cliente " + aCliente + " bloqueado por falta de limite disponível.");
  Mensagem(Erro, aRetorno);
  Se (aRetorno <> "OK")
    GeraLog("Pedido bloqueado com sucesso");
  FimSe;
FimSe;
##VARIAVEIS##
nLimiteCredito|Numero|Valor total do limite de crédito autorizado na ficha cadastral
nSaldoDevedor|Numero|Saldo acumulado de títulos em aberto e faturamentos pendentes
nValorPedido|Numero|Valor líquido total do pedido de venda atual
aCliente|Alfa|Código identificador único do cliente no ERP
aRetorno|Alfa|Mensagem de resposta de validação de erro ou sucesso
##FUNCOES##
BuscaReg|Consulta registros específicos em tabelas internas do Senior Sapiens ERP.
GeraLog|Gera registros detalhados no log de execução para auditoria de processos.
Mensagem|Dispara alertas modais de sucesso, aviso ou interrupção (Erro) no terminal do usuário.
##DICAS##
Sempre homologue as regras no ambiente de Testes antes de aplicar em Produção.
Certifique-se de associar a regra ao evento de Processo adequado (ex: evento 120 - Gravar Pedido).
Use a função GeraLog() para mapear o fluxo de variáveis durante a depuração de falhas.
##ATENCAO##
O excesso de regras associadas a eventos críticos de gravação (tabela E120PED) pode impactar o tempo de gravação de pedidos em faturamentos de grande volume.
##FIM##
`;

function parseResponse(text: string) {
  const get = (tag: string, next: string) => {
    const start = text.indexOf(`##\${tag}##`);
    if (start === -1) return '';
    const after = start + tag.length + 4;
    const end = text.indexOf(`##\${next}##`, after);
    return (end === -1 ? text.slice(after) : text.slice(after, end)).trim();
  };
  return {
    titulo: get('TITULO', 'MODULO'),
    modulo: get('MODULO', 'IDENTIFICADOR'),
    identificador: get('IDENTIFICADOR', 'DESCRICAO'),
    descricao: get('DESCRICAO', 'SCRIPT'),
    script: get('SCRIPT', 'VARIAVEIS'),
    variaveis: get('VARIAVEIS', 'FUNCOES')
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        const [n, t, ...r] = l.split('|');
        return { nome: n?.trim(), tipo: t?.trim(), descricao: r.join('|').trim() };
      })
      .filter((v) => v.nome),
    funcoes: get('FUNCOES', 'DICAS')
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        const [n, ...r] = l.split('|');
        return { nome: n?.trim(), descricao: r.join('|').trim() };
      })
      .filter((f) => f.nome),
    dicas: get('DICAS', 'ATENCAO')
      .split('\n')
      .filter(Boolean)
      .map((d) => d.trim())
      .filter(Boolean),
    atencao: get('ATENCAO', 'FIM'),
  };
}

function LspGeneratorRoute() {
  const { cliente } = useParams({ from: '/app/consultoria/senior/$cliente/ferramentas/lsp' });

  const [input, setInput] = useState('');
  const [image, setImage] = useState<{ preview: string; name: string; size: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [tab, setTab] = useState<'script' | 'variaveis'>('script');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage({
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB'
    });
    setMode('image');
  };

  const generate = () => {
    if (!input.trim() && !image) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      try {
        setResult(parseResponse(MOCK_RESPONSE));
        setTab('script');
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const copyCode = () => {
    if (!result?.script) return;
    navigator.clipboard.writeText(result.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <Link to={`/app/consultoria/senior/\${cliente}`} className="text-slate-500 hover:text-slate-300 mr-4">← Voltar</Link>
          <h1 className="text-xl font-bold inline-block">Gerador LSP Lite</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode('text')} className={`px-3 py-1 rounded \${mode === 'text' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Texto</button>
          <button onClick={() => setMode('image')} className={`px-3 py-1 rounded \${mode === 'image' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Imagem</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <h2 className="text-sm font-bold mb-4">Entrada de Dados</h2>
            
            {mode === 'image' && (
              <div 
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-700 p-8 rounded-lg text-center cursor-pointer mb-4 hover:border-amber-500"
              >
                {image ? <img src={image.preview} className="max-h-32 mx-auto" /> : "Clique para upload de imagem"}
                <input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            )}

            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descreva a regra aqui..."
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded p-3 text-sm outline-none focus:border-amber-600 transition-none"
            />

            <button 
              onClick={generate}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold mt-4 disabled:opacity-50"
            >
              {loading ? "Processando..." : "GERAR REGRA"}
            </button>
          </div>
        </div>

        <div>
          {result ? (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <div className="flex border-b border-slate-800 mb-4">
                <button onClick={() => setTab('script')} className={`px-4 py-2 text-xs font-bold \${tab === 'script' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-slate-500'}`}>SCRIPT</button>
                <button onClick={() => setTab('variaveis')} className={`px-4 py-2 text-xs font-bold \${tab === 'variaveis' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-slate-500'}`}>VARIÁVEIS</button>
              </div>
              
              {tab === 'script' && (
                <div className="relative">
                   <button onClick={copyCode} className="absolute top-0 right-0 text-[10px] bg-slate-800 px-2 py-1 rounded">{copied ? 'Copiado!' : 'Copiar'}</button>
                   <pre className="text-xs font-mono bg-black p-4 rounded overflow-x-auto whitespace-pre-wrap">{result.script}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-lg h-64 flex items-center justify-center text-slate-600">
              Aguardando entrada...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LspGeneratorRoute;
