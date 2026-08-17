import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function main() {
  console.log("Tentando conectar via SSE...");
  try {
    const transport = new SSEClientTransport(new URL("https://kommo-mcp.stamina.digital/sse"));
    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    console.log("Conectado com sucesso!");
    const tools = await client.listTools();
    console.log("Ferramentas carregadas: " + tools.tools.length);
    console.log(tools.tools.map((t) => t.name).join(", "));
    process.exit(0);
  } catch (e) {
    console.error("Erro:", e.message);
    process.exit(1);
  }
}
main();
