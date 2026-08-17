import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerAgencyTools(server: McpServer) {
  server.tool(
    "get_available_clients",
    "Busca a lista de todos os clientes (slugs) configurados e disponíveis neste servidor MCP da agência.",
    {},
    async () => {
      try {
        const clients: string[] = [];
        
        // Vasculha as variáveis de ambiente procurando pelo padrão KOMMO_*_DOMAIN
        for (const key in process.env) {
          if (key.startsWith("KOMMO_") && key.endsWith("_DOMAIN")) {
            // Extrai o slug do meio. Ex: KOMMO_CASA_DESPERTAR_DOMAIN -> CASA_DESPERTAR -> casa_despertar
            const slug = key.replace("KOMMO_", "").replace("_DOMAIN", "").toLowerCase();
            clients.push(slug);
          }
        }

        if (clients.length === 0) {
          return { content: [{ type: "text", text: "Nenhum cliente configurado nas variáveis de ambiente do servidor ainda." }] };
        }

        return {
          content: [
            { 
              type: "text", 
              text: `Clientes disponíveis no servidor (use estes slugs no parâmetro client_slug):\n${clients.map(c => `- ${c}`).join('\n')}` 
            }
          ]
        };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro ao buscar clientes: ${error.message}` }], isError: true };
      }
    }
  );
}
