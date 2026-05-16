import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import glowingCube from "../assets/glowing-cube.png";
import funnel from "../assets/funnel.png";
import globe from "../assets/globe.png";
import { LangSwitcher } from "../components/LangSwitcher";
import {
  IconSearch, IconBrain, IconCode, IconRocket, IconCloud, IconUser,
  IconCog, IconNetwork, IconChart, IconPuzzle, IconArrow, IconSpark,
} from "../components/SolvixIcons";
import { dict, SLOGAN_PREFIX, SLOGAN_HIGHLIGHT, type Lang } from "../lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solvix — Soluções de IA para Problemas Reais" },
      { name: "description", content: "Solvix AI Studio - Construindo ferramentas inteligentes para desafios operacionais." },
    ],
  }),
  component: Index,
});

export function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const t = dict[lang];

  const processIcons = [IconSearch, IconBrain, IconCode, IconRocket];
  const whatIcons = [IconCloud, IconUser, IconCog, IconNetwork, IconChart, IconPuzzle];
  const diffIcons = [IconBrain, IconCog, IconChart, IconNetwork];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 hero-glow opacity-50" />
      
      {/* HEADER / NAV */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <img src={logo} alt="Solvix" className="h-12 w-12 object-contain transition-transform group-hover:scale-110" />
            <span className="font-outfit text-2xl font-bold tracking-tighter">SOLVIX</span>
          </Link>
          
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
            {t.nav.map((n, i) => {
              if (n === "Soluções" || n === "Solutions") {
                return (
                  <div key={i} className="group relative py-2">
                    <button className="flex items-center gap-1.5 transition-colors hover:text-foreground cursor-pointer">
                      {n} <IconArrow className="h-3 w-3 rotate-90 transition-transform group-hover:rotate-[270deg]" />
                    </button>
                    <div className="absolute top-full left-1/2 mt-2 w-72 -translate-x-1/2 scale-95 rounded-2xl border border-white/10 bg-card/95 p-4 opacity-0 shadow-2xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 backdrop-blur-2xl">
                      <div className="space-y-1">
                        <Link to="/app/dashboard" className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">📊</div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Painel de Controle</div>
                            <div className="text-[10px] text-muted-foreground">Métricas e acompanhamento</div>
                          </div>
                        </Link>
                        <Link to="/app/consultoria/senior/eraser/ferramentas/lsp" className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">🤖</div>
                          <div>
                            <div className="text-xs font-bold text-foreground">IA p/ Senior Systems</div>
                            <div className="text-[10px] text-muted-foreground">Automação de processos</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              return <a key={i} href="#" className="transition-colors hover:text-foreground">{n}</a>;
            })}
          </nav>
          
          <div className="flex items-center gap-4">
            <LangSwitcher lang={lang} onChange={setLang} />
            <Link to="/app/dashboard" className="hidden rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background transition-transform hover:scale-105 sm:block">
              Acessar App
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Next Gen AI Studio
            </div>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-8xl font-outfit">
              {SLOGAN_PREFIX}
              <span className="text-gradient block">{SLOGAN_HIGHLIGHT}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t.heroDesc}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/app/dashboard" className="group flex items-center gap-2 rounded-2xl bg-foreground px-8 py-4 text-sm font-bold text-background transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                {t.ctaPrimary} <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative animate-float flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[120px]" />
            <img src={glowingCube} alt="Solvix AI" className="relative z-10 h-auto w-full max-w-[500px] object-contain" />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">{t.processTag}</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl font-outfit">{t.processTitle}</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {t.process.map((step, i) => {
            const Icon = processIcons[i];
            return (
              <div key={i} className="glass-card group rounded-3xl p-8 hover:border-indigo-500/30 hover:bg-indigo-500/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-all">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-card/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="h-10 w-10" />
              <span className="font-outfit text-2xl font-bold tracking-widest">SOLVIX</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {t.rights}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
