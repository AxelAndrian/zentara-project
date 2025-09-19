import { useState, useCallback, useMemo } from "react";
import { NIMClient, defaultNIMConfig } from "@/api/nim";
import { Threat } from "@/app/_entities/threat";

export function useNIM() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamController, setStreamController] =
    useState<AbortController | null>(null);

  const client = useMemo(() => new NIMClient(defaultNIMConfig), []);

  const analyzeThreats = useCallback(
    async (
      countryName: string,
      threats: Threat[],
      capital: string,
      continent: string
    ) => {
      // API key is handled server-side via /api proxy

      setIsAnalyzing(true);
      setIsStreaming(true);
      setError(null);
      setAnalysis("");

      // Create abort controller for this stream
      const controller = new AbortController();
      setStreamController(controller);

      try {
        const threatDescriptions = threats.map(
          (t) => `${t.type} (${t.level}): ${t.description}`
        );
        const stream = await client.generateThreatAnalysis(
          countryName,
          threatDescriptions,
          capital,
          continent
        );

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let fullAnalysis = "";

        while (true) {
          // Check if stream was aborted
          if (controller.signal.aborted) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  fullAnalysis += content;
                  setAnalysis(fullAnalysis);
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("Analysis was stopped by user");
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to analyze threats"
          );
        }
      } finally {
        setIsAnalyzing(false);
        setIsStreaming(false);
        setStreamController(null);
      }
    },
    [client]
  );

  const chatWithAI = useCallback(
    async (messages: Array<{ role: string; content: string }>) => {
      // API key is handled server-side via /api proxy

      setIsAnalyzing(true);
      setIsStreaming(true);
      setError(null);

      // Create abort controller for this stream
      const controller = new AbortController();
      setStreamController(controller);

      try {
        const stream = await client.generateChatResponse(messages);
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let response = "";

        while (true) {
          // Check if stream was aborted
          if (controller.signal.aborted) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  response += content;
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }

        return response;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("Chat was stopped by user");
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to chat with AI"
          );
        }
        return null;
      } finally {
        setIsAnalyzing(false);
        setIsStreaming(false);
        setStreamController(null);
      }
    },
    [client]
  );

  const stopAnalysis = useCallback(() => {
    if (streamController) {
      streamController.abort();
    }
  }, [streamController]);

  const clearAnalysis = useCallback(() => {
    setAnalysis("");
    setError(null);
  }, []);

  return {
    isAnalyzing,
    isStreaming,
    analysis,
    error,
    analyzeThreats,
    chatWithAI,
    stopAnalysis,
    clearAnalysis,
  };
}
