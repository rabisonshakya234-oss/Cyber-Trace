export interface CaseItem {
  id: string;
  caseNumber: string;
  title: string;
  scamType: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'UNDER_SURVEILLANCE' | 'ESCALATED_INTERPOL' | 'RAID_PENDING' | 'INVESTIGATING' | 'ACTIVE_TRIAGE' | 'RESOLVED';
  reportedAt: string;
  victimName: string;
  victimLoss: string;
  suspectPhone: string;
  suspectIp: string;
  suspectLocation: string;
  gpsCoordinates: { lat: number; lon: number };
  cellTower: string;
  accuracyRadiusKm: number;
  isp: string;
  muleAccount: string;
  evidenceHash: string;
  synopsis: string;
  indicators: string[];
}

export interface IPTraceResult {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode?: string;
  lat: number;
  lon: number;
  isp: string;
  org: string;
  as: string;
  threatScore: number;
  threatType: string;
  accuracyKm: number;
  cellTower: string;
  source: string;
}

export interface ScamAnalysisResult {
  threatScore: number;
  threatCategory: string;
  severityRating: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  modusOperandiSummary: string;
  socialEngineeringVectors: string[];
  technicalIoCs: {
    suspiciousPatterns: string[];
    harvestedCredentials: string[];
    payloadRisks: string[];
    infrastructureType: string;
  };
  syndicateAttribution: {
    knownCluster: string;
    estimatedSophistication: string;
    typicalCashoutRoute: string;
  };
  lawEnforcementDirectives: string[];
  victimImmediateAdvisory: string[];
}

export interface FIRDocument {
  firNumber: string;
  investigatingAgency: string;
  penalCodeSections: string[];
  briefFactsOfTheCase: string;
  digitalForensicFindings: {
    ipOrigin: string;
    gpsTriangulation: string;
    cdrTowerAnalysis: string;
    electronicEvidenceHash: string;
  };
  muleAccountDirectives: string;
  telecomOrderDirective: string;
  leadInvestigatorSignoff: string;
}

export interface PythonScriptInfo {
  filename: string;
  name: string;
  description: string;
  code: string;
}

export interface BlacklistEntry {
  id: string;
  type: 'BANK_MULE' | 'PHONE_SPOOF' | 'IP_PROXY' | 'UPI_WALLET';
  identifier: string;
  holderOrEntity: string;
  riskRating: 'CRITICAL' | 'HIGH' | 'MODERATE';
  associatedCase: string;
  flaggedDate: string;
  jurisdiction: string;
}
