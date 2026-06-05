import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("AVISO: GEMINI_API_KEY não está definida nas variáveis de ambiente!");
}

const genAI = new GoogleGenerativeAI(apiKey || "MOCK_KEY");

// Usamos gemini-2.5-flash para respostas rápidas e eficientes no fluxo interativo
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Conduz o chat da entrevista
 * @param {Array} history - Histórico do chat [{ role: 'user'|'model', parts: [{ text: string }] }]
 * @param {string} message - Nova mensagem do usuário
 */
export async function chatInterview(history, message) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: `Você é o assistente virtual da plataforma RvoToApp. Seu objetivo é entrevistar o usuário de forma amigável, acolhedora e direta em português brasileiro para refinar a ideia de aplicativo dele.
      
Regras da entrevista:
1. Faça apenas uma pergunta de cada vez. As perguntas devem ser curtas e objetivas.
2. O número máximo total de perguntas é 8. Conduza a entrevista de forma a finalizá-la em 6 a 8 perguntas.
3. A entrevista é dividida em 3 Rounds:
   - ROUND 1 — Problema: Focado em entender o problema e quem sofre com ele hoje. (Perguntas 1 e 2)
   - ROUND 2 — Usuário: Focado em entender o público-alvo, hábitos e faixa etária. (Perguntas 3, 4 e 5)
   - ROUND 3 — Funcionalidades: Focado nas 3 funcionalidades principais e no que diferencia o app de outros. (Perguntas 6, 7 e 8)
4. Você deve guiar a transição dos rounds de forma sutil.
5. Quando o usuário responder a última pergunta do Round 3 (ou na 8ª pergunta no máximo), NÃO faça mais perguntas. Em vez disso, agradeça, apresente um resumo super objetivo da ideia refinada (título sugerido, problema principal e 3 funcionalidades chave) e finalize dizendo: "A entrevista está concluída! Agora você pode avançar para a Análise de Mercado clicando no botão abaixo."
6. CRÍTICO: No início de TODA resposta que você gerar, você DEVE colocar um cabeçalho indicando o Round e o Número da Pergunta que você está fazendo, no formato exato: "[ROUND: X, PERGUNTA: Y/8]" (por exemplo: "[ROUND: 1, PERGUNTA: 2/8]").
7. Na última mensagem onde a entrevista é concluída, retorne obrigatoriamente a tag "[ROUND: 3, CONCLUIDO]" no início do texto.

Exemplo de primeira interação:
Ideia do usuário: "Quero fazer um app de entrega de comida para pets"
Sua resposta: "[ROUND: 1, PERGUNTA: 1/8] Que ideia fantástica! Para começarmos, qual é o principal problema que o seu aplicativo resolve? E quem sofre mais com isso no dia a dia?"`,
    });

    // Filtra o histórico para o formato do SDK do Gemini
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chatSession.sendMessage(message);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Erro no chat do Gemini:", error);
    throw error;
  }
}

/**
 * Gera a pesquisa de mercado baseada na ideia inicial e nas respostas da entrevista
 * @param {string} initialIdea - Ideia inicial descrita na landing page
 * @param {Array} chatHistory - Histórico da entrevista refinada
 */
export async function generateMarketResearch(initialIdea, chatHistory) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            concorrentes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  descricao: { type: "string" },
                  link: { type: "string" }
                },
                required: ["nome", "descricao", "link"]
              }
            },
            tamanhoMercado: { type: "string" },
            oportunidade: { type: "string" },
            nivelConcorrencia: { type: "string" },
            justificativaConcorrencia: { type: "string" },
            validacao: {
              type: "object",
              properties: {
                pontosFortes: {
                  type: "array",
                  items: { type: "string" }
                },
                riscos: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["pontosFortes", "riscos"]
            }
          },
          required: [
            "concorrentes",
            "tamanhoMercado",
            "oportunidade",
            "nivelConcorrencia",
            "justificativaConcorrencia",
            "validacao"
          ]
        },
        maxOutputTokens: 2000,
      },
      systemInstruction: `Você é um analista de mercado sênior especialista em startups e novos produtos digitais. Baseando-se na ideia inicial do usuário e no histórico da entrevista de refinamento, você deve realizar uma análise de mercado simulada e detalhada.
      
Como não temos acesso a buscas externas em tempo real, use seu vasto conhecimento sobre o mercado mobile e web (Google Play Store, App Store, SaaS) para identificar concorrentes reais ou muito plausíveis e gerar estimativas de mercado sólidas.

Você deve retornar obrigatoriamente um objeto JSON com a seguinte estrutura estruturada:
{
  "concorrentes": [
    {
      "nome": "Nome do Concorrente 1",
      "descricao": "O que ele faz e quais seus pontos fracos/limitações.",
      "link": "https://exemplo-concorrente1.com"
    },
    ... (exatamente 3 concorrentes)
  ],
  "tamanhoMercado": "Estimativa qualitativa e quantitativa do mercado em termos de usuários em potencial, receita anual ou tendências de crescimento globais ou no Brasil.",
  "oportunidade": "Oportunidade identificada: o que falta nos concorrentes que a ideia do usuário resolve (o diferencial competitivo).",
  "nivelConcorrencia": "Baixo" | "Médio" | "Alto",
  "justificativaConcorrencia": "Breve justificativa técnica do porquê o nível de concorrência foi classificado assim.",
  "validacao": {
    "pontosFortes": [
      "Ponto forte 1",
      "Ponto forte 2",
      "Ponto forte 3"
    ],
    "riscos": [
      "Risco/Desafio 1",
      "Risco/Desafio 2",
      "Risco/Desafio 3"
    ]
  }
}

Retorne APENAS o JSON válido.`,
    });

    const contextText = `Ideia Inicial: ${initialIdea}\n\nHistórico da Entrevista:\n${chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}`;
    
    const result = await model.generateContent(contextText);
    const text = result.response.text();
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("FALHA AO PARSEAR JSON DA PESQUISA DE MERCADO. TEXTO BRUTO:");
      console.error(text);
      throw parseError;
    }
  } catch (error) {
    console.error("Erro na geração da pesquisa de mercado:", error);
    throw error;
  }
}

/**
 * Gera prompts otimizados para Replit, Lovable e Bolt.new
 * @param {string} initialIdea - Ideia inicial
 * @param {Array} chatHistory - Histórico da entrevista
 * @param {Object} marketResearch - Resultado da pesquisa de mercado
 */
export async function generateCodingPrompts(initialIdea, chatHistory, marketResearch) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            replit: {
              type: "object",
              properties: {
                badge: { type: "string" },
                prompt: { type: "string" },
                instrucoes: { type: "string" }
              },
              required: ["badge", "prompt", "instrucoes"]
            },
            lovable: {
              type: "object",
              properties: {
                badge: { type: "string" },
                prompt: { type: "string" },
                instrucoes: { type: "string" }
              },
              required: ["badge", "prompt", "instrucoes"]
            },
            bolt: {
              type: "object",
              properties: {
                badge: { type: "string" },
                prompt: { type: "string" },
                instrucoes: { type: "string" }
              },
              required: ["badge", "prompt", "instrucoes"]
            }
          },
          required: ["replit", "lovable", "bolt"]
        },
        maxOutputTokens: 8000,
      },
      systemInstruction: `Você é um Engenheiro de Software especialista em Vibe Coding e plataformas no-code/low-code como Replit Agent, Lovable.dev e Bolt.new. 
Baseado no aplicativo refinado do usuário, você criará 3 prompts prontos e otimizados, cada um projetado especificamente para as características de cada ferramenta.

Você deve retornar obrigatoriamente um objeto JSON com a seguinte estrutura estruturada:
{
  "replit": {
    "badge": "Melhor para apps com banco de dados e backend complexo",
    "prompt": "Um prompt técnico super detalhado focado em backend (Express/Node.js ou Flask/Python), esquema de banco de dados (PostgreSQL/Prisma/SQLite), autenticação de usuários, endpoints de API e configuração para deploy. Descreva a lógica de negócios e as rotas necessárias.",
    "instrucoes": "Instruções passo a passo em português brasileiro de como colar este prompt no Replit Agent e iniciar o desenvolvimento."
  },
  "lovable": {
    "badge": "Melhor para UIs premium, protótipos rápidos e design incrível",
    "prompt": "Um prompt descritivo, focado em design visual, fluxos de navegação, componentes interativos do Shadcn UI, micro-interações, layout responsivo e integração Mock de dados para uma experiência visual perfeita. Use termos ricos em design (glassmorphism, animações suaves, paleta HSL harmoniosa).",
    "instrucoes": "Instruções passo a passo em português brasileiro de como iniciar o projeto no Lovable, colar o prompt e começar a iterar telas."
  },
  "bolt": {
    "badge": "Melhor para aplicações Fullstack completas em React/Vite",
    "prompt": "Um prompt equilibrado fullstack. Ele DEVE incluir a estrutura de pastas sugerida, dependências a instalar (Tailwind, Lucide React, etc.), integração do frontend com um banco de dados cliente-servidor leve (como Supabase ou Postgres local) e instruções estruturadas de arquivos.",
    "instrucoes": "Instruções passo a passo em português brasileiro de como usar no Bolt.new, incluindo a inicialização de arquivos e o gerenciamento de dependências no terminal do Bolt."
  }
}

Retorne APENAS o JSON válido.`,
    });

    const contextText = `Ideia Inicial: ${initialIdea}
    
Histórico da Entrevista:
${chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Análise de Mercado:
${JSON.stringify(marketResearch, null, 2)}`;

    const result = await model.generateContent(contextText);
    const text = result.response.text();
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("FALHA AO PARSEAR JSON DOS PROMPTS. TEXTO BRUTO:");
      console.error(text);
      throw parseError;
    }
  } catch (error) {
    console.error("Erro na geração de prompts de coding:", error);
    throw error;
  }
}
