import React, { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

export const PointerResponsiveBackground: React.FC = () => {
  const reducedMotion = useSettingsStore(state => state.reducedMotion);
  const theme = useSettingsStore(state => state.theme);

  const containerRef = useRef<HTMLDivElement>(null);
  const layerDeepRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerGlowRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if pointer is fine (desktop) and not a touch device
    const hasFinePointer = typeof window.matchMedia === 'function' 
      ? window.matchMedia('(pointer: fine) and (hover: hover)').matches 
      : true;
    const isTouch = 'ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
    setIsInteractive(hasFinePointer && !isTouch && !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!isInteractive) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mousePos.current = { x: nx, y: ny };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.05;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.05;

      const px = currentPos.current.x;
      const py = currentPos.current.y;

      if (layerDeepRef.current) {
        layerDeepRef.current.style.transform = `translate3d(${px * -8}px, ${py * -8}px, 0)`;
      }

      if (layerMidRef.current) {
        layerMidRef.current.style.transform = `translate3d(${px * 10}px, ${py * 10}px, 0)`;
      }

      if (layerGlowRef.current) {
        const glowX = ((px + 1) / 2) * 100;
        const glowY = ((py + 1) / 2) * 100;
        if (theme === 'dark') {
          layerGlowRef.current.style.background = `radial-gradient(800px circle at ${glowX}% ${glowY}%, var(--accent-cyan) 0%, transparent 60%)`;
        } else {
          layerGlowRef.current.style.background = `radial-gradient(900px circle at ${glowX}% ${glowY}%, rgba(2, 132, 199, 0.07) 0%, transparent 65%)`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isInteractive, theme]);

  const isDark = theme === 'dark';

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Deep Background: Atmospheric Ambient Glow */}
      <div
        ref={layerGlowRef}
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark ? 'opacity-10' : 'opacity-100'
        }`}
        style={
          !isInteractive
            ? {
                background: isDark
                  ? 'radial-gradient(600px circle at 50% 30%, var(--accent-cyan) 0%, transparent 70%)'
                  : 'radial-gradient(600px circle at 50% 30%, rgba(2, 132, 199, 0.08) 0%, transparent 70%)'
              }
            : undefined
        }
      />

      {/* Spatial Coordinate Grid - Reduced and optimized for mobile */}
      <div
        ref={layerMidRef}
        className={`absolute -inset-10 will-change-transform ${
          isDark ? 'opacity-15' : 'opacity-30'
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, ${
            isDark ? 'rgba(84, 231, 242, 0.08)' : 'rgba(2, 132, 199, 0.12)'
          } 1px, transparent 1px),
          linear-gradient(to bottom, ${
            isDark ? 'rgba(84, 231, 242, 0.08)' : 'rgba(2, 132, 199, 0.12)'
          } 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};
