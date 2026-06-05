import React from "react";
import { Check, ShieldQuestion, User, HelpCircle } from "lucide-react";

export default function ProgressBar({ round, currentQuestion }) {
  const steps = [
    { id: 1, name: "Problema", icon: ShieldQuestion, desc: "Round 1" },
    { id: 2, name: "Usuário", icon: User, desc: "Round 2" },
    { id: 3, name: "Funcionalidades", icon: HelpCircle, desc: "Round 3" },
  ];

  // Calcula a porcentagem geral de preenchimento (0 a 100%)
  const percentage = Math.min(Math.round(((currentQuestion - 1) / 8) * 100), 100);

  return (
    <div className="w-full">
      {/* Barra de Progresso Visual */}
      <div className="relative flex items-center justify-between">
        {/* Linha de fundo */}
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-zinc-800" />
        
        {/* Linha de progresso ativa */}
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />

        {/* Marcadores das etapas */}
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = round > step.id;
          const isActive = round === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : isActive
                    ? "bg-zinc-900 border-violet-400 text-violet-400 shadow-md shadow-violet-500/10 pulse-border"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>
              
              <span
                className={`mt-2 text-xs font-semibold tracking-wider uppercase font-outfit transition-all duration-300 ${
                  isActive ? "text-violet-400" : isCompleted ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                {step.name}
              </span>
              <span className="text-[10px] text-zinc-500">{step.desc}</span>
            </div>
          );
        })}
      </div>

      {/* Subtítulo com detalhamento da pergunta */}
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
        <span>Progresso da entrevista</span>
        <span className="font-semibold text-zinc-200">
          Pergunta {currentQuestion <= 8 ? `${currentQuestion}/8` : "Concluída"} ({percentage}%)
        </span>
      </div>
    </div>
  );
}
