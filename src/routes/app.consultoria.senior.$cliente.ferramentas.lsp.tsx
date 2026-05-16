import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState, useRef } from "react";

export const Route = createFileRoute('/app/consultoria/senior/$cliente/ferramentas/lsp')({
  component: LspGeneratorRoute,
});

const SYSTEM_PROMPT = `Você é um especialista em regras LSP do Senior Gestão Empresarial ERP.
Responda EXATAMENTE neste formato com os delimitadores abaixo. Não adicione nada fora dos blocos.

##TITULO##
Título curto da regra
##MODULO##
Módulo (ex: Manufatura, PCP, Mercado)
##IDENTIFICADOR##
Ex: PCP-000XXXXX01
##DESCRICAO##
Descrição funcional de uma linha
##SCRIPT##
@ Script LSP completo com comentários @
Definir Alfa aVariavel;
##VARIAVEIS##
nome|Tipo|Descrição
##FUNCOES##
NomeFuncao|O que faz
##DICAS##
Dica 1
Dica 2
##ATENCAO##
Ponto crítico
##FIM##

Sintaxe LSP Senior: Definir Alfa/Numero/Data; @ comentário @; Se()...FimSe; Enquanto()...FimEnquanto; GeraLog(); Mensagem(); BuscaReg(); GravaReg(); ApontarOPs(); GerarOP(); BaixarComponentes(); Se(aRetorno<>"OK") GeraLog(aRetorno); FimSe;`;

function parseResponse(text: string) {
  const get = (tag: string, next: string) => {
    const start = text.indexOf(`##${tag}##`);
    if (start === -1) return "";
    const after = start + tag.length + 4;
    const end = text.indexOf(`##${next}##`, after);
    return (end === -1 ? text.slice(after) : text.slice(after, end)).trim();
  };
  return {
    titulo: get("TITULO","MODULO"),
    modulo: get("MODULO","IDENTIFICADOR"),
    identificador: get("IDENTIFICADOR","DESCRICAO"),
    descricao: get("DESCRICAO","SCRIPT"),
    script: get("SCRIPT","VARIAVEIS"),
    variaveis: get("VARIAVEIS","FUNCOES").split("\n").filter(Boolean).map(l=>{const [n,t,...r]=l.split("|");return{nome:n?.trim(),tipo:t?.trim(),descricao:r.join("|").trim()};}).filter(v=>v.nome),
    funcoes: get("FUNCOES","DICAS").split("\n").filter(Boolean).map(l=>{const [n,...r]=l.split("|");return{nome:n?.trim(),descricao:r.join("|").trim()};}).filter(f=>f.nome),
    dicas: get("DICAS","ATENCAO").split("\n").filter(Boolean).map(d=>d.trim()).filter(Boolean),
    atencao: get("ATENCAO","FIM"),
  };
}

function LspGeneratorRoute() {
  const { cliente } = useParams({ from: '/app/consultoria/senior/$cliente/ferramentas/lsp' });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("script");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const currentInput = inputRef.current?.value || "";
    if (!currentInput.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const messages = [{ role: "user", content: currentInput.trim() }];
      
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages
        }),
      });
      
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setTimeout(() => {
            setResult(parseResponse(`##TITULO##\nRegra Gerada (Modo Demonstração)\n##MODULO##\nPCP\n##IDENTIFICADOR##\nPCP-00001\n##DESCRICAO##\nDemonstração de regra gerada por texto.\n##SCRIPT##\n@ Script de Exemplo @\nDefinir Alfa aMensagem;\naMensagem = "Olá, esta é uma regra gerada a partir de: " + "${currentInput.trim().substring(0, 20)}...";\nMensagem(Retorna, aMensagem);\n##VARIAVEIS##\naMensagem|Alfa|Mensagem a ser exibida\n##FUNCOES##\nMensagem|Exibe um alerta na tela do sistema\n##DICAS##\nPara usar em produção, configure a API Key.\n##ATENCAO##\nModo de demonstração ativado.\n##FIM##`));
            setTab("script");
            setLoading(false);
          }, 1500);
          return;
        }
        throw new Error(`API ${res.status}: ${e?.error?.message || res.statusText}`);
      }
      
      const data = await res.json();
      const raw = (data.content || []).map((c: any) => c.text || "").join("");
      
      if (!raw) throw new Error("Resposta vazia.");
      if (!raw.includes("##TITULO##")) throw new Error("Formato inesperado. Tente novamente.");
      
      setResult(parseResponse(raw));
      setTab("script");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!result?.script) return;
    navigator.clipboard.writeText(result.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const lc = (line: string) => {
    const t = line.trim();
    if (t.startsWith("@")) return "#64748b";
    if (/^(Definir|Se|FimSe|Enquanto|FimEnquanto|ParaCada|FimParaCada)\b/i.test(t)) return "#93c5fd";
    if (/^[A-Z][a-zA-Z]+\(/.test(t)) return "#86efac";
    return "#cbd5e1";
  };
  
  const ok = !loading;

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1117] font-mono text-slate-200 rounded-xl border border-slate-800 overflow-hidden shadow-2xl pb-10">
      <div className="flex items-center gap-4 bg-[#0a0d14] border-b border-slate-800 p-6 px-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-amber-500 to-amber-600 text-black font-bold text-xl">
          S
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100 tracking-wider">
            SENIOR · GERADOR DE REGRAS LSP (TEXT-ONLY)
          </div>
          <div className="text-[10px] text-slate-500 tracking-[0.08em] uppercase mt-0.5">
            Cliente Atual: {cliente}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full opacity-70" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto p-6 pt-8">
        <div className="bg-[#13171f] border border-slate-800 rounded-lg overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0f1117] border-b border-slate-800 text-xs text-slate-500 tracking-wider">
            <span className="text-amber-500">▶</span>
            DESCREVA SUA NECESSIDADE EM TEXTO
            <span className="ml-auto text-slate-600">Ctrl+Enter para gerar</span>
          </div>

          <textarea
            ref={inputRef}
            defaultValue=""
            placeholder="Ex: Quero uma regra que ao apontar uma OP verifique se o operador tem permissão e registre um log..."
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="w-full min-h-[140px] bg-transparent border-none outline-none p-5 text-slate-300 text-sm font-mono resize-y leading-relaxed placeholder:text-slate-600 focus:ring-0"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-slate-800 bg-[#0f1117]/50">
            <div className="flex flex-wrap gap-2">
              {["Validar operador na OP", "Bloquear pedido sem estoque", "Log de quantidade"].map(ex => (
                <button 
                  key={ex} 
                  onClick={() => { if (inputRef.current) inputRef.current.value = ex; }} 
                  className="bg-[#0f1117] border border-slate-800 rounded px-3 py-1 text-[11px] text-slate-400 hover:text-slate-300 hover:border-slate-700 transition-colors font-mono cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
            
            <button 
              onClick={generate} 
              disabled={!ok} 
              className={`ml-auto flex items-center gap-2 px-6 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all ${
                !ok ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-gradient-to-br from-amber-500 to-amber-600 text-black hover:opacity-90 cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block">⟳</span> GERANDO...
                </>
              ) : (
                <>⚡ GERAR REGRA</>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 rounded-md p-3 text-xs text-red-400 mb-4 break-words">
            ⚠ {error}
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#13171f] border border-slate-800 rounded-lg mb-4">
              {[
                { label: "TÍTULO", value: result.titulo, color: "text-slate-100" },
                { label: "MÓDULO", value: result.modulo, color: "text-amber-500" },
                { label: "IDENTIFICADOR", value: result.identificador, color: "text-slate-400" },
                { label: "DESCRIÇÃO", value: result.descricao, color: "text-slate-400" }
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="text-[10px] text-slate-500 tracking-wider mb-1">{label}</div>
                  <div className={`text-sm leading-relaxed ${color}`}>{value}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#13171f] border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex border-b border-slate-800 bg-[#0f1117]">
                {[
                  { k: "script", l: "📄 SCRIPT LSP" },
                  { k: "variaveis", l: "🔤 VARIÁVEIS" },
                  { k: "funcoes", l: "⚙ FUNÇÕES" },
                  { k: "ajuda", l: "💡 AJUDA" }
                ].map(t => (
                  <button 
                    key={t.k} 
                    onClick={() => setTab(t.k)} 
                    className={`px-4 py-3 text-[11px] font-mono cursor-pointer transition-colors border-b-2 ${
                      tab === t.k ? "border-amber-500 text-amber-500 font-bold bg-amber-500/5" : "border-transparent text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    {t.l}
                  </button>
                ))}
              </div>
              
              {tab === "script" && (
                <div className="relative">
                  <button 
                    onClick={copy} 
                    className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded text-[10px] font-mono cursor-pointer transition-colors border ${
                      copied ? "bg-green-950/50 text-green-400 border-green-900" : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {copied ? "✓ COPIADO" : "⎘ COPIAR"}
                  </button>
                  <pre className="m-0 p-5 pt-12 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap break-words bg-[#0a0c10]">
                    {(result.script || "").split("\n").map((line: string, i: number) => (
                      <span key={i} className={`block ${line.trim().startsWith("@") ? "italic" : ""}`} style={{ color: lc(line) }}>
                        <span className="text-slate-700 select-none mr-4 text-[10px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {line}
                      </span>
                    ))}
                  </pre>
                </div>
              )}
              
              {tab === "variaveis" && (
                <div className="p-4">
                  {result.variaveis?.length > 0 ? (
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800">
                          {["VARIÁVEL", "TIPO", "DESCRIÇÃO"].map(h => (
                            <th key={h} className="p-3 text-left text-[10px] text-slate-500 tracking-wider font-normal">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.variaveis.map((v: any, i: number) => (
                          <tr key={i} className="border-b border-[#0f1117]">
                            <td className="p-3 text-emerald-300 font-mono">{v.nome}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                v.tipo === "Alfa" ? "bg-blue-950/50 text-blue-300 border border-blue-900/50" :
                                v.tipo === "Numero" ? "bg-emerald-950/50 text-emerald-300 border border-emerald-900/50" :
                                "bg-red-950/50 text-red-300 border border-red-900/50"
                              }`}>
                                {v.tipo}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400">{v.descricao}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center p-8 text-xs text-slate-500">Nenhuma variável documentada.</div>
                  )}
                </div>
              )}
              
              {tab === "funcoes" && (
                <div className="p-4 flex flex-col gap-2">
                  {(result.funcoes || []).map((f: any, i: number) => (
                    <div key={i} className="flex gap-4 p-3 bg-[#0f1117] border border-slate-800 rounded-md">
                      <span className="text-amber-500 text-xs font-mono font-semibold min-w-[180px]">{f.nome}()</span>
                      <span className="text-slate-400 text-xs leading-relaxed">{f.descricao}</span>
                    </div>
                  ))}
                  {(!result.funcoes || result.funcoes.length === 0) && (
                    <div className="text-center p-8 text-xs text-slate-500">Nenhuma função especial documentada.</div>
                  )}
                </div>
              )}
              
              {tab === "ajuda" && (
                <div className="p-5">
                  {result.atencao && (
                    <div className="flex gap-3 p-4 mb-5 bg-amber-950/20 border border-amber-900/50 rounded-md">
                      <span className="text-amber-500">⚠</span>
                      <div>
                        <div className="text-[10px] text-amber-500 tracking-wider mb-1 font-semibold">ATENÇÃO</div>
                        <div className="text-xs text-amber-200 leading-relaxed">{result.atencao}</div>
                      </div>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 tracking-wider mb-3">DICAS DE USO</div>
                  <div className="flex flex-col gap-2">
                    {(result.dicas || []).map((d: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-[#0f1117] border border-slate-800 rounded-md text-xs text-slate-400 leading-relaxed">
                        <span className="text-amber-500 font-bold min-w-[16px]">{i + 1}.</span>{d}
                      </div>
                    ))}
                    {(!result.dicas || result.dicas.length === 0) && (
                      <div className="text-slate-500 text-xs italic">Nenhuma dica fornecida.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="text-center p-10 pt-12">
            <div className="text-4xl mb-4 opacity-20">⌨</div>
            <div className="text-xs leading-relaxed max-w-sm mx-auto text-slate-500">
              Digite uma descrição detalhada para gerar regras LSP automaticamente usando inteligência artificial.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
