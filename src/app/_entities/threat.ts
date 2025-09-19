export type ThreatLevel = "Low" | "Medium" | "High" | "Critical";
export type ThreatType = "Malware" | "Phishing" | "DDoS" | "Data Breach";

export interface Threat {
  id: string;
  countryCode: string;
  countryName: string;
  type: ThreatType;
  level: ThreatLevel;
  description: string;
  timestamp: Date;
  severity: number; // 1-4 scale
}

export interface ThreatAnalysis {
  riskAssessment: string;
  recommendations: string[];
  longTermStrategy: string;
  confidence: number;
}

export interface ThreatStats {
  totalThreats: number;
  criticalThreats: number;
  highThreats: number;
  mediumThreats: number;
  lowThreats: number;
  threatDistribution: Record<ThreatType, number>;
}
