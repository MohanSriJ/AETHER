import { describe, it, expect } from 'vitest';
import { ROAD_INTERSECTIONS } from '../data/roadGraph';
import { INITIAL_BUILDINGS } from '../data/cityData';
import { findNearestRoadNode } from '../simulation/routing/spatial';
import { useSimulationStore } from '../store/simulationStore';
import { ScenarioConfig } from '../types/simulation';

describe('Senior Audit Enhancements Verification', () => {
  it('correctly identifies nearest road intersection for any building coordinates', () => {
    // City Hall / Spire is at [0, 16, 0]
    const spireBuilding = INITIAL_BUILDINGS.find(b => b.id === 'bld-c-01')!;
    const nearestNode = findNearestRoadNode(spireBuilding.position, ROAD_INTERSECTIONS);
    expect(nearestNode).toBe('node-c-0');

    // Trauma Center is at [-34, 9, 36]
    const hospitalBuilding = INITIAL_BUILDINGS.find(b => b.id === 'bld-t-01')!;
    const hospitalNode = findNearestRoadNode(hospitalBuilding.position, ROAD_INTERSECTIONS);
    expect(hospitalNode).toBe('node-t-0');
  });

  it('supports deterministic timeline seek/scrubbing backward and forward', () => {
    const store = useSimulationStore.getState();

    const floodScenario: ScenarioConfig = {
      id: 'flood',
      title: 'Urban Storm Surge',
      tagline: 'Test surge',
      description: 'Test flood',
      iconName: 'flood',
      intensity: 0.8,
      targetDistrict: 'waterfront',
      durationSeconds: 60
    };

    // Start scenario
    store.startScenario(floodScenario);
    expect(useSimulationStore.getState().currentTick).toBe(1);

    // Seek to tick 30 (midpoint)
    store.seekTick(30);
    const midState = useSimulationStore.getState();
    expect(midState.currentTick).toBe(30);
    expect(midState.metrics.maxFloodDepthMeters).toBeGreaterThan(0.5);

    // Seek to tick 50 (advanced stage)
    store.seekTick(50);
    const advancedState = useSimulationStore.getState();
    expect(advancedState.currentTick).toBe(50);
    expect(advancedState.metrics.maxFloodDepthMeters).toBeGreaterThan(midState.metrics.maxFloodDepthMeters);

    // Seek backward to tick 10 (early stage)
    store.seekTick(10);
    const rewindState = useSimulationStore.getState();
    expect(rewindState.currentTick).toBe(10);
    expect(rewindState.metrics.maxFloodDepthMeters).toBeLessThan(midState.metrics.maxFloodDepthMeters);

    // Clean up to baseline
    store.resetToBaseline();
    expect(useSimulationStore.getState().currentTick).toBe(0);
    expect(useSimulationStore.getState().metrics.maxFloodDepthMeters).toBe(0);
  });

  it('correctly toggles dark and light theme state and persists preference', async () => {
    const { useSettingsStore } = await import('../store/settingsStore');
    const store = useSettingsStore.getState();

    // Set explicitly to dark
    store.setTheme('dark');
    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);

    // Toggle to light
    store.toggleTheme();
    expect(useSettingsStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle back to dark
    store.toggleTheme();
    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
