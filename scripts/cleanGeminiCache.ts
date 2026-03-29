import { GoogleAICacheManager } from "@google/generative-ai/server";
import * as dotenv from "dotenv";

// Carrega a API Key do seu arquivo .env
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY || "SUA_CHAVE_AQUI";

async function clearGeminiCaches() {
    const cacheManager = new GoogleAICacheManager(apiKey);

    console.log(`[${new Date().toLocaleTimeString()}] Verificando caches ativos no Google AI Studio...`);

    try {
        // Lista os caches ativos
        const listResult = await cacheManager.list();
        const caches = listResult.cachedContents || [];

        if (caches.length === 0) {
            console.log("✅ Nenhum cache encontrado. Sua cota está 100% livre!");
            return;
        }

        console.log(`🔍 Encontrados ${caches.length} caches. Iniciando limpeza...`);

        // Deleta cada cache encontrado
        for (const cache of caches) {
            if (cache.name) {
                console.log(`🗑️ Removendo cache: ${cache.name} (Modelo: ${cache.model})`);
                await cacheManager.delete(cache.name);
            }
        }

        console.log("✨ Limpeza concluída com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao acessar a API do Gemini:", error instanceof Error ? error.message : error);
    }
}

// Executa a função
clearGeminiCaches();