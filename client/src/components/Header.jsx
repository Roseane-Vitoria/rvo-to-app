import React from "react";
import { RefreshCw, Zap } from "lucide-react";

export default function Header({ currentScreen, onRestart }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-darkBg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onRestart}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-purple-500 shadow-lg shadow-violet-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-outfit">
            Rvo<span className="text-violet-400">To</span>App
          </span>
        </div>

        {/* Botão Recomeçar */}
        {currentScreen !== "landing" && (
          <button
            onClick={onRestart}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-400 hover:border-violet-500/50 hover:bg-violet-950/20 hover:text-white transition-all duration-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Recomeçar</span>
          </button>
        )}
      </div>
    </header>
  );
}
