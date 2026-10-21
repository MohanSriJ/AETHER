import * as THREE from 'three';

// Cache generated textures to avoid recreating canvases during renders
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getBuildingFacadeTexture(
  theme: 'dark' | 'light',
  variant: 'central' | 'waterfront' | 'industrial' | 'tech_quad' | 'hazard' = 'central',
  style: 'curtain_wall' | 'standard' | 'hologram' = 'curtain_wall'
): THREE.CanvasTexture {
  const cacheKey = `${theme}-${variant}-${style}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  const isLight = theme === 'light';

  if (style === 'hologram') {
    // Pure holographic neon grid for cyan focus buildings
    ctx.fillStyle = '#011424';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    const gridSpacing = 32;

    for (let x = 0; x <= 512; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    textureCache.set(cacheKey, tex);
    return tex;
  }

  // Modern curtain-wall architectural facade matching the smart city cockpit
  // Base architectural frame color (white/light steel mullions in modern corporate towers)
  if (isLight) {
    ctx.fillStyle = variant === 'industrial' ? '#cbd5e1' : '#f8fafc';
  } else {
    ctx.fillStyle = variant === 'industrial' ? '#182030' : '#1e293b';
  }
  ctx.fillRect(0, 0, 512, 512);

  const floorCount = 16;
  const floorHeight = 512 / floorCount;
  const windowCols = 16;
  const colWidth = 512 / windowCols;
  const mullionThickness = 2.5;

  for (let f = 0; f < floorCount; f++) {
    const y = f * floorHeight;

    // Horizontal architectural spandrel beam
    ctx.fillStyle = isLight ? '#94a3b8' : '#334155';
    ctx.fillRect(0, y + floorHeight - 4, 512, 4);

    // Subtle floor divider shadow
    ctx.fillStyle = isLight ? '#64748b' : '#0f172a';
    ctx.fillRect(0, y, 512, 1);

    for (let c = 0; c < windowCols; c++) {
      const x = c * colWidth;
      const winX = x + mullionThickness;
      const winY = y + 2;
      const winW = colWidth - mullionThickness * 2;
      const winH = floorHeight - 7;

      // Deterministic illumination pattern
      const hash = Math.sin(f * 17 + c * 43 + (variant === 'waterfront' ? 11 : 23)) * 10000;
      const rand = hash - Math.floor(hash);

      let glassColor = '';

      if (isLight) {
        if (rand > 0.85) {
          glassColor = '#0284c7'; // Deep blue sky reflection
        } else if (rand > 0.5) {
          glassColor = '#38bdf8'; // Soft sky blue
        } else if (rand > 0.2) {
          glassColor = '#bae6fd'; // Bright sunlight tint
        } else {
          glassColor = '#64748b'; // Interior shadow
        }
      } else {
        // Dark mode: deep blue reflective glass with illuminated office windows
        if (rand > 0.86) {
          glassColor = '#54e7f2'; // Vibrant cyan illuminated office
        } else if (rand > 0.72) {
          glassColor = '#fef08a'; // Warm amber office light
        } else if (rand > 0.55) {
          glassColor = '#38bdf8'; // Electric blue screen reflection
        } else if (rand > 0.3) {
          glassColor = '#0f2744'; // Dim blue glass tint
        } else {
          glassColor = '#07111e'; // Nocturnal dark pane
        }
      }

      ctx.fillStyle = glassColor;
      ctx.fillRect(winX, winY, winW, winH);

      // Glass inner highlight
      ctx.fillStyle = isLight ? 'rgba(255,255,255,0.3)' : 'rgba(84, 231, 242, 0.15)';
      ctx.fillRect(winX, winY, winW * 0.4, winH);

      // Vertical mullion
      ctx.fillStyle = isLight ? '#e2e8f0' : '#475569';
      ctx.fillRect(x, y, mullionThickness, floorHeight);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  textureCache.set(cacheKey, texture);
  return texture;
}

export function clearTextureCache() {
  textureCache.clear();
}
