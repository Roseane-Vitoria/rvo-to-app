import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { ArrowRight, Globe, ShieldAlert, Sparkles, TrendingUp, Users, AlertTriangle } from "lucide-react";

export default function MarketResearch({
  initialIdea,
  messages,
  researchData,
  setResearchData,
  onComplete,
}) {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  const loadingTexts = [
    "Analisando a ideia e transcrição da entrevista...",
    "Mapeando o ecossistema de concorrentes...",
    "Estimando o tamanho de mercado...",
    "Cruzando dados para identificar oportunidades exclusivas...",
    "Formatando o relatório de validação final..."
  ];

  useEffect(() => {
    if (!researchData) {
      fetchResearchData();
    }
  }, []);

  // Controla a animação do texto de carregamento
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const fetchResearchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/market-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialIdea,
          chatHistory: messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResearchData(data);
    } catch (err) {
      console.error(err);
      setError("Houve uma falha ao gerar a análise de mercado. Deseja tentar novamente?");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center relative z-10">
        <div className="relative mb-8 flex justify-center">
          {/* Animação de radar/pulso */}
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-violet-600/10" />
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-600/10 border border-violet-500/30 text-violet-400">
            <TrendingUp className="h-10 w-10 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold font-outfit text-white mb-2">
          Análise Inteligente de Mercado
        </h3>
        
        {/* Texto de carregamento alternado */}
        <p className="text-sm text-zinc-400 min-h-[40px] animate-pulse">
          {loadingTexts[loadingStep]}
        </p>

        {/* Mini barra de carregamento */}
        <div className="mx-auto mt-6 max-w-xs h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-1000"
            style={{ width: `${((loadingStep + 1) / loadingTexts.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center relative z-10">
        <div className="mb-6 flex justify-center text-red-500">
          <AlertTriangle className="h-16 w-16" />
        </div>
        <h3 className="text-lg font-bold font-outfit text-white mb-2">
          Erro de Processamento
        </h3>
        <p className="text-sm text-zinc-400 mb-6">{error}</p>
        <Button onClick={fetchResearchData}>Tentar novamente</Button>
      </div>
    );
  }

  if (!researchData) return null;

  // Helpers para o Nível de Concorrência
  const getConcorrenciaBadge = (nivel) => {
    const n = (nivel || "").toLowerCase();
    if (n === "baixo") {
      return { text: "Baixo", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    }
    if (n === "médio" || n === "medio") {
      return { text: "Médio", style: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    }
    return { text: "Alto", style: "bg-red-500/10 text-red-400 border-red-500/20" };
  };

  const badge = getConcorrenciaBadge(researchData.nivelConcorrencia);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 relative z-10">
      {/* Header da Análise */}
      <div className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-950/20 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pesquisa Pronta</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">
            Relatório de Mercado
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Resultados consolidados com base na entrevista de refinamento.
          </p>
        </div>
        
        <Button
          onClick={onComplete}
          icon={ArrowRight}
          className="mt-6 md:mt-0 font-semibold shadow-lg shrink-0"
        >
          Gerar prompts de vibe coding
        </Button>
      </div>

      {/* Grid Principal */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Painel Esquerdo: Tamanho, Nível Concorrência e Diferencial (Oportunidade) */}
        <div className="md:col-span-2 space-y-6">
          {/* Oportunidade Identificada */}
          <Card
            title="Oportunidade de Mercado"
            variant="success"
            className="h-full"
          >
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Seu Diferencial Competitivo</p>
                <p className="text-zinc-300 text-sm">{researchData.oportunidade}</p>
              </div>
            </div>
          </Card>

          {/* Cards Lado a Lado: Tamanho de Mercado e Nível de Concorrência */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card title="Tamanho do Mercado">
              <div className="flex gap-3 items-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {researchData.tamanhoMercado}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Nível de Concorrência">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${badge.style}`}>
                    Concorrência: {badge.text}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {researchData.justificativaConcorrencia}
                </p>
              </div>
            </Card>
          </div>

          {/* Validação: Pontos Fortes e Riscos */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card title="Pontos Fortes da Ideia" variant="success">
              <ul className="space-y-2 text-sm text-zinc-300">
                {researchData.validacao?.pontosFortes?.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 mt-2 shrink-0 rounded-full bg-emerald-500" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Riscos & Desafios" variant="warning">
              <ul className="space-y-2 text-sm text-zinc-300">
                {researchData.validacao?.riscos?.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 mt-2 shrink-0 rounded-full bg-amber-500" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Painel Direito: Concorrentes (3 Cards) */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-outfit text-white tracking-wide border-b border-white/5 pb-2">
            Concorrentes Diretos
          </h2>
          
          {researchData.concorrentes?.map((conc, idx) => (
            <Card
              key={idx}
              title={conc.nome}
              className="border-white/5 hover:border-violet-500/25 transition-all duration-300"
            >
              <p className="text-zinc-400 text-xs mb-4">
                {conc.descricao}
              </p>
              <a
                href={conc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Visitar site do concorrente</span>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
