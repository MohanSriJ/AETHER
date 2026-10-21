import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building2, 
  ShieldAlert, 
  Users,
  ChevronRight
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export const ReportsView: React.FC = () => {
  const buildings = useSimulationStore(state => state.buildings);
  const roadSegments = useSimulationStore(state => state.roadSegments);
  const sensors = useSimulationStore(state => state.sensors);
  const metrics = useSimulationStore(state => state.metrics);
  const events = useSimulationStore(state => state.events);
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const aiReports = useSimulationStore(state => state.aiReports);
  const currentTick = useSimulationStore(state => state.currentTick);
  const activeRoute = useSimulationStore(state => state.activeRoute);

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reportId = `AETHER-RPT-${activeScenario ? activeScenario.id.toUpperCase() : 'EQUILIBRIUM'}-${Date.now().toString().slice(-6)}`;
  const affectedBuildings = buildings.filter(b => b.status === 'warning' || b.status === 'critical');
  const breachedSensors = sensors.filter(s => s.status === 'alert' || s.status === 'critical');

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Asset ID', 'Facility Name', 'District', 'Classification', 'Status', 'Temperature (C)', 'AQI', 'Flood Depth (m)', 'Fire Intensity (%)', 'Structural Integrity (%)', 'Power State'];
    const rows = buildings.map(b => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      b.district,
      b.type,
      b.status,
      b.temperature,
      b.airQualityIndex,
      b.floodDepth,
      b.fireSeverity,
      b.structuralIntegrity,
      b.powerState
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportId}-facilities.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setDownloadSuccess('CSV dataset downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // JSON Audit Bundle Export Handler
  const handleExportJSON = () => {
    const auditData = {
      reportId,
      generatedAt: new Date().toISOString(),
      simulationTickSeconds: currentTick,
      scenario: activeScenario,
      metrics,
      affectedFacilities: affectedBuildings,
      breachedSensors,
      events,
      aiReports,
      activeRoute,
      disclaimer: 'DEMONSTRATION DATA ONLY. Formulated within the AETHER simulated digital twin.'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${reportId}-audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess('JSON audit package exported successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Print-Ready HTML Document Download Handler
  const handleExportHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${reportId} — AETHER Incident Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070B14; color: #F3F6FC; padding: 40px; margin: 0; }
    .header { border-bottom: 2px solid #54E7F2; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #54E7F2; margin: 0; font-size: 24px; }
    .meta { color: #9BA9BF; font-size: 12px; margin-top: 8px; font-family: monospace; }
    .section { margin-bottom: 25px; background: #10192B; padding: 20px; border-radius: 8px; border: 1px solid rgba(160,185,220,0.15); }
    h2 { color: #9D8CFF; font-size: 16px; margin-top: 0; margin-bottom: 15px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; padding: 8px; background: #141F33; color: #54E7F2; border-bottom: 1px solid rgba(160,185,220,0.2); }
    td { padding: 8px; border-bottom: 1px solid rgba(160,185,220,0.1); color: #F3F6FC; }
    .disclaimer { font-size: 11px; color: #62728D; font-style: italic; margin-top: 40px; border-top: 1px solid rgba(160,185,220,0.2); padding-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>AETHER Incident Audit Report</h1>
    <div class="meta">Report ID: ${reportId} | Generated: ${new Date().toLocaleString()} | Sim Time: T+${currentTick}s</div>
  </div>

  <div class="section">
    <h2>1. Executive Summary</h2>
    <p>Scenario: <strong>${activeScenario ? activeScenario.title : 'Baseline Equilibrium'}</strong> (${activeScenario ? (activeScenario.intensity * 100).toFixed(0) + '% Intensity' : 'Normal'})</p>
    <p>Impact Assessment: ${affectedBuildings.length} municipal buildings impacted; ${metrics.totalAtRiskPopulation.toLocaleString()} citizens within the hazard boundary.</p>
  </div>

  <div class="section">
    <h2>2. Impacted Municipal Facilities (${affectedBuildings.length})</h2>
    <table>
      <thead>
        <tr><th>Facility Name</th><th>District</th><th>Status</th><th>Temp (°C)</th><th>AQI</th><th>Flood (m)</th><th>Integrity</th></tr>
      </thead>
      <tbody>
        ${affectedBuildings.map(b => `
          <tr>
            <td>${b.name}</td>
            <td>${b.district}</td>
            <td>${b.status.toUpperCase()}</td>
            <td>${b.temperature}°C</td>
            <td>${b.airQualityIndex}</td>
            <td>${b.floodDepth} m</td>
            <td>${b.structuralIntegrity}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="disclaimer">
    * DEMONSTRATION RECORD ONLY. All numbers derive from the AETHER deterministic synthetic digital twin.
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Print-ready HTML document downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8 pb-32 sm:pb-36 pb-safe">
        {/* Header & Export Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-cyan)]">
              <FileText className="w-4 h-4" />
              <span>Certified Simulation Audit & Governance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
              Incident Reporting & Compliance
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1.5 leading-relaxed">
              Comprehensive post-incident assessment documents generated directly from verified simulation state. Exportable to CSV, JSON, and print-ready formats.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportHTML}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[var(--accent-cyan)] hover:opacity-90 text-[var(--btn-primary-text)] font-bold text-xs transition shadow-md cursor-pointer touch-min"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>HTML / Print</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold text-xs transition cursor-pointer touch-min"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#42D6A4]" />
              <span>CSV Dataset</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold text-xs transition cursor-pointer touch-min"
            >
              <FileCode className="w-3.5 h-3.5 text-[var(--accent-violet)]" />
              <span>JSON Audit</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-[#42D6A4]/15 border border-[#42D6A4]/40 text-[#42D6A4] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* The Live Rendered Report Document */}
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl space-y-6 text-xs text-[var(--text-primary)]">
          {/* Document Masthead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-2">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[var(--accent-cyan)] uppercase font-bold">
                AETHER METROPOLITAN DIGITAL TWIN AUTHORITY
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-0.5">
                MUNICIPAL INCIDENT AUDIT & STRATEGIC RECOMMENDATION
              </h2>
            </div>
            <div className="text-left sm:text-right font-mono text-[10px] sm:text-[11px] text-[var(--text-secondary)] break-all">
              <div>REF: {reportId}</div>
              <div>TIMEFRAME: T+{currentTick}s</div>
            </div>
          </div>

          {/* Section 1: Scenario Overview */}
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-violet)]">
              1. Incident Context & Scenario Configuration
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[var(--text-secondary)] text-[10px] uppercase">Scenario</span>
                <div className="font-semibold text-[var(--text-primary)]">
                  {activeScenario ? activeScenario.title : 'Baseline Equilibrium'}
                </div>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] text-[10px] uppercase">Calibrated Severity</span>
                <div className="font-semibold font-mono text-[var(--accent-cyan)]">
                  {activeScenario ? `${(activeScenario.intensity * 100).toFixed(0)}% Intensity` : 'Nominal (0%)'}
                </div>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] text-[10px] uppercase">Impacted Sector</span>
                <div className="font-semibold capitalize text-[var(--text-primary)]">
                  {activeScenario ? activeScenario.targetDistrict : 'Citywide'}
                </div>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] text-[10px] uppercase">Exposed Population</span>
                <div className="font-semibold font-mono text-[#FF647C]">
                  {metrics.totalAtRiskPopulation.toLocaleString()} citizens
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Impacted Facilities Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-violet)] flex items-center justify-between">
              <span>2. High-Exposure Facilities Register ({affectedBuildings.length})</span>
            </h3>

            {affectedBuildings.length === 0 ? (
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] italic text-center border border-[var(--border-subtle)]">
                All 24 monitored facilities currently report within nominal equilibrium thresholds.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface)] text-[var(--accent-cyan)] font-mono text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Asset ID</th>
                      <th className="p-2.5">Facility Name</th>
                      <th className="p-2.5">District</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Temp</th>
                      <th className="p-2.5">AQI</th>
                      <th className="p-2.5">Inundation</th>
                      <th className="p-2.5">Integrity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-elevated)]/50">
                    {affectedBuildings.map(b => (
                      <tr key={b.id} className="hover:bg-[var(--bg-surface)]/60">
                        <td className="p-2.5 font-mono text-[10px] text-[var(--text-secondary)]">{b.id}</td>
                        <td className="p-2.5 font-semibold text-[var(--text-primary)]">{b.name}</td>
                        <td className="p-2.5 capitalize text-[var(--text-secondary)]">{b.district}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                            b.status === 'critical' ? 'bg-[#FF647C]/20 text-[#FF647C]' : 'bg-[#FFBF69]/20 text-[#FFBF69]'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono">{b.temperature}°C</td>
                        <td className="p-2.5 font-mono">{b.airQualityIndex}</td>
                        <td className="p-2.5 font-mono">{b.floodDepth} m</td>
                        <td className="p-2.5 font-mono">{b.structuralIntegrity}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 3: AI Intelligence Summaries */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-violet)]">
              3. Operational AI Module Findings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(aiReports).map(report => (
                <div key={report.agentId} className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                  <div className="font-semibold text-xs text-[var(--accent-cyan)]">
                    {report.agentName}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {report.summary}
                  </p>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">
                    Key Metric: {Object.entries(report.metrics)[0]?.[0]} = {Object.entries(report.metrics)[0]?.[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Mandatory Limitations & Demo Notice */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] leading-relaxed space-y-1">
            <div className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
              Assumptions, Simulation Boundary & Legal Limitations
            </div>
            <p>
              This incident audit was compiled deterministically from synthetic digital twin sensors and graph algorithms. All temperature fluctuations, water levels, and power line statuses are algorithmic approximations for system testing and demonstration purposes. No live civil protection or emergency dispatch system was triggered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
