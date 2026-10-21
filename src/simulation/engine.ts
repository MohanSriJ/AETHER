import { INITIAL_BUILDINGS, INITIAL_SENSORS } from '../data/cityData';
import { ROAD_SEGMENTS } from '../data/roadGraph';
import { AgentReport } from '../types/ai';
import { BuildingAsset, TelemetrySensor } from '../types/city';
import { RoadSegment } from '../types/routing';
import { CityMetrics, ScenarioConfig, SimulationEvent } from '../types/simulation';
import { runMonitoringAgent } from './ai/monitoringAgent';
import { runPublicCommAgent } from './ai/publicCommAgent';
import { runResponsePlanningAgent } from './ai/responsePlanningAgent';
import { runRiskAnalysisAgent } from './ai/riskAnalysisAgent';
import { applyFireStep } from './scenarios/fire';
import { applyFloodStep } from './scenarios/flood';
import { applyHeatwaveStep } from './scenarios/heatwave';
import { applyPowerOutageStep } from './scenarios/powerOutage';

export interface SimulationStepResult {
  buildings: BuildingAsset[];
  sensors: TelemetrySensor[];
  roads: RoadSegment[];
  metrics: CityMetrics;
  events: SimulationEvent[];
  aiReports: Record<string, AgentReport>;
  isCompleted: boolean;
}

export function computeCityMetrics(
  buildings: BuildingAsset[],
  sensors: TelemetrySensor[],
  roads: RoadSegment[]
): CityMetrics {
  const affectedBuildings = buildings.filter(b => b.status === 'warning' || b.status === 'critical');
  const affectedRoads = roads.filter(r => r.status !== 'clear');
  const activeSensors = sensors.filter(s => s.status !== 'offline');
  const healthySensors = sensors.filter(s => s.status === 'nominal');

  let totalTemp = 0;
  let totalAqi = 0;
  let maxFlood = 0;
  let totalPopulationAtRisk = 0;

  buildings.forEach(b => {
    totalTemp += b.temperature;
    totalAqi += b.airQualityIndex;
    if (b.floodDepth > maxFlood) maxFlood = b.floodDepth;
    if (b.status === 'critical' || b.status === 'warning') {
      totalPopulationAtRisk += b.populationEstimate;
    }
  });

  const sensorHealthPercent = Math.round((healthySensors.length / Math.max(1, sensors.length)) * 100);

  // Compute power grid load
  const totalPowerConsumption = buildings.reduce((acc, b) => acc + b.powerConsumptionMw, 0);
  const baselinePower = INITIAL_BUILDINGS.reduce((acc, b) => acc + b.powerConsumptionMw, 0);
  const gridLoadPercent = Math.min(125, Math.round((totalPowerConsumption / Math.max(1, baselinePower)) * 82));

  return {
    activeIncidents: affectedBuildings.length > 0 ? 1 : 0,
    sensorsReporting: activeSensors.length,
    sensorHealthPercent,
    affectedBuildingsCount: affectedBuildings.length,
    affectedRoadsCount: affectedRoads.length,
    cityPowerGridLoadPercent: gridLoadPercent,
    avgCityTemperature: Number((totalTemp / buildings.length).toFixed(1)),
    avgCityAQI: Math.round(totalAqi / buildings.length),
    maxFloodDepthMeters: Number(maxFlood.toFixed(2)),
    totalAtRiskPopulation: totalPopulationAtRisk
  };
}

export function executeSimulationStep(
  buildings: BuildingAsset[],
  sensors: TelemetrySensor[],
  roads: RoadSegment[],
  scenario: ScenarioConfig | null,
  currentTick: number
): SimulationStepResult {
  let updatedBuildings = [...buildings];
  let updatedSensors = [...sensors];
  let updatedRoads = [...roads];
  let stepEvents: SimulationEvent[] = [];
  let isCompleted = false;

  if (scenario && currentTick <= scenario.durationSeconds) {
    if (scenario.id === 'flood') {
      const res = applyFloodStep(buildings, sensors, roads, scenario, currentTick);
      updatedBuildings = res.buildings;
      updatedSensors = res.sensors;
      updatedRoads = res.roads;
      stepEvents = res.newEvents;
    } else if (scenario.id === 'fire') {
      const res = applyFireStep(buildings, sensors, roads, scenario, currentTick);
      updatedBuildings = res.buildings;
      updatedSensors = res.sensors;
      updatedRoads = res.roads;
      stepEvents = res.newEvents;
    } else if (scenario.id === 'heatwave') {
      const res = applyHeatwaveStep(buildings, sensors, roads, scenario, currentTick);
      updatedBuildings = res.buildings;
      updatedSensors = res.sensors;
      updatedRoads = res.roads;
      stepEvents = res.newEvents;
    } else if (scenario.id === 'power_outage') {
      const res = applyPowerOutageStep(buildings, sensors, roads, scenario, currentTick);
      updatedBuildings = res.buildings;
      updatedSensors = res.sensors;
      updatedRoads = res.roads;
      stepEvents = res.newEvents;
    }

    if (currentTick >= scenario.durationSeconds) {
      isCompleted = true;
      stepEvents.push({
        id: `evt-comp-${currentTick}`,
        timestamp: currentTick,
        realTime: new Date().toLocaleTimeString(),
        type: 'scenario_end',
        title: `Scenario Simulation Cycle Completed: ${scenario.title}`,
        description: 'Simulation timeframe reached terminal duration. System state stabilized for analytical review.',
        severity: 'info'
      });
    }
  } else {
    // Idle baseline: subtle deterministic microclimate drift
    updatedSensors = sensors.map(s => {
      const drift = Math.sin(currentTick * 0.1 + s.baselineValue) * 0.05;
      const val = Number((s.baselineValue + drift).toFixed(2));
      const history = [...s.history, { time: currentTick, value: val }].slice(-20);
      return {
        ...s,
        currentValue: val,
        history,
        lastUpdated: currentTick
      };
    });
  }

  const metrics = computeCityMetrics(updatedBuildings, updatedSensors, updatedRoads);

  // Run AI agents deterministically
  const agentA = runMonitoringAgent(updatedSensors, updatedBuildings, scenario, currentTick);
  const agentB = runRiskAnalysisAgent(updatedBuildings, scenario, currentTick);
  const agentC = runResponsePlanningAgent(updatedBuildings, updatedRoads, scenario, currentTick);
  const agentD = runPublicCommAgent(scenario, currentTick, metrics.affectedBuildingsCount);

  return {
    buildings: updatedBuildings,
    sensors: updatedSensors,
    roads: updatedRoads,
    metrics,
    events: stepEvents,
    aiReports: {
      monitoring: agentA,
      risk_analysis: agentB,
      response_planning: agentC,
      public_comm: agentD
    },
    isCompleted
  };
}
