import { create } from 'zustand';
import { INITIAL_BUILDINGS, INITIAL_LANDMARKS, INITIAL_SENSORS } from '../data/cityData';
import { ROAD_INTERSECTIONS, ROAD_SEGMENTS } from '../data/roadGraph';
import { computeCityMetrics, executeSimulationStep } from '../simulation/engine';
import { computeShortestRoute } from '../simulation/routing/dijkstra';
import { AgentReport } from '../types/ai';
import { BuildingAsset, LandmarkAsset, TelemetrySensor } from '../types/city';
import { RoadIntersection, RoadSegment, RoutePlan } from '../types/routing';
import { CityMetrics, ScenarioConfig, SimulationEvent, SimulationStatus } from '../types/simulation';

export interface LayerVisibility {
  standard: boolean;
  sensors: boolean;
  hazards: boolean;
  infrastructure: boolean;
  routes: boolean;
}

export interface SimulationStoreState {
  // World State
  buildings: BuildingAsset[];
  landmarks: LandmarkAsset[];
  sensors: TelemetrySensor[];
  roadIntersections: RoadIntersection[];
  roadSegments: RoadSegment[];
  
  // Selection
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  
  // Simulation Controls
  activeScenario: ScenarioConfig | null;
  simulationStatus: SimulationStatus;
  currentTick: number; // in simulated seconds
  playbackSpeed: number; // 1x, 2x, 4x
  
  // Aggregated Data & Intelligence
  metrics: CityMetrics;
  events: SimulationEvent[];
  aiReports: Record<string, AgentReport>;
  
  // Routing
  activeRoute: RoutePlan | null;
  
  // 3D Scene Controls
  layerVisibility: LayerVisibility;
  cameraPreset: 'overview' | 'central' | 'waterfront' | 'industrial' | 'tech_quad';
  
  // Actions
  selectAsset: (id: string | null) => void;
  setHoveredAsset: (id: string | null) => void;
  startScenario: (scenario: ScenarioConfig) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetToBaseline: () => void;
  setPlaybackSpeed: (speed: number) => void;
  tick: () => void;
  seekTick: (targetTick: number) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setCameraPreset: (preset: 'overview' | 'central' | 'waterfront' | 'industrial' | 'tech_quad') => void;
  calculateRoute: (originId: string, destId: string) => void;
  clearRoute: () => void;
}

const initialMetrics = computeCityMetrics(INITIAL_BUILDINGS, INITIAL_SENSORS, ROAD_SEGMENTS);

// Initial AI reports for baseline
const initialStep = executeSimulationStep(INITIAL_BUILDINGS, INITIAL_SENSORS, ROAD_SEGMENTS, null, 0);

export const useSimulationStore = create<SimulationStoreState>((set, get) => ({
  buildings: INITIAL_BUILDINGS,
  landmarks: INITIAL_LANDMARKS,
  sensors: INITIAL_SENSORS,
  roadIntersections: ROAD_INTERSECTIONS,
  roadSegments: ROAD_SEGMENTS,
  
  selectedAssetId: null, // default unselected for clean unobstructed 3D exploration
  hoveredAssetId: null,
  
  activeScenario: null,
  simulationStatus: 'idle',
  currentTick: 0,
  playbackSpeed: 1,
  
  metrics: initialMetrics,
  events: [
    {
      id: 'evt-init',
      timestamp: 0,
      realTime: new Date().toLocaleTimeString(),
      type: 'scenario_start',
      title: 'Digital Twin Synchronized',
      description: 'AETHER city model loaded with 24 municipal facilities and 15 telemetry stations. Baseline parameters verified.',
      severity: 'info'
    }
  ],
  aiReports: initialStep.aiReports,
  
  activeRoute: null,
  
  layerVisibility: {
    standard: true,
    sensors: true,
    hazards: true,
    infrastructure: true,
    routes: true
  },
  cameraPreset: 'overview',
  
  selectAsset: (id) => set({ selectedAssetId: id }),
  setHoveredAsset: (id) => set({ hoveredAssetId: id }),
  
  startScenario: (scenario) => {
    // Reset state before starting scenario
    const baselineBuildings = INITIAL_BUILDINGS.map(b => ({ ...b }));
    const baselineSensors = INITIAL_SENSORS.map(s => ({ ...s }));
    const baselineRoads = ROAD_SEGMENTS.map(r => ({ ...r }));
    
    set({
      activeScenario: scenario,
      simulationStatus: 'running',
      currentTick: 1,
      buildings: baselineBuildings,
      sensors: baselineSensors,
      roadSegments: baselineRoads,
      events: [
        {
          id: `evt-start-${Date.now()}`,
          timestamp: 1,
          realTime: new Date().toLocaleTimeString(),
          type: 'scenario_start',
          title: `Initiated Scenario: ${scenario.title}`,
          description: `Targeting ${scenario.targetDistrict.toUpperCase()} district at ${(scenario.intensity * 100).toFixed(0)}% severity. Duration: ${scenario.durationSeconds}s.`,
          severity: 'warning'
        }
      ]
    });

    // Execute first step immediately
    const res = executeSimulationStep(baselineBuildings, baselineSensors, baselineRoads, scenario, 1);
    set({
      buildings: res.buildings,
      sensors: res.sensors,
      roadSegments: res.roads,
      metrics: res.metrics,
      events: [...get().events, ...res.events],
      aiReports: res.aiReports
    });
  },
  
  pauseSimulation: () => set({ simulationStatus: 'paused' }),
  
  resumeSimulation: () => set({ simulationStatus: 'running' }),
  
  resetToBaseline: () => {
    const res = executeSimulationStep(INITIAL_BUILDINGS, INITIAL_SENSORS, ROAD_SEGMENTS, null, 0);
    set({
      activeScenario: null,
      simulationStatus: 'idle',
      currentTick: 0,
      buildings: INITIAL_BUILDINGS,
      sensors: INITIAL_SENSORS,
      roadSegments: ROAD_SEGMENTS,
      metrics: res.metrics,
      events: [
        {
          id: `evt-reset-${Date.now()}`,
          timestamp: 0,
          realTime: new Date().toLocaleTimeString(),
          type: 'mitigation_applied',
          title: 'Baseline State Restored',
          description: 'All simulated environmental factors returned to nominal equilibrium.',
          severity: 'success'
        }
      ],
      aiReports: res.aiReports,
      activeRoute: null
    });
  },
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  tick: () => {
    const { activeScenario, simulationStatus, currentTick, buildings, sensors, roadSegments, events } = get();
    if (simulationStatus !== 'running') return;
    
    const nextTick = currentTick + 1;
    const res = executeSimulationStep(buildings, sensors, roadSegments, activeScenario, nextTick);
    
    set({
      currentTick: nextTick,
      buildings: res.buildings,
      sensors: res.sensors,
      roadSegments: res.roads,
      metrics: res.metrics,
      events: res.events.length > 0 ? [...events, ...res.events] : events,
      aiReports: res.aiReports,
      simulationStatus: res.isCompleted ? 'completed' : 'running'
    });

    // If an active route exists, recompute to reflect any newly blocked roads
    const currentRoute = get().activeRoute;
    if (currentRoute) {
      const updatedRoute = computeShortestRoute(
        currentRoute.originNodeId,
        currentRoute.destinationNodeId,
        get().roadIntersections,
        res.roads
      );
      set({ activeRoute: updatedRoute });
    }
  },

  seekTick: (targetTick) => {
    const { activeScenario, simulationStatus, roadIntersections } = get();
    const safeTick = Math.max(0, targetTick);
    const baselineBuildings = INITIAL_BUILDINGS.map(b => ({ ...b }));
    const baselineSensors = INITIAL_SENSORS.map(s => ({ ...s }));
    const baselineRoads = ROAD_SEGMENTS.map(r => ({ ...r }));

    const res = executeSimulationStep(
      baselineBuildings,
      baselineSensors,
      baselineRoads,
      activeScenario,
      safeTick
    );

    set({
      currentTick: safeTick,
      buildings: res.buildings,
      sensors: res.sensors,
      roadSegments: res.roads,
      metrics: res.metrics,
      aiReports: res.aiReports,
      simulationStatus: res.isCompleted ? 'completed' : (simulationStatus === 'idle' ? 'idle' : simulationStatus)
    });

    const currentRoute = get().activeRoute;
    if (currentRoute) {
      const updatedRoute = computeShortestRoute(
        currentRoute.originNodeId,
        currentRoute.destinationNodeId,
        roadIntersections,
        res.roads
      );
      set({ activeRoute: updatedRoute });
    }
  },
  
  toggleLayer: (layer) => set(state => ({
    layerVisibility: {
      ...state.layerVisibility,
      [layer]: !state.layerVisibility[layer]
    }
  })),
  
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  
  calculateRoute: (originId, destId) => {
    const { roadIntersections, roadSegments } = get();
    const route = computeShortestRoute(originId, destId, roadIntersections, roadSegments);
    set({ activeRoute: route });
  },
  
  clearRoute: () => set({ activeRoute: null })
}));
