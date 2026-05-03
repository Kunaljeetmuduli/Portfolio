import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const retinaRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'scanning' | 'confirmed' | 'diving'>('scanning');
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Infinite rotation for rings
      gsap.to('.ring-outer', { rotation: 360, transformOrigin: 'center', duration: 12, repeat: -1, ease: 'linear' });
      gsap.to('.ring-inner', { rotation: -360, transformOrigin: 'center', duration: 8, repeat: -1, ease: 'linear' });
      gsap.to('.ring-dashed', { rotation: 180, transformOrigin: 'center', duration: 20, repeat: -1, ease: 'linear' });

      // Laser sweep up and down
      const laserTween = gsap.to('.scanner-laser', { 
        y: 280, 
        duration: 1.2, 
        yoyo: true, 
        repeat: -1, 
        ease: 'sine.inOut' 
      });

      // Sequence Timeline
      tl.to({}, { duration: 2.8 }) // Scanning phase
        .add(() => {
          setPhase('confirmed');
          laserTween.kill();
          gsap.to('.scanner-laser', { opacity: 0, duration: 0.2 });
          
          // Flash everything to success green
          gsap.to('.svg-stroke', { stroke: '#00FF41', duration: 0.3 });
          gsap.to('.svg-fill', { fill: '#00FF41', duration: 0.3 });
          gsap.to('.text-status', { color: '#00FF41', duration: 0.3, textShadow: '0 0 10px rgba(0,255,65,0.5)' });
        })
        .to({}, { duration: 1.5 }) // Hold on confirmed message
        .add(() => {
          setPhase('diving');
        })
        // Dive through the lens
        .to(retinaRef.current, { 
          scale: 30, 
          opacity: 0, 
          duration: 1.5, 
          ease: 'power4.in',
        })
        // Fade out black background
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => {
            onComplete();
          }
        }, '-=0.8');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#050508' }}
    >
      <div ref={retinaRef} className="relative flex flex-col items-center justify-center">
        {/* SVG Retina Scanner */}
        <svg 
          width="400" 
          height="400" 
          viewBox="0 0 400 400" 
          className="relative z-10"
        >
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#FF003C" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Crosshairs */}
          <g className="crosshairs" opacity="0.5">
            <line x1="200" y1="0" x2="200" y2="400" className="svg-stroke" stroke="var(--neural-cyan)" strokeWidth="1" />
            <line x1="0" y1="200" x2="400" y2="200" className="svg-stroke" stroke="var(--neural-cyan)" strokeWidth="1" />
            {/* Center dot */}
            <circle cx="200" cy="200" r="3" className="svg-fill" fill="var(--neural-cyan)" />
          </g>

          {/* Outer Ring */}
          <circle 
            className="ring-outer svg-stroke" 
            cx="200" cy="200" r="180" 
            stroke="var(--neural-cyan)" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="4 12" 
          />

          {/* Middle Dashed Ring */}
          <circle 
            className="ring-dashed svg-stroke" 
            cx="200" cy="200" r="140" 
            stroke="var(--neural-cyan)" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray="40 20" 
            opacity="0.7"
          />

          {/* Inner Solid Ring */}
          <circle 
            className="ring-inner svg-stroke" 
            cx="200" cy="200" r="100" 
            stroke="var(--neural-cyan)" 
            strokeWidth="1" 
            fill="none" 
          />
          
          {/* Inner ticks */}
          <circle 
            className="ring-inner svg-stroke" 
            cx="200" cy="200" r="90" 
            stroke="var(--neural-cyan)" 
            strokeWidth="6" 
            fill="none" 
            strokeDasharray="2 8" 
            opacity="0.5"
          />

          {/* Decorative Corner Brackets */}
          <g className="svg-stroke" stroke="var(--neural-cyan)" strokeWidth="3" fill="none">
            <path d="M 40 60 L 40 40 L 60 40" />
            <path d="M 360 60 L 360 40 L 340 40" />
            <path d="M 40 340 L 40 360 L 60 360" />
            <path d="M 360 340 L 360 360 L 340 360" />
          </g>

          {/* Sweeping Laser */}
          <g className="scanner-laser" transform="translate(0, 60)">
            <rect x="50" y="0" width="300" height="2" fill="url(#laserGrad)" filter="url(#glow)" />
            <polygon points="200,-5 205,2 195,2" fill="#FF003C" />
            <polygon points="200,7 205,0 195,0" fill="#FF003C" />
          </g>
        </svg>

        {/* Status Text overlay in the center of the ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="bg-[#050508]/80 backdrop-blur-sm px-6 py-2 border border-[var(--neural-cyan)]/30 rounded-sm">
            {phase === 'scanning' && (
              <div className="text-status font-mono text-sm tracking-widest text-[var(--neural-cyan)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                SCANNING_BIOMETRICS...
              </div>
            )}
            {phase === 'confirmed' && (
              <div className="text-status font-mono text-sm tracking-widest text-[#00FF41] flex flex-col items-center gap-1">
                <span>UNREGISTERED_USER_DETECTED</span>
                <span className="text-xs opacity-80">INITIATING_GUEST_PROTOCOL...</span>
              </div>
            )}
            {phase === 'diving' && (
              <div className="text-status font-mono text-sm tracking-widest text-[#00FF41] flex flex-col items-center gap-1 opacity-0">
                <span>GUEST_ACCESS_GRANTED</span>
                <span className="text-xs opacity-80">WELCOME_TO_MAINFRAME</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: 'linear-gradient(var(--neural-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neural-cyan) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
