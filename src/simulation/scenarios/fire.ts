import { BuildingAsset, TelemetrySensor, AssetStatus } from '../../types/city';
import { RoadSegment } from '../../types/routing';
import { ScenarioConfig, SimulationEvent } from '../../types/simulation';

export function applyFireStep(
  buildings: BuildingAsset[],
  sensors: TelemetrySensor[],
  roads: RoadSegment[],
  scenario: ScenarioConfig,
  currentTick: number
): {
  buildings: BuildingAsset[];
  sensors: TelemetrySensor[];
  roads: RoadSegment[];
  newEvents: SimulationEvent[];
} {
  const newEvents: SimulationEvent[] = [];
  const progressRatio = Math.min(1, currentTick / Math.max(10, scenario.durationSeconds));
  const intensity = scenario.intensity;

  // Primary origin: Advanced Materials Fab Plant (bld-i-03) or Substation in Industrial district
  const originId = 'bld-i-03';
  const secondaryId = 'bld-i-05';

  const updatedBuildings = buildings.map(bld => {
    if (bld.id === originId) {
      const fireSeverity = Math.min(100, Math.round(intensity * 100 * progressRatio));
      const temperature = Number((bld.baseline.temperature + (fireSeverity * 0.75)).toFixed(1));
      const aqi = Math.min(500, Math.round(bld.baseline.airQualityIndex + fireSeverity * 3.8));
      const integrity = Math.max(35, Math.round(100 - fireSeverity * 0.55));
      const status: AssetStatus = fireSeverity > 30 ? 'critical' : 'warning';
      return {
        ...bld,
        fireSeverity,
        temperature,
        airQualityIndex: aqi,
        structuralIntegrity: integrity,
        powerState: fireSeverity > 40 ? 'offline' : bld.powerState,
        status
      };
    } else if (bld.id === secondaryId) {
      const fireSeverity = Math.min(75, Math.round(intensity * 60 * progressRatio));
      const temperature = Number((bld.baseline.temperature + (fireSeverity * 0.4)).toFixed(1));
      const aqi = Math.min(400, Math.round(bld.baseline.airQualityIndex + fireSeverity * 2.5));
      const status: AssetStatus = fireSeverity > 25 ? 'warning' : 'normal';
      return {
        ...bld,
        fireSeverity,
        temperature,
        airQualityIndex: aqi,
        status
      };
    }
    return bld;
  });

  // Industrial air quality & temperature sensors spike
  const updatedSensors = sensors.map(s => {
    if (s.district === 'industrial') {
      let val = s.currentValue;
      if (s.category === 'temperature') {
        val = Number((s.baselineValue + intensity * 45 * progressRatio).toFixed(1));
      } else if (s.category === 'air_quality') {
        val = Math.min(500, Math.round(s.baselineValue + intensity * 280 * progressRatio));
      }
      const status: 'nominal' | 'alert' | 'critical' | 'offline' = val > s.maxThreshold ? 'critical' : val > s.maxThreshold * 0.75 ? 'alert' : 'nominal';
      const history = [...s.history, { time: currentTick, value: val }].slice(-20);
      return {
        ...s,
        currentValue: val,
        status,
        history,
        lastUpdated: currentTick
      };
    }
    return s;
  });

  // Road segments adjacent to industrial fire are blocked for emergency access
  const updatedRoads = roads.map(r => {
    if (r.id === 'seg-i-03' || r.id === 'seg-i-04') {
      const hazardSeverity = Number((intensity * progressRatio).toFixed(2));
      const status: 'clear' | 'slow' | 'flooded' | 'blocked' = hazardSeverity > 0.4 ? 'blocked' : 'slow';
      return {
        ...r,
        hazardSeverity,
        status
      };
    }
    return r;
  });

  if (currentTick === 2) {
    newEvents.push({
      id: `evt-fr-ignition-${currentTick}`,
      timestamp: currentTick,
      realTime: new Date().toLocaleTimeString(),
      type: 'scenario_start',
      title: 'Structural Thermal Anomaly Detected',
      description: 'Thermal sensors at Materials Fab Plant indicate rapid temperature rise and heavy particulate generation.',
      severity: 'critical',
      district: 'industrial',
      affectedAssetIds: [originId]
    });
  }

  return { buildings: updatedBuildings, sensors: updatedSensors, roads: updatedRoads, newEvents };
}
