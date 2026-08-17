import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getApiClient = (clientSlug: string) => {
  const KOMMO_DOMAIN = process.env[`KOMMO_${clientSlug.toUpperCase()}_DOMAIN`] || "seu_dominio.kommo.com";
  const KOMMO_ACCESS_TOKEN = process.env[`KOMMO_${clientSlug.toUpperCase()}_TOKEN`] || "";

  const api = axios.create({
    baseURL: `https://${KOMMO_DOMAIN}/api/v4`,
    headers: {
      Authorization: `Bearer ${KOMMO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  // Interceptor para logar erros e facilitar o debug depois
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Você pode expandir aqui para tratar expiração de token depois, se não for usar o de longa duração.
      console.error(`[Kommo API Error] ${error.config?.url}:`, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return api;
};
