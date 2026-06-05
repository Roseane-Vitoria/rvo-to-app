import React, { useState, useRef, useEffect } from "react";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { Send, Sparkles, User, BrainCircuit, ArrowRight } from "lucide-react";

export default function Interview({ initialIdea, messages, setMessages, onComplete }) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estados de progresso da entrevista
  const [round, setRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const messagesEndRef = useRef(null);

  // Faz o scroll automático do chat ao receber novas mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Dispara a primeira pergunta quando a tela carrega e o chat está vazio
  useEffect(() => {
    if (messages.length === 0) {
      sendInitialMessage();
    } else {
      // Se já houver mensagens salvas, re-parseia o progresso para restaurar a tela corretamente
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant");
      if (lastAssistantMsg) {
        const parsed = parseResponse(lastAssistantMsg.rawContent || lastAssistantMsg.content);
        setRound(parsed.round);
        setCurrentQuestion(parsed.questionNum);
        setIsCompleted(parsed.completed);
      }
    }
  }, []);

  // Analisa as tags da resposta da IA ([ROUND: X, PERGUNTA: Y/8] ou [ROUND: 3, CONCLUIDO])
  const parseResponse = (rawText) => {
    let r = 1;
    let q = 1;
    let comp = false;
    let clean = rawText;

    const roundRegex = /\[ROUND:\s*(\d),\s*PERGUNTA:\s*(\d)\/8\]/i;
    const completedRegex = /\[ROUND:\s*3,\s*CONCLUIDO\]/i;

    if (completedRegex.test(rawText)) {
      comp = true;
      r = 3;
      q = 8;
      clean = rawText.replace(completedRegex, "").trim();
    } else {
      const match = rawText.match(roundRegex);
      if (match) {
        r = parseInt(match[1], 10);
        q = parseInt(match[2], 10);
        clean = rawText.replace(roundRegex, "").trim();
      }
    }

    return { round: r, questionNum: q, completed: comp, cleanText: clean };
  };

  // Envia a primeira mensagem com a ideia inicial do usuário
  const sendInitialMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: [],
          message: `Minha ideia de aplicativo é: ${initialIdea}`,
        }),
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      const parsed = parseResponse(data.response);
      setRound(parsed.round);
      setCurrentQuestion(parsed.questionNum);
      setIsCompleted(parsed.completed);

      setMessages([
        {
          role: "assistant",
          content: parsed.cleanText,
          rawContent: data.response, // Salvamos para recuperar o estado no refresh
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        {
          role: "assistant",
          content: "Olá! Desculpe, tive um problema ao iniciar nossa entrevista. Poderia recomeçar?",
          rawContent: "[ROUND: 1, PERGUNTA: 1/8] Erro de rede",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Envia a resposta do usuário
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading || isCompleted) return;

    const userMessage = inputText.trim();
    setInputText("");

    // Adiciona a resposta do usuário no chat
    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Enviamos o histórico completo no formato [{role, content}]
      // O backend cuidará de formatar conforme o SDK do Gemini espera
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedMessages,
          message: userMessage,
        }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const parsed = parseResponse(data.response);
      setRound(parsed.round);
      setCurrentQuestion(parsed.questionNum);
      setIsCompleted(parsed.completed);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: parsed.cleanText,
          rawContent: data.response,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Tive uma falha de comunicação com o servidor da IA. Por favor, tente enviar novamente.",
          rawContent: `[ROUND: ${round}, PERGUNTA: ${currentQuestion}/8]`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 relative z-10 flex flex-col h-[calc(100vh-5rem)]">
      {/* Barra de Progresso Superior */}
      <div className="glass-panel rounded-2xl p-6 mb-6">
        <ProgressBar round={round} currentQuestion={currentQuestion} />
      </div>

      {/* Janela do Chat */}
      <div className="flex-1 glass-panel rounded-2xl p-6 overflow-y-auto mb-6 space-y-4 min-h-[200px]">
        {messages.map((msg, idx) => {
          const isAI = msg.role === "assistant";
          return (
            <div
              key={idx}
              className={`flex w-full gap-3 items-start ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400">
                  <BrainCircuit className="h-4 w-4" />
                </div>
              )}
              
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] ${
                  isAI
                    ? "bg-zinc-900/60 text-zinc-100 border border-white/5"
                    : "bg-violet-600 text-white shadow-md shadow-violet-600/15"
                }`}
              >
                {msg.content}
              </div>

              {!isAI && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Indicador de carregamento/digitação da IA */}
        {loading && (
          <div className="flex w-full gap-3 items-start justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-zinc-900/60 border border-white/5 flex items-center gap-1.5 h-10">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem ou Botão de Ação Final */}
      <div className="w-full">
        {isCompleted ? (
          <div className="flex flex-col items-center gap-4 bg-violet-950/10 border border-violet-500/20 rounded-2xl p-6 text-center animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-violet-300 font-outfit mb-1">
                Entrevista Concluída!
              </h3>
              <p className="text-xs text-zinc-400">
                Sua ideia foi refinada com sucesso. Agora, vamos analisar o mercado e concorrentes.
              </p>
            </div>
            <Button
              onClick={onComplete}
              icon={ArrowRight}
              className="w-full sm:w-auto font-semibold px-8 py-3.5"
            >
              Análise de mercado
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              className="flex-1 glass-input rounded-xl px-4 py-3.5 text-sm"
              placeholder="Digite sua resposta aqui..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="px-4 py-3.5 rounded-xl shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
