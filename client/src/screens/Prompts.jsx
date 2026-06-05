import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { Copy, Check, Sparkles, Terminal, Code2, AppWindow, ArrowUpRight, Cpu } from "lucide-react";

export default function Prompts({
  initialIdea,
  messages,
  researchData,
  promptsData,
  setPromptsData,
  onRestart,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("replit"); // 'replit' | 'lovable' | 'bolt'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!promptsData) {
      fetchPrompts();
    }
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialIdea,
          chatHistory: messages,
          marketResearch: researchData,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPromptsData(data);
    } catch (err) {
      console.error(err);
      setError("Houve uma falha ao gerar os prompts. Deseja tentar novamente?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center relative z-10">
        <div className="relative mb-8 flex justify-center">
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-violet-600/10" />
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-600/10 border border-violet-500/30 text-violet-400">
            <Code2 className="h-10 w-10 animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold font-outfit text-white mb-2">
          Gerando Prompts de Vibe Coding
        </h3>
        <p className="text-sm text-zinc-400">
          Estruturando arquitetura, otimizando schemas de banco de dados e refinando interfaces para cada ferramenta...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center relative z-10">
        <h3 className="text-lg font-bold font-outfit text-white mb-2">Erro de Processamento</h3>
        <p className="text-sm text-zinc-400 mb-6">{error}</p>
        <Button onClick={fetchPrompts}>Tentar novamente</Button>
      </div>
    );
  }

  if (!promptsData) return null;

  const tabs = [
    { id: "replit", name: "Replit Agent", icon: Terminal },
    { id: "lovable", name: "Lovable.dev", icon: AppWindow },
    { id: "bolt", name: "Bolt.new", icon: Cpu },
  ];

  const activeData = promptsData[activeTab];
  const ActiveIcon = tabs.find(t => t.id === activeTab).icon;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12 relative z-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-950/20 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-300 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Fase Final</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">
          Prompts Prontos para Uso
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-xl mx-auto">
          Escolha a plataforma de sua preferência abaixo, copie o prompt otimizado e cole no assistente de vibe coding para começar a criar seu app.
        </p>
      </div>

      {/* Seletor de Abas (Tabs) */}
      <div className="flex justify-center border-b border-white/5 mb-8">
        <div className="flex gap-2 p-1 bg-zinc-950 border border-white/5 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCopied(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/15"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Painel Central e Prompt (Col 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl overflow-hidden">
            {/* Header do Prompt */}
            <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/15 text-violet-400">
                  <ActiveIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white font-outfit text-sm">
                    Prompt Otimizado para {tabs.find(t => t.id === activeTab).name}
                  </h3>
                  <span className="text-[10px] text-violet-300 font-semibold px-2 py-0.5 rounded-full bg-violet-950/30 border border-violet-500/20 mt-0.5 inline-block">
                    {activeData.badge}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCopy(activeData.prompt)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  copied
                    ? "bg-emerald-600/10 border-emerald-500/25 text-emerald-400"
                    : "bg-violet-600 text-white border-violet-500 hover:bg-violet-500"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copiado!" : "Copiar prompt"}</span>
              </button>
            </div>

            {/* Prompt Box */}
            <div className="p-6">
              <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px] select-all">
                {activeData.prompt}
              </pre>
            </div>
          </div>
        </div>

        {/* Painel de Instruções de Uso (Col 1) */}
        <div className="space-y-6">
          <Card
            title="Como Usar"
            subtitle="Siga os passos abaixo na ferramenta:"
            variant="default"
          >
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed font-sans whitespace-pre-line">
                {activeData.instrucoes}
              </p>
              
              <div className="border-t border-white/5 pt-4 mt-4">
                <a
                  href={
                    activeTab === "replit"
                      ? "https://replit.com"
                      : activeTab === "lovable"
                      ? "https://lovable.dev"
                      : "https://bolt.new"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 border border-white/10 hover:border-violet-500/30 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition-all duration-200"
                >
                  <span>Acessar {tabs.find(t => t.id === activeTab).name}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                </a>
              </div>
            </div>
          </Card>

          {/* Card Recomeçar */}
          <Card title="Deseja testar outra ideia?" className="border-violet-500/10 bg-violet-950/5">
            <p className="text-xs text-zinc-400 mb-4">
              Você pode reiniciar o fluxo para entrevistar uma nova ideia e obter novos prompts.
            </p>
            <Button onClick={onRestart} variant="secondary" className="w-full">
              Analisar novo app
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
