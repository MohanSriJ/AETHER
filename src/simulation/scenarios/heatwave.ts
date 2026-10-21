import { BuildingAsset, TelemetrySensor, AssetStatus } from '../../types/city';
import { RoadSegment } from '../../types/routing';
import { ScenarioConfig, SimulationEvent } from '../../types/simulation';

export function applyHeatwaveStep(
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

  // Temperature rise across all districts, peaking in dense central & industrial areas
  const updatedBuildings = buildings.map(bld => {
    const heatDelta = (8 + intensity * 16) * progressRatio; // +8C to +24C
    const newTemp = Number((bld.baseline.temperature + heatDelta).toFixed(1));
    const powerSurge = Number((bld.powerConsumptionMw * (1 + 0.45 * intensity * progressRatio)).toFixed(2));
    const aqiDelta = Math.round(15 * intensity * progressRatio);
    const status: AssetStatus = newTemp > 38 ? 'critical' : newTemp > 32 ? 'warning' : 'normal';

    return {
      ...bld,
      temperature: newTemp,
      powerConsumptionMw: powerSurge,
      airQualityIndex: bld.baseline.airQualityIndex + aqiDelta,
      status
    };
  });

  // All ambient temperature sensors record sharp increases
  const updatedSensors = sensors.map(s => {
    if (s.category === 'temperature') {
      const heatDelta = (8 + intensity * 18) * progressRatio;
      const val = Number((s.baselineValue + heatDelta).toFixed(1));
      const status: 'nominal' | 'alert' | 'critical' | 'offline' = val > s.maxThreshold ? 'critical' : val > s.maxThreshold * 0.85 ? 'alert' : 'nominal';
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

  if (currentTick === 2) {
    newEvents.push({
      id: `evt-hw-advisory-${currentTick}`,
      timestamp: currentTick,
      realTime: new Date().toLocaleTimeString(),
      type: 'scenario_start',
      title: 'Citywide Heat Dome Advisory Activated',
      description: `Meteorological telemetry confirms high-pressure thermal ridge. Predicted urban core temperatures exceeding 38°C at ${(intensity * 100).toFixed(0)}% severity.`,
      severity: 'warning'
    });
  }

  return { buildings: updatedBuildings, sensors: updatedSensors, roads, newEvents };
}
