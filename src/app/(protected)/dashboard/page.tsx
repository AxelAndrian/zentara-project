"use client";

import { useState, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CountrySelection } from "./_components/country-selection";
import { ThreatDashboard } from "./_components/threat-dashboard";
import { ThreatVisualization } from "./_components/threat-visualization";
import { AIAnalysis } from "./_components/ai-analysis";
import { Header } from "./_components/header";
import { Country } from "@/app/_entities/country";
import { useThreats } from "@/app/_hooks/useThreats";

const queryClient = new QueryClient();

export default function DashboardPage() {
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  // Get country codes for the useThreats hook
  const countryCodes = useMemo(
    () => selectedCountries.map((c) => c.code),
    [selectedCountries]
  );

  // Use the threats hook
  const { threats, stats, generateThreatsForCountries } =
    useThreats(countryCodes);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Global Cyber Threat Monitor
              </h1>
              <p className="text-muted-foreground">
                Real-time cybersecurity threat intelligence and AI-powered
                analysis
              </p>
            </div>

            <CountrySelection
              selectedCountries={selectedCountries}
              onSelectionChange={setSelectedCountries}
              onGenerateThreats={generateThreatsForCountries}
            />

            {selectedCountries.length > 0 && (
              <>
                <ThreatDashboard
                  selectedCountries={selectedCountries}
                  threats={threats}
                  stats={stats}
                />
                <ThreatVisualization
                  selectedCountries={selectedCountries}
                  threats={threats}
                  stats={stats}
                />
                <AIAnalysis selectedCountries={selectedCountries} />
              </>
            )}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
