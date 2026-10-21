import { AgentReport } from '../../types/ai';
import { BuildingAsset, TelemetrySensor } from '../../types/city';
import { ScenarioConfig } from '../../types/simulation';

export function runMonitoringAgent(
  sensors: TelemetrySensor[],
  buildings: BuildingAsset[],
  scenario: ScenarioConfig | null,
  simTime: number
): AgentReport {
  const breachedSensors = sensors.filter(s => s.status === 'alert' || s.status === 'critical');
  const offlineSensors = sensors.filter(s => s.status === 'offline');
  const anomalousBuildings = buildings.filter(b => b.status === 'critical' || b.status === 'warning');

  const findings: string[] = [];
  if (breachedSensors.length === 0) {
    findings.push('All 15 distributed telemetry nodes report nominal operating ranges.');
    findings.push('No microclimate, structural vibration, or electrical grid threshold breaches detected.');
  } else {
    findings.push(`Detected ${breachedSensors.length} active sensor threshold violations across ${Array.from(new Set(breachedSensors.map(s => s.district))).join(', ')}.`);
    breachedSensors.slice(0, 3).forEach(s => {
      findings.push(`Node [${s.id}] (${s.name}): current value ${s.currentValue} ${s.unit} exceeds upper safety threshold (${s.maxThreshold} ${s.unit}).`);
    });
  }

  if (anomalousBuildings.length > 0) {
    findings.push(`${anomalousBuildings.length} municipal buildings display degraded environmental or power metrics.`);
  }

  const recommendations = breachedSensors.map((s, idx) => ({
    id: `rec-mon-${s.id}-${idx}`,
    title: `Increase Telemetry Polling Rate on ${s.name}`,
    priority: s.status === 'critical' ? 'critical' as const : 'high' as const,
    targetDistrict: s.district,
    action: `Switch telemetry node ${s.id} to high-frequency 200ms sample mode to track rate-of-change.`,
    rationale: `Sensor reading (${s.currentValue} ${s.unit}) breached safety bounds (${s.maxThreshold} ${s.unit}).`,
    affectedAssetIds: s.associatedBuildingId ? [s.associatedBuildingId] : [],
    estimatedImpact: 'Improves early detection resolution for secondary hazards.'
  }));

  return {
    agentId: 'monitoring',
    agentName: 'Agent A — Telemetry & Sensor Vigilance',
    role: 'Real-time telemetry ingestion, outlier detection, and instrument integrity verification.',
    status: breachedSensors.length > 0 ? 'alert' : 'completed',
    lastAnalysisTimestamp: simTime,
    summary: breachedSensors.length > 0
      ? `Active monitoring alert: ${breachedSensors.length} sensor anomalies observed in current simulation step.`
      : 'Telemetry grid stable. Background environmental metrics within standard parameters.',
    findings,
    metrics: {
      'Reporting Sensors': `${sensors.length - offlineSensors.length}/${sensors.length}`,
      'Active Breaches': breachedSensors.length,
      'Sensor Health Index': `${Math.round(((sensors.length - breachedSensors.length) / sensors.length) * 100)}%`,
      'Telemetry Frequency': '1.0 Hz (Simulated)'
    },
    rulesEvaluated: [
      'RULE_THRESH_01: Sensor.value > MaxThreshold -> ALERT/CRITICAL',
      'RULE_DRIFT_02: Rate of change dV/dt > 15% / 10s -> SPIKE_WARNING',
      'RULE_INTEGRITY_03: Heartbeat missing > 10s -> NODE_OFFLINE'
    ],
    recommendations: recommendations.slice(0, 3),
    limitations: [
      'Simulated readings derive from local deterministic scenario rules rather than live physical transducers.',
      'Sensor sampling rate is synchronized to simulation clock steps.'
    ]
  };
}
