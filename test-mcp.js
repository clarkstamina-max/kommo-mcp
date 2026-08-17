import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import dns from "node:dns";

// Força o Node.js a usar o DNS do Google (8.8.8.8) para driblar o cache da operadora
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function main() {
  console.log("Tentando conectar via SSE (Bypass de DNS usando 8.8.8.8)...");
  try {
    const transport = new SSEClientTransport(new URL("https://kommo-mcp.stamina.digital/sse"));
    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    console.log("🔥 CONECTADO COM SUCESSO! A mágica funcionou!");
    const tools = await client.listTools();
    console.log("🔥 FERRAMENTAS CARREGADAS DA NUVEM: " + tools.tools.length);
    console.log(tools.tools.map((t) => t.name).join(", "));
    process.exit(0);
  } catch (e) {
    console.error("Erro:", e.message);
    process.exit(1);
  }
}
main();
