import { DistrictId } from './city';

export type ScenarioType = 'flood' | 'fire' | 'heatwave' | 'power_outage';

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface ScenarioConfig {
  id: ScenarioType;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  intensity: number; // 0.1 to 1.0 (10% to 100%)
  targetDistrict: DistrictId | 'all';
  durationSeconds: number; // e.g. 60 or 120 seconds
}

export interface SimulationEvent {
  id: string;
  timestamp: number; // simulated seconds
  realTime: string;
  type: 'scenario_start' | 'threshold_breach' | 'asset_impact' | 'power_failure' | 'road_closure' | 'ai_recommendation' | 'mitigation_applied' | 'scenario_end';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  district?: DistrictId;
  affectedAssetIds?: string[];
}

export interface CityMetrics {
  activeIncidents: number;
  sensorsReporting: number;
  sensorHealthPercent: number;
  affectedBuildingsCount: number;
  affectedRoadsCount: number;
  cityPowerGridLoadPercent: number;
  avgCityTemperature: number;
  avgCityAQI: number;
  maxFloodDepthMeters: number;
  totalAtRiskPopulation: number;
}
