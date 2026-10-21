import { describe, it, expect } from 'vitest';
import { INITIAL_BUILDINGS, INITIAL_SENSORS } from '../data/cityData';
import { ROAD_SEGMENTS } from '../data/roadGraph';
import { executeSimulationStep, computeCityMetrics } from '../simulation/engine';
import { ScenarioConfig } from '../types/simulation';

describe('Deterministic Simulation Engine & Scenarios', () => {
  it('should compute initial baseline metrics correctly', () => {
    const metrics = computeCityMetrics(INITIAL_BUILDINGS, INITIAL_SENSORS, ROAD_SEGMENTS);

    expect(metrics.activeIncidents).toBe(0);
    expect(metrics.affectedBuildingsCount).toBe(0);
    expect(metrics.affectedRoadsCount).toBe(0);
    expect(metrics.sensorsReporting).toBe(INITIAL_SENSORS.length);
    expect(metrics.sensorHealthPercent).toBe(100);
    expect(metrics.avgCityTemperature).toBeCloseTo(22.1, 1);
  });

  it('should simulate Flood scenario and propagate consequences', () => {
    const floodScenario: ScenarioConfig = {
      id: 'flood',
      title: 'Urban Storm Surge & Coastal Flooding',
      tagline: 'Test storm surge',
      description: 'Test flood',
      iconName: 'flood',
      intensity: 0.8,
      targetDistrict: 'waterfront',
      durationSeconds: 60
    };

    // Step at tick 30 (midpoint of duration)
    const result = executeSimulationStep(
      INITIAL_BUILDINGS,
      INITIAL_SENSORS,
      ROAD_SEGMENTS,
      floodScenario,
      30
    );

    expect(result.metrics.activeIncidents).toBe(1);
    expect(result.metrics.affectedBuildingsCount).toBeGreaterThan(0);
    expect(result.metrics.maxFloodDepthMeters).toBeGreaterThan(0.5);

    // Waterfront buildings must exhibit inundation
    const waterfrontBlds = result.buildings.filter(b => b.district === 'waterfront');
    expect(waterfrontBlds.some(b => b.floodDepth > 0)).toBe(true);

    // Waterfront water level sensors must report surge
    const waterSensors = result.sensors.filter(s => s.category === 'water_level');
    expect(waterSensors.some(s => s.currentValue > s.baselineValue)).toBe(true);

    // AI Agents should detect the incident
    expect(result.aiReports.monitoring.status).toBe('alert');
    expect(result.aiReports.risk_analysis.status).toBe('alert');
    expect(result.aiReports.response_planning.recommendations.length).toBeGreaterThan(0);
  });

  it('should simulate Fire scenario with thermal and AQI spikes', () => {
    const fireScenario: ScenarioConfig = {
      id: 'fire',
      title: 'Industrial Chemical & Structural Fire',
      tagline: 'Test fire',
      description: 'Test fire',
      iconName: 'fire',
      intensity: 0.9,
      targetDistrict: 'industrial',
      durationSeconds: 60
    };

    const result = executeSimulationStep(
      INITIAL_BUILDINGS,
      INITIAL_SENSORS,
      ROAD_SEGMENTS,
      fireScenario,
      25
    );

    const originBld = result.buildings.find(b => b.id === 'bld-i-03')!;
    expect(originBld.fireSeverity).toBeGreaterThan(0);
    expect(originBld.temperature).toBeGreaterThan(originBld.baseline.temperature);
    expect(originBld.airQualityIndex).toBeGreaterThan(originBld.baseline.airQualityIndex);
    expect(originBld.structuralIntegrity).toBeLessThan(100);
  });

  it('should simulate Heatwave scenario raising citywide temperatures', () => {
    const heatScenario: ScenarioConfig = {
      id: 'heatwave',
      title: 'Extreme Metropolitan Heat Dome',
      tagline: 'Test heat',
      description: 'Test heat',
      iconName: 'heatwave',
      intensity: 0.75,
      targetDistrict: 'central',
      durationSeconds: 60
    };

    const result = executeSimulationStep(
      INITIAL_BUILDINGS,
      INITIAL_SENSORS,
      ROAD_SEGMENTS,
      heatScenario,
      30
    );

    expect(result.metrics.avgCityTemperature).toBeGreaterThan(25);
    const centralBlds = result.buildings.filter(b => b.district === 'central');
    expect(centralBlds.every(b => b.temperature > b.baseline.temperature)).toBe(true);
  });

  it('should simulate Power Outage cascading to offline status with critical backup failover', () => {
    const outageScenario: ScenarioConfig = {
      id: 'power_outage',
      title: 'Cascading Substation Grid Blackout',
      tagline: 'Test outage',
      description: 'Test outage',
      iconName: 'power_outage',
      intensity: 0.9,
      targetDistrict: 'industrial',
      durationSeconds: 60
    };

    const result = executeSimulationStep(
      INITIAL_BUILDINGS,
      INITIAL_SENSORS,
      ROAD_SEGMENTS,
      outageScenario,
      20
    );

    const industrialBld = result.buildings.find(b => b.id === 'bld-i-03')!;
    expect(industrialBld.powerState).toBe('offline');

    // Substation power sensor drops
    const subSens = result.sensors.find(s => s.id === 'sns-p-01')!;
    expect(subSens.currentValue).toBeLessThan(subSens.baselineValue);
  });
});
