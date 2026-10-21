export type DistrictId = 'central' | 'waterfront' | 'industrial' | 'tech_quad';

export type BuildingType = 
  | 'residential' 
  | 'commercial' 
  | 'industrial' 
  | 'civic' 
  | 'critical_infra' 
  | 'medical';

export type OccupancyCategory = 'low' | 'medium' | 'high' | 'critical';

export type PowerState = 'online' | 'backup' | 'offline';

export type AssetStatus = 'normal' | 'warning' | 'critical' | 'offline';

export interface BuildingAsset {
  id: string;
  name: string;
  district: DistrictId;
  type: BuildingType;
  position: [number, number, number]; // [x, y, z]
  dimensions: [number, number, number]; // [width, height, depth]
  floors: number;
  occupancyCategory: OccupancyCategory;
  populationEstimate: number;
  infrastructureImportance: number; // 1 - 100
  powerState: PowerState;
  
  // Dynamic simulated telemetry metrics
  temperature: number; // Celsius
  airQualityIndex: number; // 0 - 500 AQI
  structuralIntegrity: number; // 0 - 100%
  floodDepth: number; // meters
  fireSeverity: number; // 0 - 100%
  powerConsumptionMw: number;
  status: AssetStatus;
  
  // Baseline values for diffing
  baseline: {
    temperature: number;
    airQualityIndex: number;
    structuralIntegrity: number;
    powerState: PowerState;
  };
}

export interface LandmarkAsset {
  id: string;
  name: string;
  district: DistrictId;
  position: [number, number, number];
  type: 'tower' | 'bridge' | 'energy_hub' | 'hospital_heliport' | 'water_pumping_station';
  status: AssetStatus;
  description: string;
}

export type SensorCategory = 
  | 'temperature' 
  | 'air_quality' 
  | 'water_level' 
  | 'vibration' 
  | 'power_grid';

export interface TelemetrySensor {
  id: string;
  name: string;
  category: SensorCategory;
  district: DistrictId;
  position: [number, number, number];
  associatedBuildingId?: string;
  currentValue: number;
  unit: string;
  baselineValue: number;
  minThreshold: number;
  maxThreshold: number;
  status: 'nominal' | 'alert' | 'critical' | 'offline';
  history: { time: number; value: number }[];
  lastUpdated: number;
}
