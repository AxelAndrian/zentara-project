"use client";

import { useMemo, useState, useEffect } from "react";
import { Country } from "@/app/_entities/country";
import { Threat, ThreatStats } from "@/app/_entities/threat";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

interface ThreatVisualizationProps {
  selectedCountries: Country[];
  threats: Threat[];
  stats: ThreatStats;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

export function ThreatVisualization({
  selectedCountries,
  threats,
  stats,
}: ThreatVisualizationProps) {
  // No need for useThreats hook since we get data as props

  // Debounced data to prevent flickering
  const [debouncedThreats, setDebouncedThreats] = useState(threats);
  const [debouncedStats, setDebouncedStats] = useState(stats);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if there are significant changes
      if (
        Math.abs(threats.length - debouncedThreats.length) > 0 ||
        Math.abs(stats.totalThreats - debouncedStats.totalThreats) > 0
      ) {
        setDebouncedThreats(threats);
        setDebouncedStats(stats);
      }
    }, 1000); // Increased to 1 second debounce

    return () => clearTimeout(timer);
  }, [threats, stats, debouncedThreats.length, debouncedStats.totalThreats]);

  // Prepare data for charts with memoization to prevent infinite re-renders
  const threatLevelData = useMemo(
    () => [
      { level: "Low", count: debouncedStats.lowThreats, color: "#6b7280" },
      {
        level: "Medium",
        count: debouncedStats.mediumThreats,
        color: "#f97316",
      },
      { level: "High", count: debouncedStats.highThreats, color: "#000000" },
      {
        level: "Critical",
        count: debouncedStats.criticalThreats,
        color: "#ef4444",
      },
    ],
    [
      debouncedStats.lowThreats,
      debouncedStats.mediumThreats,
      debouncedStats.highThreats,
      debouncedStats.criticalThreats,
    ]
  );

  const threatTypeData = useMemo(
    () =>
      Object.entries(debouncedStats.threatDistribution).map(
        ([type, count]) => ({
          type,
          count,
        })
      ),
    [debouncedStats.threatDistribution]
  );

  const countryThreatData = useMemo(
    () =>
      selectedCountries.map((country) => {
        const countryThreats = debouncedThreats.filter(
          (t) => t.countryCode === country.code
        );
        return {
          country: country.name,
          total: countryThreats.length,
          critical: countryThreats.filter((t) => t.level === "Critical").length,
          high: countryThreats.filter((t) => t.level === "High").length,
          medium: countryThreats.filter((t) => t.level === "Medium").length,
          low: countryThreats.filter((t) => t.level === "Low").length,
        };
      }),
    [selectedCountries, debouncedThreats]
  );

  // Generate timeline data for the last 24 hours
  const timelineData = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() - (23 - i));
        const hourThreats = debouncedThreats.filter((t) => {
          const threatHour = new Date(t.timestamp);
          return (
            threatHour.getHours() === hour.getHours() &&
            threatHour.getDate() === hour.getDate()
          );
        });
        return {
          time: hour.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          threats: hourThreats.length,
        };
      }),
    [debouncedThreats]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Threat Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Threat Level Distribution</span>
          </CardTitle>
          <CardDescription>
            Breakdown of threats by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={threatLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Threat Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5" />
            <span>Threat Type Distribution</span>
          </CardTitle>
          <CardDescription>Distribution of threats by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threatTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count }) => `${type}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {threatTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Country Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Country Comparison</CardTitle>
          <CardDescription>
            Threat levels across selected countries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryThreatData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" />
              <Bar dataKey="high" stackId="a" fill="#f97316" />
              <Bar dataKey="medium" stackId="a" fill="#eab308" />
              <Bar dataKey="low" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Threat Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Threat Timeline</span>
          </CardTitle>
          <CardDescription>
            Threat activity over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="threats"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
