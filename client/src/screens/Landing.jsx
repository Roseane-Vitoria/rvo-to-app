import React, { useState } from "react";
import Button from "../components/Button";
import { ArrowRight, Sparkles, MessageSquare, Compass, Code } from "lucide-react";

export default function Landing({ onStart }) {
  const [idea, setIdea] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError("Por favor, descreva sua ideia antes de prosseguir.");
      return;
    }
    if (idea.trim().length < 15) {
      setError("Por favor, descreva sua ideia com um pouco mais de detalhes (mínimo 15 caracteres).");
      return;
    }
    setError("");
    onStart(idea);
  };

  const steps = [
    {
      icon: MessageSquare,
      title: "1. Entrevista de Refinamento",
      desc: "Um agente de IA conduzirá uma breve conversa interativa de 3 rounds para lapidar seu problema, público-alvo e recursos essenciais.",
    },
    {
      icon: Compass,
      title: "2. Pesquisa de Mercado",
      desc: "Nossa IA faz um levantamento completo de concorrentes diretos, oportunidades e riscos, avaliando a viabilidade da sua ideia.",
    },
    {
      icon: Code,
      title: "3. Prompts de Vibe Coding",
      desc: "Receba 3 prompts prontos e otimizados para colar no Replit Agent, Lovable ou Bolt.new e começar a criar o seu aplicativo na hora.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20 text-center relative z-10">
      {/* Badge promocional de IA */}
      <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-950/20 px-4 py-1.5 text-sm font-semibold text-violet-300">
        <Sparkles className="h-4 w-4 animate-pulse text-violet-400" />
        <span>Impulsionado por Gemini 1.5 Flash</span>
      </div>

      {/* Título Principal */}
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-outfit text-white mb-6">
        Sua ideia vira app <br />
        <span className="text-gradient">em poucos minutos</span>
      </h1>

      {/* Subtítulo */}
      <p className="mx-auto max-w-2xl text-lg text-zinc-400 mb-12 leading-relaxed">
        Descreva sua ideia em poucas palavras. Nós guiamos você através de uma entrevista inteligente, fazemos a análise de concorrência e entregamos os prompts perfeitos para ferramentas de Vibe Coding.
      </p>

      {/* Campo de Texto para a Ideia */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl text-left mb-16">
        <div className="group relative rounded-2xl border border-white/5 bg-zinc-900/40 p-4 transition-all duration-300 focus-within:border-violet-500/50 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)]">
          <label htmlFor="idea-input" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            O que seu aplicativo vai fazer?
          </label>
          <textarea
            id="idea-input"
            rows="4"
            className="w-full bg-transparent border-0 text-white placeholder-zinc-600 focus:ring-0 focus:outline-none resize-none text-base leading-relaxed"
            placeholder="Ex: Quero criar um aplicativo de agendamento de banho e tosa para pets em domicílio, com pagamento direto no app e sistema de rotas para os profissionais..."
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              if (e.target.value.trim().length >= 15) setError("");
            }}
          />
          <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
            <span className="text-xs text-zinc-600">
              {idea.length} caracteres digitados
            </span>
            {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            icon={ArrowRight}
            className="w-full sm:w-auto font-semibold px-8 py-4 text-base"
          >
            Começar análise
          </Button>
        </div>
      </form>

      {/* Sessão dos Passos */}
      <div className="border-t border-white/5 pt-16">
        <h2 className="text-2xl font-bold font-outfit text-white mb-10 text-center">
          Como funciona o fluxo?
        </h2>
        <div className="grid gap-6 md:grid-cols-3 text-left">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-white/5 bg-zinc-900/20 p-6 hover:border-white/10 hover:bg-zinc-900/40 transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 group-hover:bg-violet-600/20 transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white font-outfit mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
