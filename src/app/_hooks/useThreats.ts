import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Threat,
  ThreatLevel,
  ThreatType,
  ThreatStats,
} from "@/app/_entities/threat";

// Mock threat data generator
const generateMockThreat = (
  countryCode: string,
  countryName: string
): Threat => {
  const types: ThreatType[] = ["Malware", "Phishing", "DDoS", "Data Breach"];
  const levels: ThreatLevel[] = ["Low", "Medium", "High", "Critical"];

  const type = types[Math.floor(Math.random() * types.length)];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const severity = levels.indexOf(level) + 1;

  const descriptions = {
    Malware: [
      `New ransomware variant detected targeting ${countryName} infrastructure`,
      `Cryptocurrency mining malware spreading in ${countryName}`,
      `Advanced persistent threat campaign against ${countryName} government`,
    ],
    Phishing: [
      `Sophisticated phishing campaign targeting ${countryName} financial sector`,
      `Fake government website impersonation detected`,
      `Business email compromise attacks on ${countryName} corporations`,
    ],
    DDoS: [
      `Large-scale DDoS attack on ${countryName} internet infrastructure`,
      `Botnet targeting ${countryName} critical services`,
      `Distributed denial of service affecting ${countryName} banking sector`,
    ],
    "Data Breach": [
      `Personal data breach affecting ${countryName} citizens`,
      `Corporate data leak from ${countryName} technology companies`,
      `Government database compromise in ${countryName}`,
    ],
  };

  return {
    id: `${countryCode}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    countryCode,
    countryName,
    type,
    level,
    description:
      descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
    timestamp: new Date(),
    severity,
  };
};

export function useThreats(selectedCountries: string[]) {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateThreats = useCallback(() => {
    if (selectedCountries.length === 0) {
      setThreats([]);
      return;
    }

    setIsGenerating(true);

    // Generate 3-8 threats per country
    const newThreats: Threat[] = [];
    selectedCountries.forEach((countryCode) => {
      const countryName = countryCode; // In real app, you'd get this from country data
      const threatCount = Math.floor(Math.random() * 6) + 3; // 3-8 threats

      for (let i = 0; i < threatCount; i++) {
        newThreats.push(generateMockThreat(countryCode, countryName));
      }
    });

    setThreats(newThreats);
    setIsGenerating(false);
  }, [selectedCountries]);

  const addRandomThreat = useCallback(() => {
    if (selectedCountries.length === 0) return;

    const randomCountry =
      selectedCountries[Math.floor(Math.random() * selectedCountries.length)];

    // Sometimes add multiple threats at once (20% chance)
    const threatCount =
      Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 1;
    const newThreats: Threat[] = [];

    for (let i = 0; i < threatCount; i++) {
      newThreats.push(generateMockThreat(randomCountry, randomCountry));
    }

    setThreats((prev) => {
      // Limit the number of threats to prevent excessive data
      const maxThreats = 50;
      const updated = [...prev, ...newThreats];
      if (updated.length > maxThreats) {
        return updated.slice(-maxThreats);
      }
      return updated;
    });
  }, [selectedCountries]);

  const clearThreats = useCallback(() => {
    setThreats([]);
  }, []);

  // Create stable dependency for selectedCountries
  const selectedCountriesString = useMemo(
    () => selectedCountries.join(","),
    [selectedCountries]
  );

  // Function to generate threats for provided country codes (or current selection)
  const generateThreatsForCountries = useCallback(
    (codes?: string[]) => {
      const targetCountries =
        codes && codes.length > 0 ? codes : selectedCountries;
      if (targetCountries.length === 0) {
        setThreats([]);
        return;
      }

      // Generate threats directly
      const newThreats: Threat[] = [];
      targetCountries.forEach((countryCode) => {
        const countryName = countryCode; // In real app, you'd get this from country data
        const threatCount = Math.floor(Math.random() * 3) + 2; // 2-4 threats (reduced from 3-8)

        for (let i = 0; i < threatCount; i++) {
          newThreats.push(generateMockThreat(countryCode, countryName));
        }
      });

      setThreats(newThreats);
    },
    [selectedCountries]
  );

  // Simulate real-time threat updates every 15 seconds
  useEffect(() => {
    if (selectedCountries.length === 0) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        // 40% chance every 15 seconds for more frequent updates
        addRandomThreat();
      }
    }, 15000); // Every 15 seconds for real-time feel

    return () => clearInterval(interval);
  }, [selectedCountriesString, selectedCountries.length, addRandomThreat]);

  const stats: ThreatStats = useMemo(
    () => ({
      totalThreats: threats.length,
      criticalThreats: threats.filter((t) => t.level === "Critical").length,
      highThreats: threats.filter((t) => t.level === "High").length,
      mediumThreats: threats.filter((t) => t.level === "Medium").length,
      lowThreats: threats.filter((t) => t.level === "Low").length,
      threatDistribution: {
        Malware: threats.filter((t) => t.type === "Malware").length,
        Phishing: threats.filter((t) => t.type === "Phishing").length,
        DDoS: threats.filter((t) => t.type === "DDoS").length,
        "Data Breach": threats.filter((t) => t.type === "Data Breach").length,
      },
    }),
    [threats]
  );

  return {
    threats,
    stats,
    isGenerating,
    generateThreats,
    generateThreatsForCountries,
    addRandomThreat,
    clearThreats,
  };
}
