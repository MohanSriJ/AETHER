import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/simulationStore';

export const CityCanvasFallback: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildings = useSimulationStore(state => state.buildings);
  const sensors = useSimulationStore(state => state.sensors);
  const selectedAssetId = useSimulationStore(state => state.selectedAssetId);
  const selectAsset = useSimulationStore(state => state.selectAsset);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 600);

      // Background
      ctx.fillStyle = '#070B14';
      ctx.fillRect(0, 0, width, height);

      // Isometric projection transform
      const originX = width / 2;
      const originY = height / 2 + 50;
      const scale = Math.min(width, height) / 190;

      const toIso = (x: number, z: number, y = 0) => {
        const isoX = originX + (x - z) * Math.cos(Math.PI / 6) * scale;
        const isoY = originY + (x + z) * Math.sin(Math.PI / 6) * scale - y * scale * 1.5;
        return { isoX, isoY };
      };

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(27, 42, 69, 0.4)';
      ctx.lineWidth = 1;
      for (let i = -80; i <= 80; i += 20) {
        const p1 = toIso(i, -80);
        const p2 = toIso(i, 80);
        ctx.beginPath();
        ctx.moveTo(p1.isoX, p1.isoY);
        ctx.lineTo(p2.isoX, p2.isoY);
        ctx.stroke();

        const p3 = toIso(-80, i);
        const p4 = toIso(80, i);
        ctx.beginPath();
        ctx.moveTo(p3.isoX, p3.isoY);
        ctx.lineTo(p4.isoX, p4.isoY);
        ctx.stroke();
      }

      // Sort buildings back-to-front for isometric rendering
      const sorted = [...buildings].sort((a, b) => (a.position[0] + a.position[2]) - (b.position[0] + b.position[2]));

      sorted.forEach(bld => {
        const [x, , z] = bld.position;
        const [w, h, d] = bld.dimensions;
        const isSelected = selectedAssetId === bld.id;

        const base = toIso(x, z, 0);
        const top = toIso(x, z, h);

        const bw = w * scale * 1.2;
        const bh = (base.isoY - top.isoY);

        // Building pillar
        ctx.fillStyle = isSelected
          ? '#54E7F2'
          : bld.status === 'critical'
          ? '#FF647C'
          : bld.status === 'warning'
          ? '#FFBF69'
          : bld.district === 'central'
          ? '#101F38'
          : bld.district === 'waterfront'
          ? '#0E2942'
          : bld.district === 'industrial'
          ? '#221F30'
          : '#161936';

        ctx.strokeStyle = isSelected ? '#54E7F2' : 'rgba(84, 231, 242, 0.2)';
        ctx.lineWidth = isSelected ? 2 : 1;

        ctx.beginPath();
        ctx.rect(top.isoX - bw / 2, top.isoY, bw, bh);
        ctx.fill();
        ctx.stroke();

        // Rooftop light
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#54E7F2';
        ctx.beginPath();
        ctx.arc(top.isoX, top.isoY, isSelected ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw sensor indicators
      sensors.forEach(sns => {
        const [sx, , sz] = sns.position;
        const pt = toIso(sx, sz, 4);
        ctx.fillStyle = sns.status === 'critical' ? '#FF647C' : sns.status === 'alert' ? '#FFBF69' : '#54E7F2';
        ctx.beginPath();
        ctx.arc(pt.isoX, pt.isoY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [buildings, sensors, selectedAssetId]);

  return (
    <div className="relative w-full h-full bg-[#070B14] flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded bg-[#10192B]/90 border border-[rgba(160,185,220,0.14)] text-xs text-[#9BA9BF] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#54E7F2]" />
        <span>2D Isometric Hardware-Accelerated Mode</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onClick={() => {
          // Select next building for interactive exploration in canvas mode
          const nextIndex = (buildings.findIndex(b => b.id === selectedAssetId) + 1) % buildings.length;
          selectAsset(buildings[nextIndex].id);
        }}
      />
    </div>
  );
};
