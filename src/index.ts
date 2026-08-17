import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { registerLeadTools } from "./tools/leads.js";
import { registerContactTools } from "./tools/contacts.js";
import { registerPipelineTools } from "./tools/pipelines.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerNoteTools } from "./tools/notes.js";
import { registerChatTools } from "./tools/chats.js";
import { registerCompanyTools } from "./tools/companies.js";
import { registerLinkTools } from "./tools/links.js";
import { registerMetadataTools } from "./tools/metadata.js";
import { registerTemplateTools } from "./tools/templates.js";
import { registerSalesbotTools } from "./tools/salesbots.js";
import { registerWebhookTools } from "./tools/webhooks.js";
import { registerEventTools } from "./tools/events.js";
import { registerAgencyTools } from "./tools/agency.js";
import { registerCatalogTools } from "./tools/catalogs.js";
import { registerUserTools } from "./tools/users.js";

dotenv.config();

// Inicializa o servidor MCP
const server = new McpServer({
  name: "Kommo-CRM-MCP-Agency",
  version: "2.0.0",
});

// Registra todas as ferramentas (que agora exigem client_slug)
registerAgencyTools(server);
registerLeadTools(server);
registerContactTools(server);
registerPipelineTools(server);
registerTaskTools(server);
registerNoteTools(server);
registerChatTools(server);
registerCompanyTools(server);
registerLinkTools(server);
registerMetadataTools(server);
registerTemplateTools(server);
registerSalesbotTools(server);
registerWebhookTools(server);
registerEventTools(server);
registerCatalogTools(server);
registerUserTools(server);

// Configuração do Express para o Easypanel (SSE)
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// A variável transport precisa estar fora das rotas para manter estado global de SSE
let transport: SSEServerTransport;

// Rota de Conexão SSE
app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
  console.log("Novo cliente MCP conectado via SSE!");
});

// Rota de Mensagens (RPC POST)
app.post("/message", express.json(), async (req, res) => {
  if (!transport) {
    res.status(500).send("Transport não inicializado. Conecte no /sse primeiro.");
    return;
  }
  await transport.handlePostMessage(req, res);
});

// Endpoint de Healthcheck pro Easypanel
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "2.0.0" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor MCP da Kommo rodando na porta ${PORT}`);
  console.log(`🔗 Endpoint SSE para conectar a IA: https://kommo-mcp.stamina.digital/sse`);
});
