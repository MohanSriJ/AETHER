import { AgentReport } from '../../types/ai';
import { ScenarioConfig } from '../../types/simulation';

export function runPublicCommAgent(
  scenario: ScenarioConfig | null,
  simTime: number,
  criticalBuildingsCount: number
): AgentReport {
  const isIncident = scenario !== null && criticalBuildingsCount > 0;

  const advisoryHeadline = isIncident
    ? `ADVISORY: Simulated ${scenario.title} Event — Precautionary Notice`
    : 'PUBLIC ADVISORY: All municipal systems operating normally.';

  const findings: string[] = [];
  if (!isIncident) {
    findings.push('Municipal weather, environmental quality, and public transport systems functioning normally.');
    findings.push('No public safety advisories or shelter recommendations currently active.');
  } else {
    findings.push(`Advisory level: TIER ${Math.min(3, Math.ceil(scenario.intensity * 3))} WARNING for ${scenario.targetDistrict.toUpperCase()} district.`);
    if (scenario.id === 'flood') {
      findings.push('Citizen Guidance: Move to higher floors in coastal and waterfront zones. Do not drive or walk through flooded roadways.');
      findings.push('Bifrost Bridge transit access restricted to emergency services only.');
    } else if (scenario.id === 'fire') {
      findings.push('Citizen Guidance: Industrial district perimeter sealed. Residents within 1km advised to close windows and seal air intakes due to particulate smoke.');
    } else if (scenario.id === 'heatwave') {
      findings.push('Citizen Guidance: Public cooling shelters opened at Grand Central Hub and Civic Plaza. Hydrate frequently and avoid outdoor exertion between 11:00 and 17:00.');
    } else if (scenario.id === 'power_outage') {
      findings.push('Citizen Guidance: Traffic signals offline at key intersections. Treat all intersections as 4-way stops. Conserve device battery life.');
    }
  }

  const recommendations = isIncident ? [
    {
      id: 'rec-comm-1',
      title: 'Broadcast Localized Cellular Alert (Simulated)',
      priority: 'high' as const,
      targetDistrict: scenario.targetDistrict,
      action: `Transmit multi-lingual emergency push notification to mobile devices in ${scenario.targetDistrict} sector.`,
      rationale: 'Informs citizens of localized hazards before evacuation routes become congested.',
      affectedAssetIds: [],
      estimatedImpact: 'Ensures estimated 92% population reach within 3 minutes.'
    },
    {
      id: 'rec-comm-2',
      title: 'Activate Variable Road Signage (VMS)',
      priority: 'medium' as const,
      targetDistrict: scenario.targetDistrict,
      action: 'Display bypass routing warnings on highway electronic displays.',
      rationale: 'Diverts non-essential civilian vehicles away from compromised zones.',
      affectedAssetIds: [],
      estimatedImpact: 'Reduces perimeter traffic density by 40%.'
    }
  ] : [];

  return {
    agentId: 'public_comm',
    agentName: 'Agent D — Public Communication & Civil Information',
    role: 'Translation of technical telemetry into unambiguous, empathetic citizen guidance and broadcast alerts.',
    status: isIncident ? 'alert' : 'completed',
    lastAnalysisTimestamp: simTime,
    summary: advisoryHeadline,
    findings,
    metrics: {
      'Broadcast Level': isIncident ? `Tier ${Math.min(3, Math.ceil(scenario.intensity * 3))}` : 'Nominal',
      'Dissemination Reach': isIncident ? '89,400 est. devices' : 'Passive',
      'Target Zone': scenario ? scenario.targetDistrict.toUpperCase() : 'ALL',
      'Language Variants': '4 (Simulated)'
    },
    rulesEvaluated: [
      'RULE_PLAIN_LANGUAGE: Technical telemetry translated to accessible citizen directives',
      'RULE_NO_PANIC: Calibrated warning scale without hyperbolic phrasing',
      'RULE_DEMO_DISCLAIMER: All notices stamped as simulated emergency exercises'
    ],
    recommendations,
    limitations: [
      'CIVILIAN NOTICE DISCLAIMER: These notices are educational demonstrations inside the AETHER simulated digital twin and do not represent real-world civil protection alerts.',
      'Broadcast reach figures are synthetic estimates.'
    ]
  };
}
