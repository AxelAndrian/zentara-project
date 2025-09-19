"use client";

import { useState } from "react";
import { Country } from "@/app/_entities/country";
import { useThreats } from "@/app/_hooks/useThreats";
import { useNIM } from "@/app/_hooks/useNIM";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Badge } from "@/app/_components/ui/badge";
import {
  Bot,
  Send,
  RefreshCw,
  MessageSquare,
  AlertCircle,
  Square,
  Play,
  FileText,
} from "lucide-react";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

interface AIAnalysisProps {
  selectedCountries: Country[];
}

export function AIAnalysis({ selectedCountries }: AIAnalysisProps) {
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatMode, setIsChatMode] = useState(false);

  const countryCodes = selectedCountries.map((c) => c.code);
  const { threats } = useThreats(countryCodes);
  const {
    isAnalyzing,
    isStreaming,
    analysis,
    error,
    analyzeThreats,
    chatWithAI,
    stopAnalysis,
    clearAnalysis,
  } = useNIM();

  const handleAnalyze = async () => {
    if (selectedCountries.length === 0) return;

    const country = selectedCountries[0]; // Analyze first selected country
    const countryThreats = threats.filter(
      (t) => t.countryCode === country.code
    );

    await analyzeThreats(
      country.name,
      countryThreats,
      country.capital,
      country.continent.name
    );
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");

    const response = await chatWithAI(newMessages);
    if (response) {
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: response },
      ]);
    }
  };

  const handleExport = () => {
    if (!analysis && chatMessages.length === 0) return;

    let content = "";
    let filename = "";

    if (isChatMode && chatMessages.length > 0) {
      // Export chat conversation
      content = chatMessages
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n");
      filename = `threat-chat-${new Date().toISOString().split("T")[0]}.txt`;
    } else if (analysis) {
      // Export analysis
      content = analysis;
      filename = `threat-analysis-${new Date().toISOString().split("T")[0]}.md`;
    }

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearChat = () => {
    setChatMessages([]);
    setChatInput("");
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>AI-Powered Threat Analysis</span>
              </CardTitle>
              <CardDescription>
                Get AI insights and recommendations for threat mitigation
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatMode(!isChatMode)}
                disabled={isAnalyzing}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {isChatMode ? "Analysis Mode" : "Chat Mode"}
              </Button>
              {isStreaming ? (
                <Button onClick={stopAnalysis} variant="destructive" size="sm">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Analysis
                </Button>
              ) : (
                <Button
                  onClick={handleAnalyze}
                  disabled={selectedCountries.length === 0}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {analysis ? "Restart Analysis" : "Analyze Threats"}
                </Button>
              )}
              {(analysis || chatMessages.length > 0) && (
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 border border-destructive/20 bg-destructive/10 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {!isChatMode ? (
            <div className="space-y-4">
              {isStreaming ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="animate-pulse">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      AI Analyzing...
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Streaming analysis in real-time
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-muted p-4 rounded-lg">
                      {analysis ? (
                        <Markdown remarkPlugins={[gfm]}>{analysis}</Markdown>
                      ) : (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Starting analysis...</span>
                        </div>
                      )}
                      {analysis && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live streaming</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : analysis ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">AI Analysis Complete</Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAnalysis}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-muted p-4 rounded-lg">
                      <Markdown remarkPlugins={[gfm]}>{analysis}</Markdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Click &quot;Analyze Threats&quot; to get AI-powered insights
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Start a conversation with the AI about cybersecurity
                      threats
                    </p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          {isStreaming
                            ? "AI is responding..."
                            : "AI is thinking..."}
                        </span>
                        {isStreaming && (
                          <div className="flex items-center space-x-1 ml-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <div
                              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Ask about threats, security recommendations, or analysis..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !isAnalyzing && handleChat()
                  }
                  disabled={isAnalyzing}
                />
                {isStreaming ? (
                  <Button
                    onClick={stopAnalysis}
                    variant="destructive"
                    disabled={!isAnalyzing}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleChat} disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={clearChat}
                  disabled={isAnalyzing}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
