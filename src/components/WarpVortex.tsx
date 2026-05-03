import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
  brightness: number;
}

interface VortexConfig {
  particleCount: number;
  baseSpeed: number;
  maxAdditionalSpeed: number;
  baseSize: number;
  maxAdditionalSize: number;
  breathingSpeed: number;
  horizontalSpreadAmp: number;
  verticalStretchAmp: number;
  horizontalDriftAmp: number;
  spawnRateAmp: number;
  showVignette: boolean;
}

const CONFIG: VortexConfig = {
  particleCount: typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 400,
  baseSpeed: 0.05,
  maxAdditionalSpeed: 0.2,
  baseSize: 0.5,
  maxAdditionalSize: 2,
  breathingSpeed: 0.02,
  horizontalSpreadAmp: 0.3,
  verticalStretchAmp: 0.5,
  horizontalDriftAmp: 0.8,
  spawnRateAmp: 0.5,
  showVignette: true,
};

export default function WarpVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<(Particle | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      centerX = window.innerWidth / 2;
      centerY = window.innerHeight / 2;
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particle pool
    particlesRef.current = new Array(CONFIG.particleCount).fill(null);

    const initializeParticle = (particle: Particle, time: number) => {
      particle.x = 0;
      particle.y = 0;
      particle.z = 0;

      const spawnPhase = time * CONFIG.breathingSpeed * 2;
      const oscillatingHorizontalSpread =
        (Math.sin(spawnPhase) * 0.5 + 0.5) * CONFIG.horizontalSpreadAmp;

      const angle = Math.random() * Math.PI * 2;
      const spawnDistance =
        Math.random() * (canvasWidth * (0.2 + oscillatingHorizontalSpread));

      particle.x = centerX + Math.cos(angle) * spawnDistance;
      particle.y = centerY + Math.sin(angle) * spawnDistance;
      particle.speed =
        CONFIG.baseSpeed + Math.random() * CONFIG.maxAdditionalSpeed;
      particle.size =
        CONFIG.baseSize + Math.random() * CONFIG.maxAdditionalSize;
      particle.brightness = Math.random();
    };

    const animate = () => {
      const time = Date.now() * 0.001;

      // Compute oscillating parameters
      const verticalStretch =
        (Math.sin(time * CONFIG.breathingSpeed * 0.8) * 0.5 + 0.5) *
        CONFIG.verticalStretchAmp;
      const horizontalDrift =
        (Math.sin(time * CONFIG.breathingSpeed * 1.2) * 0.5 + 0.5) *
        CONFIG.horizontalDriftAmp;
      const spawnRate =
        (Math.sin(time * CONFIG.breathingSpeed * 0.5) * 0.5 + 0.5) *
        CONFIG.spawnRateAmp;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles
      const spawnCount = Math.floor(1 + spawnRate * 5);
      let spawned = 0;
      for (let i = 0; i < particlesRef.current.length && spawned < spawnCount; i++) {
        if (particlesRef.current[i] === null) {
          const newParticle: Particle = {
            x: 0,
            y: 0,
            z: 0,
            speed: 0,
            size: 0,
            brightness: 0,
          };
          initializeParticle(newParticle, time);
          particlesRef.current[i] = newParticle;
          spawned++;
        }
      }

      // Update and draw particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        if (particle === null) continue;

        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const outwardMovement = particle.speed * (1 + distance * 0.001);
        const verticalCompression = Math.cos(angle) * verticalStretch;

        particle.x +=
          Math.cos(angle) * outwardMovement + horizontalDrift + verticalCompression;
        particle.y += Math.sin(angle) * outwardMovement;

        const wobble =
          Math.sin(time * CONFIG.breathingSpeed * 3 + distance * 0.01) * 0.5;
        particle.x += wobble;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + particle.brightness * 0.6})`;
        ctx.fill();

        // Check bounds and reinitialize
        if (
          particle.x < 0 ||
          particle.x > canvasWidth ||
          particle.y < 0 ||
          particle.y > canvasHeight
        ) {
          initializeParticle(particle, time);
        }
      }

      // Draw vignette
      if (CONFIG.showVignette) {
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          canvasWidth * 0.2,
          centerX,
          centerY,
          canvasWidth * 0.75
        );
        gradient.addColorStop(0, 'rgba(5, 5, 8, 0)');
        gradient.addColorStop(1, 'rgba(5, 5, 8, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
