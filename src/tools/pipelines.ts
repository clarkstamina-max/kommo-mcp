import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient } from '../api/client.js';

export function registerPipelineTools(server: McpServer) {
  // 1. Buscar todos os pipelines (funis)
  server.tool(
    "get_pipelines",
    "Busca a lista de todos os funis de vendas (pipelines) da conta Kommo.",
    {  client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.get("/leads/pipelines");
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );

  // 2. Buscar detalhes de um pipeline específico
  server.tool(
    "get_pipeline_by_id",
    "Busca os detalhes de um funil específico usando o ID (inclui etapas).",
    { pipeline_id: z.number(), client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug, pipeline_id }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.get(`/leads/pipelines/${pipeline_id}`);
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );

  // 3. Criar Pipeline (Funil)
  server.tool(
    "create_pipeline",
    "Cria um novo funil de vendas (pipeline) no CRM.",
    {
      name: z.string().describe("Nome do novo funil"),
      sort: z.number().optional().describe("Ordem de exibição"),
      is_main: z.boolean().optional().describe("Se é o funil principal"),
      client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug, ...pipelineData }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.post("/leads/pipelines", [pipelineData]);
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );

  // 4. Atualizar Pipeline
  server.tool(
    "update_pipeline",
    "Atualiza o nome ou propriedades de um funil existente.",
    {
      id: z.number().describe("ID do funil"),
      name: z.string().optional(),
      sort: z.number().optional(),
      is_main: z.boolean().optional(),
      client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug, ...pipelineData }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.patch(`/leads/pipelines/${pipelineData.id}`, pipelineData);
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );

  // 5. Deletar Pipeline
  server.tool(
    "delete_pipeline",
    "Exclui um funil de vendas inteiro.",
    { pipeline_id: z.number(), client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug, pipeline_id }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.delete(`/leads/pipelines/${pipeline_id}`);
        return { content: [{ type: "text", text: "Pipeline excluído com sucesso." }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );

  // 6. Criar Etapa (Stage / Status) no Pipeline
  server.tool(
    "create_pipeline_stage",
    "Cria uma nova etapa (status) dentro de um funil de vendas existente.",
    {
      pipeline_id: z.number().describe("ID do funil onde a etapa será criada"),
      name: z.string().describe("Nome da etapa (ex: Em negociação)"),
      sort: z.number().optional().describe("Ordem da etapa (ex: 10, 20, 30)"),
      color: z.string().optional().describe("Cor da etapa em HEX (ex: #ffff99)"),
      client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug, pipeline_id, ...stageData }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.post(`/leads/pipelines/${pipeline_id}/statuses`, [stageData]);
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );

  // 7. Atualizar Etapa
  server.tool(
    "update_pipeline_stage",
    "Atualiza o nome ou a cor de uma etapa de um funil.",
    {
      pipeline_id: z.number(),
      status_id: z.number().describe("ID da etapa (status)"),
      name: z.string().optional(),
      sort: z.number().optional(),
      color: z.string().optional(),
      client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug, pipeline_id, status_id, ...stageData }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.patch(`/leads/pipelines/${pipeline_id}/statuses/${status_id}`, stageData);
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );

  // 8. Deletar Etapa
  server.tool(
    "delete_pipeline_stage",
    "Exclui uma etapa específica de um funil.",
    {
      pipeline_id: z.number(),
      status_id: z.number(),
      client_slug: z.string().describe("Identificador do cliente (slug)")
    },
    async ({ client_slug, pipeline_id, status_id }) => {
      const api = getApiClient(client_slug);
      try {
        const response = await api.delete(`/leads/pipelines/${pipeline_id}/statuses/${status_id}`);
        return { content: [{ type: "text", text: "Etapa excluída com sucesso." }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Erro: ${error.message}` }], isError: true };
      }
    }
  );
}
