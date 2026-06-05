# RvoToApp 🚀

RvoToApp é uma ferramenta web interativa desenvolvida em português brasileiro para ajudar empreendedores, desenvolvedores e criadores a transformarem suas ideias de aplicativos em realidade utilizando inteligência artificial.

A plataforma guia o usuário por três rounds de entrevista detalhada (Problema, Usuário e Funcionalidades), gera uma análise de mercado simulada com base no conhecimento consolidado da IA e cria prompts otimizados para três principais plataformas de **Vibe Coding**: Replit Agent, Lovable.dev e Bolt.new.

---

## 🛠️ Stack Técnica

- **Frontend**: React + Vite + Tailwind CSS v4 + Lucide React (Ícones)
- **Backend**: Node.js + Express
- **IA**: Gemini API (`gemini-1.5-flash`)
- **Deploy**: Otimizado para Replit com orquestração de arquivos estáticos.

---

## 📂 Estrutura do Diretório

```
rvo-to-app/
├── package.json          # Script de automação root
├── .env                  # Chaves de API locais (Ignorado no Git)
├── .env.example          # Exemplo das chaves necessárias
├── replit.nix            # Dependências Nix para o Replit
├── .replit               # Comando de inicialização do Replit
├── README.md             # Instruções e documentação
├── server/               # Servidor Express + API do Gemini
│   ├── package.json
│   ├── index.js          # Servidor principal
│   └── services/
│       └── gemini.js     # Integração direta com SDK da Gemini API
└── client/               # Frontend React (Vite)
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html        # Página principal com SEO
    └── src/
        ├── index.css     # Estilos e design system personalizado
        ├── main.jsx
        ├── App.jsx       # Roteamento e persistência de localStorage
        ├── components/   # Componentes visuais premium
        └── screens/      # Landing, Entrevista, Mercado e Prompts
```

---

## 🔑 Configuração das Chaves de API

Para que o aplicativo funcione corretamente com a inteligência artificial, você deve fornecer sua chave de API do Gemini.

1. Duplique o arquivo `.env.example` na raiz do projeto e renomeie-o para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo `.env` e substitua o valor do `GEMINI_API_KEY` pela sua chave:
   ```env
   GEMINI_API_KEY=AIzaSy... (sua chave do Google AI Studio)
   ```

> 💡 **Como obter a chave**: Acesse o [Google AI Studio](https://aistudio.google.com/), faça login com sua conta Google e clique em **"Create API Key"**. O uso do modelo `gemini-1.5-flash` é gratuito sob quotas padrão.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
Certifique-se de possuir o **Node.js** (versão 20.19+ ou 22.12+) instalado globalmente na sua máquina.

### Passos para rodar
1. **Instalar Dependências**:
   Na raiz do projeto, instale os pacotes de todas as pastas executando:
   ```bash
   npm run install-all
   ```
2. **Iniciar em Desenvolvimento**:
   Para rodar o frontend e o backend simultaneamente, execute:
   ```bash
   npm run dev
   ```
   Isso irá iniciar:
   - O **Backend** em `http://localhost:3001`
   - O **Frontend** em `http://localhost:5173` (ou porta subsequente disponível)

Abra seu navegador no endereço indicado pelo terminal do frontend para experimentar o app!

---

## ☁️ Como Fazer Deploy no Replit

O RvoToApp já vem 100% configurado para o Replit. Para fazer deploy:

1. Crie um novo Repl no [Replit](https://replit.com) importando este repositório ou fazendo o upload dos arquivos.
2. Certifique-se de selecionar a stack **Node.js**.
3. No painel de **Secrets** (Ferramenta "Secrets" ou ícone de cadeado no menu lateral), adicione a seguinte chave:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *[Insira sua chave obtida no Google AI Studio]*
4. O Replit lerá automaticamente o arquivo `.replit` e o `replit.nix` configurados.
5. Clique no botão azul **Run** no topo. O Replit irá:
   - Executar `npm run build` para compilar o frontend React.
   - Executar `npm start` para levantar o servidor Express em produção (na porta correspondente fornecida pelo Replit).
   - O servidor Express servirá automaticamente os arquivos de build estáticos, abrindo a aplicação no painel WebView do Replit.
