import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  Thermometer, 
  Droplets, 
  Zap, 
  ShieldAlert, 
  Filter,
  StepForward,
  Activity
} from 'lucide-react';
import { DistrictId } from '../../types/city';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore } from '../../store/settingsStore';

export const AnalyticsView: React.FC = () => {
  const buildings = useSimulationStore(state => state.buildings);
  const sensors = useSimulationStore(state => state.sensors);
  const metrics = useSimulationStore(state => state.metrics);
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const tick = useSimulationStore(state => state.tick);
  const currentTick = useSimulationStore(state => state.currentTick);
  const theme = useSettingsStore(state => state.theme);
  const isLight = theme === 'light';

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | 'all'>('all');

  // Filtered buildings
  const filteredBuildings = useMemo(() => {
    if (selectedDistrict === 'all') return buildings;
    return buildings.filter(b => b.district === selectedDistrict);
  }, [buildings, selectedDistrict]);

  // Chart 1: Temperature History from Sensors
  const tempSensors = useMemo(() => {
    return sensors.filter(s => s.category === 'temperature' && (selectedDistrict === 'all' || s.district === selectedDistrict));
  }, [sensors, selectedDistrict]);

  const tempChartData = useMemo(() => {
    if (tempSensors.length === 0) return [];
    const maxHistoryLen = Math.max(...tempSensors.map(s => s.history.length));
    const data = [];
    for (let i = 0; i < maxHistoryLen; i++) {
      let tickTime = i * 5;
      const entry: Record<string, number> = {};
      tempSensors.forEach((s) => {
        if (s.history[i]) {
          tickTime = s.history[i].time;
          entry[s.name.split(' ')[0]] = s.history[i].value;
        }
      });
      entry.tick = tickTime;
      data.push(entry);
    }
    return data;
  }, [tempSensors]);

  // Chart 2: Water Level History
  const waterSensors = useMemo(() => {
    return sensors.filter(s => s.category === 'water_level' && (selectedDistrict === 'all' || s.district === selectedDistrict));
  }, [sensors, selectedDistrict]);

  const waterChartData = useMemo(() => {
    if (waterSensors.length === 0) return [];
    const maxHistoryLen = Math.max(...waterSensors.map(s => s.history.length));
    const data = [];
    for (let i = 0; i < maxHistoryLen; i++) {
      let tickTime = i * 5;
      const entry: Record<string, number> = {};
      waterSensors.forEach((s) => {
        if (s.history[i]) {
          tickTime = s.history[i].time;
          entry[s.name.split(' ')[0]] = s.history[i].value;
        }
      });
      entry.tick = tickTime;
      data.push(entry);
    }
    return data;
  }, [waterSensors]);

  // Chart 3: Asset Impact by Category
  const assetCategoryData = useMemo(() => {
    const counts: Record<string, { total: number; affected: number }> = {};
    filteredBuildings.forEach(b => {
      if (!counts[b.type]) counts[b.type] = { total: 0, affected: 0 };
      counts[b.type].total++;
      if (b.status === 'warning' || b.status === 'critical') {
        counts[b.type].affected++;
      }
    });

    return Object.entries(counts).map(([type, stats]) => ({
      type: type.replace('_', ' ').toUpperCase(),
      normal: stats.total - stats.affected,
      affected: stats.affected
    }));
  }, [filteredBuildings]);

  // Chart 4: Sensor Health
  const sensorStatusData = useMemo(() => {
    let normal = 0;
    let warning = 0;
    let alert = 0;
    sensors.forEach(s => {
      if (s.status === 'critical') alert++;
      else if (s.status === 'alert') warning++;
      else normal++;
    });
    return [
      { name: 'Nominal', value: normal, color: '#42D6A4' },
      { name: 'Warning', value: warning, color: '#FFBF69' },
      { name: 'Alert', value: alert, color: '#FF647C' }
    ];
  }, [sensors]);

  const tooltipStyle = {
    backgroundColor: isLight ? '#ffffff' : '#0B1120',
    borderColor: isLight ? '#cbd5e1' : 'rgba(160,185,220,0.2)',
    fontSize: '11px',
    color: isLight ? '#0F172A' : '#F3F6FC',
    borderRadius: '8px'
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] p-3 sm:p-6 lg:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-32 sm:pb-36 pb-safe">
        {/* Header & District Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-cyan)]">
              <span className="flex items-center gap-1.5 font-bold">
                <BarChart3 className="w-4 h-4" />
                Real-Time Telemetry & Systems Analytics
              </span>
              <span className="hidden sm:inline text-[var(--text-muted)]">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-[var(--accent-cyan)] font-bold">
                <Activity className="w-3 h-3" />
                SIMULATED DATA // 100% LOCAL DETERMINISTIC ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
              City Analytics & Sensor Metrics
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mt-1 leading-relaxed">
              Historical sensor time-series, asset risk distributions, and environmental threshold alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => tick()}
              className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--accent-cyan)]/15 border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] text-xs font-mono font-bold text-[var(--accent-cyan)] transition flex items-center gap-1.5 cursor-pointer touch-min shadow-sm"
              title="Step simulation forward by 5 seconds (T+5s)"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>Step T+5s</span>
            </button>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[var(--accent-cyan)] shrink-0" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value as any)}
                className="w-full sm:w-auto bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] rounded-lg py-2 px-3 focus:outline-none focus:border-[var(--accent-cyan)] cursor-pointer touch-min"
                aria-label="Filter by district"
              >
                <option value="all">All Municipal Districts</option>
                <option value="central">Central District</option>
                <option value="waterfront">Waterfront Basin</option>
                <option value="industrial">Industrial District</option>
                <option value="tech_quad">Tech & Medical Quadrant</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Avg Temperature */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-[10px]">
                <Thermometer className="w-3.5 h-3.5 text-[#FFBF69]" /> Avg Temperature
              </span>
              <span className="text-[10px] font-mono text-[var(--accent-cyan)]">Target: 21.0°C</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-2">
              {metrics.avgCityTemperature} <span className="text-xs font-normal text-[var(--text-secondary)]">°C</span>
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">
              Delta: {Number((metrics.avgCityTemperature - 21.2).toFixed(1))}°C from nominal
            </div>
          </div>

          {/* Air Quality */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-[10px]">
                <ShieldAlert className="w-3.5 h-3.5 text-[var(--accent-cyan)]" /> Mean Air Quality
              </span>
              <span className="text-[10px] font-mono text-[var(--status-success)]">Good &lt; 50</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-2">
              {metrics.avgCityAQI} <span className="text-xs font-normal text-[var(--text-secondary)]">AQI</span>
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">
              {metrics.avgCityAQI > 100 ? 'Unhealthy for sensitive groups' : 'Nominal atmospheric range'}
            </div>
          </div>

          {/* Water Surge Inundation */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-[10px]">
                <Droplets className="w-3.5 h-3.5 text-[#38bdf8]" /> Max Inundation
              </span>
              <span className="text-[10px] font-mono text-[#FFBF69]">Seawall: 0.85m</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-2">
              {metrics.maxFloodDepthMeters} <span className="text-xs font-normal text-[var(--text-secondary)]">m</span>
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">
              {metrics.maxFloodDepthMeters > 0.85 ? 'Retention capacity breached' : 'Retention capacity intact'}
            </div>
          </div>

          {/* Grid Electrical Load */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-[10px]">
                <Zap className="w-3.5 h-3.5 text-[var(--accent-violet)]" /> Grid Load Factor
              </span>
              <span className="text-[10px] font-mono text-[var(--status-success)]">Max 100%</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-2">
              {metrics.cityPowerGridLoadPercent} <span className="text-xs font-normal text-[var(--text-secondary)]">%</span>
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">
              {metrics.cityPowerGridLoadPercent > 100 ? 'Critical overload warning' : 'Nominal grid thresholds'}
            </div>
          </div>
        </div>

        {/* Charts Row 1: Time Series */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Over Time */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Microclimate Temperature Progression (°C)
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Live sensor nodes tracking thermal delta across districts
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--accent-cyan)] border border-[var(--border-subtle)] shrink-0">
                Tick: T+{currentTick}s
              </span>
            </div>
            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempChartData}>
                  <XAxis dataKey="tick" stroke="var(--text-muted)" fontSize={10} tickFormatter={(val) => `T+${val}s`} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} domain={['dataMin - 2', 'dataMax + 5']} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="Central" stroke="#54E7F2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Industrial" stroke="#FF647C" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Hospital" stroke="#9D8CFF" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Harbor" stroke="#38BDF8" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-secondary)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Surge Inundation Over Time */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Waterfront Inundation & Gauge Levels (m)
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Tidal sensors along Basin Pier, Canal Lock, and Seawall
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[#38bdf8] border border-[var(--border-subtle)] shrink-0">
                Threshold: 0.85m
              </span>
            </div>
            <div className="h-60 sm:h-64 w-full flex items-center justify-center">
              {waterChartData.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--text-secondary)] space-y-2">
                  <Droplets className="w-8 h-8 text-[#38bdf8] mx-auto opacity-50" />
                  <p className="font-semibold text-[var(--text-primary)]">
                    No Coastal Probes in {selectedDistrict.toUpperCase()} Sector
                  </p>
                  <p className="max-w-xs text-[11px] text-[var(--text-muted)]">
                    Water gauges are situated along the low-lying Waterfront Basin to monitor coastal storm surges.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={waterChartData}>
                    <XAxis dataKey="tick" stroke="var(--text-muted)" fontSize={10} tickFormatter={(val) => `T+${val}s`} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} domain={[0, 'dataMax + 0.5']} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="Basin" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.25} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="Canal" stroke="#54E7F2" fill="#54E7F2" fillOpacity={0.2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="Promenade" stroke="#9D8CFF" fill="#9D8CFF" fillOpacity={0.15} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-secondary)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Asset Impact & Sensor Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Affected Assets by Category */}
          <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Asset Impact by Functional Classification
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Comparison of normal operational assets versus impacted facilities
              </p>
            </div>
            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetCategoryData}>
                  <XAxis dataKey="type" stroke="var(--text-muted)" fontSize={9} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="normal" name="Operational" fill={isLight ? '#0284c7' : '#1E3A5F'} stackId="a" />
                  <Bar dataKey="affected" name="Affected" fill="#FF647C" stackId="a" />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-secondary)' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sensor Health Distribution Donut */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Telemetry Node Health
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Operational status across 16 monitoring probes
              </p>
            </div>
            <div className="h-44 sm:h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sensorStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {sensorStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)] font-mono">
              {sensorStatusData.map(d => (
                <div key={d.name}>
                  <span className="font-bold block" style={{ color: d.color }}>{d.value}</span>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* District Facility Status Table (Scrollable on mobile) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Sector Facility Register ({filteredBuildings.length} Assets)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Live building telemetry and structural integrity
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[var(--bg-surface)] text-[var(--accent-cyan)] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Asset ID</th>
                  <th className="p-3">Facility Name</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Temp</th>
                  <th className="p-3">AQI</th>
                  <th className="p-3">Power</th>
                  <th className="p-3">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                {filteredBuildings.map(b => (
                  <tr key={b.id} className="hover:bg-[var(--bg-surface)]/60 transition">
                    <td className="p-3 font-mono text-[10px] text-[var(--text-secondary)]">{b.id}</td>
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{b.name}</td>
                    <td className="p-3 capitalize text-[var(--text-secondary)]">{b.district}</td>
                    <td className="p-3 capitalize text-[var(--text-secondary)]">{b.type.replace('_', ' ')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        b.status === 'critical' ? 'bg-[#FF647C]/20 text-[#FF647C]' :
                        b.status === 'warning' ? 'bg-[#FFBF69]/20 text-[#FFBF69]' :
                        'bg-[var(--status-success)]/20 text-[var(--status-success)]'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{b.temperature}°C</td>
                    <td className="p-3 font-mono">{b.airQualityIndex}</td>
                    <td className="p-3 font-mono">{b.powerConsumptionMw} MW</td>
                    <td className="p-3 font-mono">{b.structuralIntegrity}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
