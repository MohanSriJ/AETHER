import { BuildingAsset, TelemetrySensor, AssetStatus } from '../../types/city';
import { RoadSegment } from '../../types/routing';
import { ScenarioConfig, SimulationEvent } from '../../types/simulation';

export function applyPowerOutageStep(
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

  // Substation trip cascades through Industrial and Central sectors
  const updatedBuildings = buildings.map(bld => {
    // If progress ratio > 0.1, power cascade hits
    if (progressRatio > 0.08) {
      if (bld.district === 'industrial' || (bld.district === 'central' && intensity > 0.4)) {
        if (bld.type === 'medical' || bld.type === 'critical_infra') {
          // Backup generators trigger
          return {
            ...bld,
            powerState: 'backup' as const,
            status: 'warning' as AssetStatus,
            powerConsumptionMw: Number((bld.powerConsumptionMw * 0.45).toFixed(1))
          };
        } else {
          // Blackout
          return {
            ...bld,
            powerState: 'offline' as const,
            status: 'critical' as AssetStatus,
            powerConsumptionMw: 0
          };
        }
      }
    }
    return bld;
  });

  // Power sensors detect voltage collapse
  const updatedSensors = sensors.map(s => {
    if (s.category === 'power_grid') {
      if (s.district === 'industrial' || s.district === 'central') {
        const drop = progressRatio > 0.08 ? (1 - intensity * 0.95 * progressRatio) : 1;
        const val = Number((s.baselineValue * Math.max(0, drop)).toFixed(1));
        const status: 'nominal' | 'alert' | 'critical' | 'offline' = val < s.minThreshold ? 'critical' : 'nominal';
        const history = [...s.history, { time: currentTick, value: val }].slice(-20);
        return {
          ...s,
          currentValue: val,
          status,
          history,
          lastUpdated: currentTick
        };
      }
    }
    return s;
  });

  // Traffic signaling failure causes congestion
  const updatedRoads = roads.map(r => {
    if ((r.district === 'central' || r.district === 'industrial') && progressRatio > 0.15) {
      return {
        ...r,
        status: 'slow' as const,
        hazardSeverity: Number((0.45 * intensity).toFixed(2))
      };
    }
    return r;
  });

  if (currentTick === 2) {
    newEvents.push({
      id: `evt-po-trip-${currentTick}`,
      timestamp: currentTick,
      realTime: new Date().toLocaleTimeString(),
      type: 'power_failure',
      title: 'Grid Frequency Instability & Substation Trip',
      description: 'Breakers tripped at Primary Grid Substation 01. Cascading blackout spreading to commercial and industrial feeders.',
      severity: 'critical',
      district: 'industrial',
      affectedAssetIds: ['bld-i-01', 'bld-i-02']
    });
  }

  return { buildings: updatedBuildings, sensors: updatedSensors, roads: updatedRoads, newEvents };
}
