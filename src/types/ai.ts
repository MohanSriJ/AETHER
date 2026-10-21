import { DistrictId } from './city';

export type AIAgentId = 'monitoring' | 'risk_analysis' | 'response_planning' | 'public_comm';

export type AIAgentStatus = 'idle' | 'analyzing' | 'completed' | 'alert';

export interface ActionRecommendation {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  targetDistrict: DistrictId | 'all';
  action: string;
  rationale: string;
  affectedAssetIds: string[];
  estimatedImpact: string;
  isApplied?: boolean;
}

export interface AgentReport {
  agentId: AIAgentId;
  agentName: string;
  role: string;
  status: AIAgentStatus;
  lastAnalysisTimestamp: number;
  summary: string;
  findings: string[];
  metrics: Record<string, string | number>;
  rulesEvaluated: string[];
  recommendations: ActionRecommendation[];
  limitations: string[];
}
