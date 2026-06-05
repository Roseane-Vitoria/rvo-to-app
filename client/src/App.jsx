import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Landing from "./screens/Landing";
import Interview from "./screens/Interview";
import MarketResearch from "./screens/MarketResearch";
import Prompts from "./screens/Prompts";

const SESSION_KEY = "rvo-to-app-session";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [initialIdea, setInitialIdea] = useState("");
  const [messages, setMessages] = useState([]);
  const [researchData, setResearchData] = useState(null);
  const [promptsData, setPromptsData] = useState(null);

  // Carrega a sessão salva ao montar o componente
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        setScreen(session.screen || "landing");
        setInitialIdea(session.initialIdea || "");
        setMessages(session.messages || []);
        setResearchData(session.researchData || null);
        setPromptsData(session.promptsData || null);
        console.log("Sessão RvoToApp restaurada com sucesso.");
      }
    } catch (e) {
      console.error("Erro ao carregar sessão do localStorage:", e);
    }
  }, []);

  // Salva a sessão no localStorage a cada mudança relevante no estado
  useEffect(() => {
    if (screen === "landing" && !initialIdea) {
      // Se estiver na landing zerada, removemos a chave para limpar vestígios
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    const session = {
      screen,
      initialIdea,
      messages,
      researchData,
      promptsData,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [screen, initialIdea, messages, researchData, promptsData]);

  // Função para recomeçar o fluxo completo
  const handleRestart = () => {
    localStorage.removeItem(SESSION_KEY);
    setScreen("landing");
    setInitialIdea("");
    setMessages([]);
    setResearchData(null);
    setPromptsData(null);
  };

  const handleStartInterview = (idea) => {
    setInitialIdea(idea);
    setScreen("interview");
  };

  const handleCompleteInterview = () => {
    setScreen("market-research");
  };

  const handleCompleteResearch = () => {
    setScreen("prompts");
  };

  return (
    <div className="relative min-h-screen bg-darkBg text-zinc-100 flex flex-col selection:bg-violet-600/30 selection:text-violet-200 overflow-x-hidden">
      {/* Elementos de Brilho de Fundo (Aesthetics) */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-900/10 bg-glow animate-pulse-glow" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-[10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/10 bg-glow animate-pulse-glow" style={{ animationDuration: "12s", animationDelay: "2s" }} />
      
      {/* Header */}
      <Header currentScreen={screen} onRestart={handleRestart} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        {screen === "landing" && (
          <Landing onStart={handleStartInterview} />
        )}
        {screen === "interview" && (
          <Interview
            initialIdea={initialIdea}
            messages={messages}
            setMessages={setMessages}
            onComplete={handleCompleteInterview}
          />
        )}
        {screen === "market-research" && (
          <MarketResearch
            initialIdea={initialIdea}
            messages={messages}
            researchData={researchData}
            setResearchData={setResearchData}
            onComplete={handleCompleteResearch}
          />
        )}
        {screen === "prompts" && (
          <Prompts
            initialIdea={initialIdea}
            messages={messages}
            researchData={researchData}
            promptsData={promptsData}
            setPromptsData={setPromptsData}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/5 bg-zinc-950/20 text-center text-xs text-zinc-600">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RvoToApp. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Termos</span>
            <span className="hover:text-zinc-400 cursor-pointer">Privacidade</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
