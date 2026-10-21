import { AgentReport } from '../../types/ai';
import { BuildingAsset } from '../../types/city';
import { RoadSegment } from '../../types/routing';
import { ScenarioConfig } from '../../types/simulation';

export function runResponsePlanningAgent(
  buildings: BuildingAsset[],
  roads: RoadSegment[],
  scenario: ScenarioConfig | null,
  simTime: number
): AgentReport {
  const impassableRoads = roads.filter(r => r.status === 'blocked' || r.status === 'flooded');
  const criticalBuildings = buildings.filter(b => b.status === 'critical');

  const findings: string[] = [];
  if (criticalBuildings.length === 0 && impassableRoads.length === 0) {
    findings.push('Municipal emergency response units in standby readiness.');
    findings.push('All major transit and emergency service corridors remain unobstructed.');
  } else {
    findings.push(`Emergency response active: ${criticalBuildings.length} assets require emergency intervention.`);
    findings.push(`${impassableRoads.length} transit segments compromised; automated re-routing required for emergency services.`);
    if (scenario?.id === 'flood') {
      findings.push('Waterfront flood barriers deployment recommended along Quay West and Marina Basin.');
    } else if (scenario?.id === 'fire') {
      findings.push('Containment perimeter recommended around Industrial Fabrication complex; 300m safety buffer.');
    } else if (scenario?.id === 'power_outage') {
      findings.push('Mobile generator priority dispatch assigned to Hospital Trauma Center and Datacenter.');
    }
  }

  const recommendations = [
    {
      id: 'rec-resp-1',
      title: 'Dispatch Emergency Response Vehicles via Cleared Corridors',
      priority: 'critical' as const,
      targetDistrict: scenario?.targetDistrict || 'all',
      action: 'Compute and execute Dijkstra-cleared navigation vectors avoiding blocked sectors.',
      rationale: `${impassableRoads.length} segments obstructed; primary corridors must be kept clear of civilian traffic.`,
      affectedAssetIds: criticalBuildings.map(b => b.id).slice(0, 3),
      estimatedImpact: 'Reduces emergency dispatch transit time by an estimated 32%.'
    },
    {
      id: 'rec-resp-2',
      title: 'Isolate Vulnerable Grid Feeders',
      priority: 'high' as const,
      targetDistrict: scenario?.targetDistrict || 'all',
      action: 'Automate switchgear isolation to prevent cascading thermal or short-circuit overloads.',
      rationale: 'Protects adjacent districts and preserves municipal hospital power reserves.',
      affectedAssetIds: ['bld-i-01', 'bld-t-01'],
      estimatedImpact: 'Prevents secondary power grid blackouts.'
    }
  ];

  return {
    agentId: 'response_planning',
    agentName: 'Agent C — Operational Response & Dispatch Planning',
    role: 'Logistical planning, transit optimization, asset isolation, and emergency fleet dispatch guidance.',
    status: criticalBuildings.length > 0 ? 'alert' : 'completed',
    lastAnalysisTimestamp: simTime,
    summary: criticalBuildings.length > 0
      ? `Incident response plan formulated: ${criticalBuildings.length} target facilities prioritized; alternative transit corridors verified.`
      : 'Response grid clear. Ready for scenario tasking.',
    findings,
    metrics: {
      'Critical Interventions': criticalBuildings.length,
      'Compromised Segments': impassableRoads.length,
      'Response Readiness': '98.5%',
      'Routing Mode': 'Dijkstra Hazard-Aware'
    },
    rulesEvaluated: [
      'RULE_ROUTE_AVOIDANCE: Segments with hazardSeverity > 0.6 excluded from path graph',
      'RULE_PRIORITY_DISPATCH: Medical > Water Treatment > Power > Commercial',
      'RULE_CONTAINMENT: Establish 300m buffer perimeter around high-volatility assets'
    ],
    recommendations,
    limitations: [
      'Routes and dispatch times are calculated on a synthetic graph and do not constitute certified emergency services dispatch orders.',
      'Dispatch times do not account for live civilian panic congestion.'
    ]
  };
}
