import React, { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

type CursorVariant = 'default' | 'interactive' | 'canvas3d' | 'canvas3d_active' | 'text' | 'disabled';

export const InteractiveCursor: React.FC = () => {
  const reducedMotion = useSettingsStore(state => state.reducedMotion);
  const customCursorEnabled = useSettingsStore(state => state.customCursorEnabled);
  const theme = useSettingsStore(state => state.theme);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailingRingRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trailingPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);
  const isMouseDown = useRef(false);
  const isOverCanvas = useRef(false);
  const variant = useRef<CursorVariant>('default');

  const [isDesktopPointer, setIsDesktopPointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPointer = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsDesktopPointer(hasFinePointer && !hasTouch);
    };

    checkPointer();

    const mediaFine = window.matchMedia('(pointer: fine)');
    const mediaHover = window.matchMedia('(hover: hover)');

    mediaFine.addEventListener('change', checkPointer);
    mediaHover.addEventListener('change', checkPointer);

    return () => {
      mediaFine.removeEventListener('change', checkPointer);
      mediaHover.removeEventListener('change', checkPointer);
    };
  }, []);

  useEffect(() => {
    // Completely disable on mobile / touch / reduced-motion
    if (!isDesktopPointer || reducedMotion || !customCursorEnabled) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    document.body.classList.add('custom-cursor-active');

    let animId: number;

    const handleMouseDown = () => {
      isMouseDown.current = true;
      if (isOverCanvas.current) {
        variant.current = 'canvas3d_active';
      }
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      if (isOverCanvas.current) {
        variant.current = 'canvas3d';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        ringPos.current = { x: e.clientX, y: e.clientY };
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const canvasElem = target.closest('canvas, [data-cursor="explore"]');
      isOverCanvas.current = !!canvasElem;

      if (target.closest('input[type="text"], input[type="search"], textarea, [contenteditable="true"]')) {
        variant.current = 'text';
      } else if (isOverCanvas.current) {
        variant.current = isMouseDown.current ? 'canvas3d_active' : 'canvas3d';
        ringPos.current = { x: e.clientX, y: e.clientY };
      } else if (target.closest('button:disabled, [aria-disabled="true"]')) {
        variant.current = 'disabled';
      } else if (target.closest('button, a, input[type="range"], [role="button"], [data-cursor="interactive"], .interactive-target')) {
        variant.current = 'interactive';
      } else {
        variant.current = 'default';
      }
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    const animate = () => {
      if (isOverCanvas.current) {
        ringPos.current.x = mousePos.current.x;
        ringPos.current.y = mousePos.current.y;
        trailingPos.current.x = mousePos.current.x;
        trailingPos.current.y = mousePos.current.y;
      } else {
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.45;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.45;
        trailingPos.current.x += (mousePos.current.x - trailingPos.current.x) * 0.22;
        trailingPos.current.y += (mousePos.current.y - trailingPos.current.y) * 0.22;
      }

      const rx = ringPos.current.x;
      const ry = ringPos.current.y;
      const tx = trailingPos.current.x;
      const ty = trailingPos.current.y;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        dotRef.current.style.opacity = isVisible.current && variant.current !== 'text' ? '1' : '0';
      }

      if (trailingRingRef.current) {
        trailingRingRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        trailingRingRef.current.style.opacity = isVisible.current && variant.current !== 'text' && !isOverCanvas.current ? '0.6' : '0';
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        ringRef.current.style.opacity = isVisible.current && variant.current !== 'text' ? '1' : '0';

        switch (variant.current) {
          case 'interactive':
            ringRef.current.className =
              'fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border-2 border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/15 pointer-events-none z-[9999] transition-[width,height,transform] duration-150 scale-110';
            break;
          case 'canvas3d':
            // High-precision zero-lag CAD targeting reticle over the 3D model
            ringRef.current.className =
              'fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-dashed border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5 pointer-events-none z-[9999] transition-none animate-spin-slow';
            break;
          case 'canvas3d_active':
            // Orbit drag anchor state
            ringRef.current.className =
              'fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-lg border-2 border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/30 pointer-events-none z-[9999] transition-none shadow-[0_0_15px_var(--accent-cyan)] scale-90';
            break;
          case 'disabled':
            ringRef.current.className =
              'fixed top-0 left-0 -ml-3.5 -mt-3.5 w-7 h-7 rounded-full border border-red-400/60 pointer-events-none z-[9999] opacity-40';
            break;
          default:
            ringRef.current.className =
              'fixed top-0 left-0 -ml-3.5 -mt-3.5 w-7 h-7 rounded-full border border-[var(--accent-cyan)]/70 pointer-events-none z-[9999] transition-[width,height,transform] duration-150';
            break;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isDesktopPointer, reducedMotion, customCursorEnabled, theme]);

  // Return nothing on touch/mobile devices
  if (!isDesktopPointer || reducedMotion || !customCursorEnabled) {
    return null;
  }

  return (
    <div
      data-testid="interactive-cursor"
      className="custom-cursor pointer-events-none select-none z-[9999]"
      aria-hidden="true"
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[var(--accent-cyan)] pointer-events-none z-[9999] shadow-sm shadow-[var(--accent-cyan)]"
      />

      {/* Responsive Focus Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-3.5 -mt-3.5 w-7 h-7 rounded-full border border-[var(--accent-cyan)]/70 pointer-events-none z-[9999]"
      />

      {/* Secondary Softly Trailing Accent Ring */}
      <div
        ref={trailingRingRef}
        className="fixed top-0 left-0 -ml-5 -mt-5 w-10 h-10 rounded-full border border-[var(--accent-violet)]/35 pointer-events-none z-[9998] transition-opacity duration-300"
      />
    </div>
  );
};
