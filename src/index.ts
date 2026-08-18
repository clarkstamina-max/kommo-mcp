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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Mapa para guardar as conexões (transports) de cada cliente Claude ativo
const transports = new Map<string, SSEServerTransport>();

// Rota de Conexão SSE
app.get("/sse", async (req, res) => {
  console.log(`[GET /sse] Nova conexão iniciada.`);
  const messageUrl = "https://kommo-mcp.stamina.digital/message";
  const transport = new SSEServerTransport(messageUrl, res);
  
  // Cria uma nova instância de servidor MCP EXCLUSIVA para essa conexão
  const server = new McpServer({
    name: "Kommo-CRM-MCP-Agency",
    version: "2.0.0",
  });

  // Registra todas as ferramentas na instância dessa conexão
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

  // Armazena no mapa usando o sessionId gerado pelo SDK
  transports.set(transport.sessionId, transport);
  
  // Limpa a memória quando o Claude desconectar
  req.on("close", () => {
    transports.delete(transport.sessionId);
    server.close();
    console.log(`Cliente desconectado: ${transport.sessionId}`);
  });

  await server.connect(transport);
  console.log(`Novo cliente conectado via SSE! Session ID: ${transport.sessionId}`);
});

// Rota de Mensagens (RPC POST)
app.post("/message", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  console.log(`[POST /message] Requisição recebida. SessionID: '${sessionId}'`);
  
  const transport = transports.get(sessionId);
  
  if (!transport) {
    console.log(`[POST /message] ERRO: Sessão '${sessionId}' não encontrada no Map. Total de sessões ativas: ${transports.size}`);
    res.status(404).send("Sessão SSE não encontrada.");
    return;
  }
  
  await transport.handlePostMessage(req, res);
});

// Endpoint de Healthcheck pro Easypanel
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "2.0.1" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor MCP da Kommo rodando na porta ${PORT}`);
  console.log(`🔗 Endpoint SSE para conectar a IA: https://kommo-mcp.stamina.digital/sse`);
});
