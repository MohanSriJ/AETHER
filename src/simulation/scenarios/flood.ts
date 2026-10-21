import { BuildingAsset, TelemetrySensor, AssetStatus } from '../../types/city';
import { RoadSegment } from '../../types/routing';
import { ScenarioConfig, SimulationEvent } from '../../types/simulation';

export function applyFloodStep(
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
  const intensity = scenario.intensity; // 0.1 to 1.0

  // Waterfront buildings most vulnerable
  const updatedBuildings = buildings.map(bld => {
    if (bld.district === 'waterfront') {
      const targetFlood = (1.2 + intensity * 1.8) * progressRatio; // up to 3.0 meters
      const floodDepth = Number(targetFlood.toFixed(2));
      const powerState = floodDepth > 1.2 ? (bld.type === 'critical_infra' ? 'backup' : 'offline') : bld.powerState;
      const status: AssetStatus = floodDepth > 1.5 ? 'critical' : floodDepth > 0.4 ? 'warning' : 'normal';

      return {
        ...bld,
        floodDepth,
        powerState,
        status,
        structuralIntegrity: Math.max(70, Math.round(100 - floodDepth * 8))
      };
    }
    return bld;
  });

  // Waterfront water level sensors surge
  const updatedSensors = sensors.map(s => {
    if (s.district === 'waterfront' && s.category === 'water_level') {
      const surge = Number((s.baselineValue + (0.5 + intensity * 2.2) * progressRatio).toFixed(2));
      const status: 'nominal' | 'alert' | 'critical' | 'offline' = surge > s.maxThreshold ? 'critical' : surge > s.maxThreshold * 0.7 ? 'alert' : 'nominal';
      const history = [...s.history, { time: currentTick, value: surge }].slice(-20);
      return {
        ...s,
        currentValue: surge,
        status,
        history,
        lastUpdated: currentTick
      };
    }
    return s;
  });

  // Roads near waterfront get flooded and blocked
  const updatedRoads = roads.map(r => {
    if (r.district === 'waterfront') {
      const hazardSeverity = Number((intensity * progressRatio).toFixed(2));
      const status: 'clear' | 'slow' | 'flooded' | 'blocked' = hazardSeverity > 0.6 ? 'blocked' : hazardSeverity > 0.25 ? 'flooded' : 'slow';
      return {
        ...r,
        hazardSeverity,
        status
      };
    }
    return r;
  });

  // Deterministic events on specific thresholds
  if (currentTick === 2) {
    newEvents.push({
      id: `evt-fl-start-${currentTick}`,
      timestamp: currentTick,
      realTime: new Date().toLocaleTimeString(),
      type: 'scenario_start',
      title: 'Storm Surge & Coastal Inundation Detected',
      description: `Tidal telemetry indicates rapid water influx across Waterfront District at ${(intensity * 100).toFixed(0)}% severity.`,
      severity: 'warning',
      district: 'waterfront'
    });
  }

  if (currentTick === Math.floor(scenario.durationSeconds * 0.3)) {
    newEvents.push({
      id: `evt-fl-breach-${currentTick}`,
      timestamp: currentTick,
      realTime: new Date().toLocaleTimeString(),
      type: 'road_closure',
      title: 'Promenade Seawall Overtop Breach',
      description: 'Water levels exceeded 0.85m seawall retention capacity. Waterfront road segments closed.',
      severity: 'critical',
      district: 'waterfront',
      affectedAssetIds: ['bld-w-01', 'bld-w-04']
    });
  }

  return { buildings: updatedBuildings, sensors: updatedSensors, roads: updatedRoads, newEvents };
}
