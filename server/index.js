import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { chatInterview, generateMarketResearch, generateCodingPrompts } from "./services/gemini.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Log de requisições simples
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Endpoint de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Endpoint do Chat de Entrevista
app.post("/api/chat", async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "O campo 'message' é obrigatório." });
  }

  try {
    const responseText = await chatInterview(history, message);
    res.json({ response: responseText });
  } catch (error) {
    console.error("Erro na rota /api/chat:", error);
    res.status(500).json({ error: "Erro interno ao processar conversa com o Gemini." });
  }
});

// Endpoint de Pesquisa de Mercado
app.post("/api/market-research", async (req, res) => {
  const { initialIdea, chatHistory } = req.body;

  if (!initialIdea || !chatHistory) {
    return res.status(400).json({ error: "Os campos 'initialIdea' e 'chatHistory' são obrigatórios." });
  }

  try {
    const researchData = await generateMarketResearch(initialIdea, chatHistory);
    res.json(researchData);
  } catch (error) {
    console.error("Erro na rota /api/market-research:", error);
    res.status(500).json({ error: "Erro interno ao gerar a pesquisa de mercado." });
  }
});

// Endpoint de Geração de Prompts
app.post("/api/generate-prompts", async (req, res) => {
  const { initialIdea, chatHistory, marketResearch } = req.body;

  if (!initialIdea || !chatHistory || !marketResearch) {
    return res.status(400).json({ error: "Os campos 'initialIdea', 'chatHistory' e 'marketResearch' são obrigatórios." });
  }

  try {
    const promptsData = await generateCodingPrompts(initialIdea, chatHistory, marketResearch);
    res.json(promptsData);
  } catch (error) {
    console.error("Erro na rota /api/generate-prompts:", error);
    res.status(500).json({ error: "Erro interno ao gerar prompts de vibe coding." });
  }
});

// Servir arquivos estáticos do frontend em produção
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// Fallback para qualquer rota não mapeada (SPA routing)
app.get("*", (req, res) => {
  // Se for uma rota de API que não existe, retorna 404
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Rota de API não encontrada." });
  }
  
  // Caso contrário, serve o index.html se ele existir no build
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      res.status(404).send("Front-end ainda não foi compilado para produção. Por favor, execute a build do cliente.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Servidor RvoToApp rodando na porta ${PORT}`);
  console.log(` Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`====================================================`);
});
