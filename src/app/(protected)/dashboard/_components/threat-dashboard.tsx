"use client";

import React from "react";
import { Country } from "@/app/_entities/country";
import { Threat, ThreatStats } from "@/app/_entities/threat";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Progress } from "@/app/_components/ui/progress";
import { AlertTriangle, Shield } from "lucide-react";
import { ThreatLevel } from "@/app/_entities/threat";
import { hasFlag } from "country-flag-icons";
import * as Flags from "country-flag-icons/react/3x2";

interface ThreatDashboardProps {
  selectedCountries: Country[];
  threats: Threat[];
  stats: ThreatStats;
}

const threatLevelColors = {
  Low: "bg-gray-500 text-white",
  Medium: "bg-orange-500 text-white",
  High: "bg-red-500 text-white",
  Critical: "bg-black text-white",
};

const threatLevelVariants = {
  Low: "secondary" as const,
  Medium: "orange" as const,
  High: "destructive" as const,
  Critical: "default" as const,
};

export function ThreatDashboard({
  selectedCountries,
  threats,
  stats,
}: ThreatDashboardProps) {
  // No need for useThreats hook since we get data as props

  // Helper function to get flag component
  const getFlagComponent = (countryCode: string) => {
    if (!hasFlag(countryCode)) {
      return null;
    }
    const FlagComponent = (
      Flags as Record<
        string,
        React.ComponentType<{ className?: string; title?: string }>
      >
    )[countryCode];
    return FlagComponent ? (
      <FlagComponent className="w-4 h-3" title={countryCode} />
    ) : null;
  };

  const getThreatLevelPercentage = (level: ThreatLevel) => {
    if (stats.totalThreats === 0) return 0;
    const count = threats.filter((t) => t.level === level).length;
    return (count / stats.totalThreats) * 100;
  };

  const getThreatLevelCount = (level: ThreatLevel) => {
    return threats.filter((t) => t.level === level).length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Threat Overview</span>
                <div className="flex items-center space-x-1 ml-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">LIVE</span>
                </div>
              </CardTitle>
              <CardDescription>
                Real-time cybersecurity threat monitoring for selected countries
              </CardDescription>
            </div>
            {/* Action buttons removed - threats are now generated automatically when countries change */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Threats</span>
                <Badge variant="outline">{stats.totalThreats}</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Critical</span>
                <Badge variant="default" className="text-white">
                  {getThreatLevelCount("Critical")}
                </Badge>
              </div>
              <Progress
                value={getThreatLevelPercentage("Critical")}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High</span>
                <Badge variant="destructive" className="text-white">
                  {getThreatLevelCount("High")}
                </Badge>
              </div>
              <Progress
                value={getThreatLevelPercentage("High")}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium</span>
                <Badge variant="orange">{getThreatLevelCount("Medium")}</Badge>
              </div>
              <Progress
                value={getThreatLevelPercentage("Medium")}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low</span>
                <Badge variant="secondary">{getThreatLevelCount("Low")}</Badge>
              </div>
              <Progress
                value={getThreatLevelPercentage("Low")}
                className="h-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Recent Threats</h4>
            {threats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No threats detected for selected countries</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {threats
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .slice(0, 20)
                  .map((threat) => (
                    <div
                      key={threat.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${
                          threatLevelColors[threat.level]
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={threatLevelVariants[threat.level]}>
                            {threat.level}
                          </Badge>
                          <Badge variant="outline">{threat.type}</Badge>
                          <div className="flex items-center space-x-1">
                            {getFlagComponent(threat.countryCode)}
                            <span className="text-sm text-muted-foreground">
                              {threat.countryName}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm">{threat.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {threat.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
