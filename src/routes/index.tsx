import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import glowingCube from "@/assets/glowing-cube.png";
import funnel from "@/assets/funnel.png";
import globe from "@/assets/globe.png";
import { LangSwitcher } from "@/components/LangSwitcher";
import {
  IconSearch, IconBrain, IconCode, IconRocket, IconCloud, IconUser,
  IconCog, IconNetwork, IconChart, IconPuzzle, IconArrow, IconSpark,
} from "@/components/SolvixIcons";
import { dict, SLOGAN_PREFIX, SLOGAN_HIGHLIGHT, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solvix — AI solutions for real problems" },
      { name: "description", content: "Solvix is an AI Solution Studio building intelligent tools that solve real operational challenges." },
      { property: "og:title", content: "Solvix — AI solutions for real problems" },
      { property: "og:description", content: "AI Solution Studio building intelligent tools." },
    ],
  }),
  component: Index,
});

export function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const [activeTab, setActiveTab] = useState(0);
  const t = dict[lang];

  const processIcons = [IconSearch, IconBrain, IconCode, IconRocket];
  const whatIcons = [IconCloud, IconUser, IconCog, IconNetwork, IconChart, IconPuzzle];
  const diffIcons = [IconBrain, IconCog, IconChart, IconNetwork];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 hero-glow opacity-50" />
      <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-[120px]" />

      {/* NAV */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-2">
            <img src={logo} alt="Solvix" className="h-12 w-12 object-contain transition-transform group-hover:scale-110" />
            <span className="font-outfit text-2xl font-bold tracking-tighter text-foreground">SOLVIX</span>
          </Link>
          
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
            {t.nav.map((n) => {
              if (n === "Soluções" || n === "Solutions") {
                return (
                  <div key={n} className="group relative py-2">
                    <button className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                      {n} <IconArrow className="h-3 w-3 rotate-90 transition-transform group-hover:rotate-[270deg]" />
                    </button>
                    <div className="absolute top-full left-1/2 mt-2 w-72 -translate-x-1/2 scale-95 rounded-2xl border border-white/10 bg-card/95 p-4 opacity-0 shadow-2xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 backdrop-blur-2xl">
                      <div className="space-y-1">
                        <Link to="/app/dashboard" className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">📊</div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Painel de Controle</div>
                            <div className="text-[10px] text-muted-foreground">Visão geral e métricas</div>
                          </div>
                        </Link>
                        <Link to="/app/consultoria/senior/eraser/ferramentas/lsp" className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">🤖</div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Gerador de Regras LSP</div>
                            <div className="text-[10px] text-muted-foreground">Automação Senior Systems</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <a key={n} href="#" className="transition-colors hover:text-foreground">{n}</a>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-4">
            <LangSwitcher lang={lang} onChange={setLang} />
            <Link to="/app/dashboard" className="hidden rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background transition-transform hover:scale-105 sm:block">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pb-32 pt-20 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Next Gen AI Studio
            </div>
            <h1 className="text-6xl font-bold leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl">
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
              <Link to="/app/consultoria/senior/eraser" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold backdrop-blur-xl transition-all hover:bg-white/10">
                {t.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="relative animate-float lg:block">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px]" />
            <img src={glowingCube} alt="Solvix" className="relative z-10 h-full w-full object-contain" />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center animate-slide-up">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">{t.processTag}</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{t.processTitle}</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {t.process.map((step, i) => {
            const Icon = processIcons[i];
            return (
              <div key={i} className="glass-card group rounded-3xl p-8 hover:border-indigo-500/30 hover:bg-indigo-500/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-sm font-bold text-muted-foreground mb-2">0{i + 1}</div>
                <h3 className="text-xl font-bold mb-3">{step.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="glass-card overflow-hidden rounded-[40px] border-white/10 bg-card/30 p-1 lg:p-2">
          <div className="rounded-[32px] bg-background/40 p-8 lg:p-12">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-accent">{t.differentialTag}</div>
                <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{t.differentialTitle}</h2>
                <p className="mt-6 text-lg text-muted-foreground">{t.differentialBody}</p>
                <div className="mt-10 grid grid-cols-2 gap-6">
                  {t.differentialPoints.map((p, i) => {
                    const Icon = diffIcons[i];
                    return (
                      <div key={p} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-semibold">{p}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-indigo-500/10 blur-2xl" />
                <div className="relative rounded-3xl border border-white/10 bg-card p-6 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Live Metrics</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <div className="text-[10px] text-muted-foreground uppercase">Automations</div>
                      <div className="mt-1 text-2xl font-bold">142</div>
                      <div className="mt-1 text-[10px] text-emerald-400">+34% this month</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <div className="text-[10px] text-muted-foreground uppercase">Time Saved</div>
                      <div className="mt-1 text-2xl font-bold">1,248h</div>
                      <div className="mt-1 text-[10px] text-emerald-400">Efficiency peak</div>
                    </div>
                    <div className="col-span-2 rounded-2xl bg-white/5 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground uppercase">Performance</span>
                        <span className="text-[10px] text-emerald-400">98.2% Accuracy</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                          <div key={i} className="w-full rounded-t-lg bg-indigo-500/30 transition-all hover:bg-indigo-500" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-32 text-center">
        <div className="absolute inset-0 -z-10 bg-indigo-600/5 blur-[120px]" />
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-4xl font-bold sm:text-6xl">{t.finalTitle}</h2>
          <p className="mt-6 text-xl text-muted-foreground">{t.finalSub}</p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link to="/app/dashboard" className="rounded-2xl bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-105">
              Start Building Now
            </Link>
            <button className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-sm font-bold backdrop-blur-xl transition-colors hover:bg-white/10">
              {t.talkCta}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3">
                <img src={logo} alt="" className="h-10 w-10" />
                <span className="font-outfit text-2xl font-bold tracking-widest leading-none">SOLVIX</span>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t.footerSlogan}</p>
            </div>
            {t.footerCols.map((c) => (
              <div key={c.h}>
                <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">{c.h}</h4>
                <ul className="space-y-4">
                  {c.items.map((i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-indigo-400">{i}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-10 text-xs text-muted-foreground">
            <div>{t.rights}</div>
            <div className="flex gap-8">
              {t.legal.map((l) => (<a key={l} href="#" className="transition-colors hover:text-white">{l}</a>))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
