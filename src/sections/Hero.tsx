import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spotlight
    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);

    // Parallax tilt
    const tiltX = (x / rect.width - 0.5) * 2;
    const tiltY = (y / rect.height - 0.5) * 2;
    heroRef.current.style.setProperty('--tilt-x', `${tiltX * 15}deg`);
    heroRef.current.style.setProperty('--tilt-y', `${-tiltY * 15}deg`);
  };

  const handleSectionMouseLeave = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--tilt-x', '0deg');
    heroRef.current.style.setProperty('--tilt-y', '0deg');
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Label fade in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Title reveal with glow
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
        '-=0.3'
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

      // Corner brackets animate in
      if (bracketsRef.current) {
        const brackets = bracketsRef.current.querySelectorAll('.corner-bracket');
        tl.fromTo(
          brackets,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1 },
          '-=0.4'
        );
      }

      // CTA buttons
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4"
    >
      {/* Spotlight Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-50 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 240, 255, 0.08), transparent 80%)'
        }}
      />


      {/* HUD Widgets */}
      <div className="absolute inset-8 md:inset-16 p-4 md:p-6 pointer-events-none z-0 flex-col justify-between hidden sm:flex">
        {/* Top HUD */}
        <div className="flex justify-between items-start">
          <div className="font-mono text-[10px] text-[var(--neural-cyan)]/70 tracking-widest flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-6">MEM</span>
              <div className="w-16 h-1 bg-[var(--neural-cyan)]/20"><div className="h-full bg-[var(--neural-cyan)] w-[64%]" /></div>
              <span>64%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6">CPU</span>
              <div className="w-16 h-1 bg-[var(--neural-cyan)]/20"><div className="h-full bg-[var(--synapse-violet)] w-[28%]" /></div>
              <span>28%</span>
            </div>
            <div className="mt-1 text-[var(--ghost-gray)]">NET_UPLINK: SECURE</div>
          </div>
          
          <div className="font-mono text-[10px] text-[var(--neural-cyan)]/70 tracking-widest text-right flex flex-col gap-1 items-end">
            <div>SYS.TIME</div>
            <div>{time.toISOString().split('T')[1].slice(0, -1)}</div>
            <div className="mt-1 text-red-400 animate-pulse flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> REC_ACTIVE
            </div>
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="flex justify-between items-end">
          <div className="font-mono text-[10px] text-[var(--neural-cyan)]/50 tracking-widest flex flex-col gap-1">
            <span>POS: 20.2961°N 85.8245°E</span>
            <div className="flex items-center gap-2">
              <span>ALT: 45M</span>
              <div className="flex gap-1 ml-2">
                 <span className="w-2 h-1 bg-[var(--neural-cyan)]/50 block animate-pulse" style={{ animationDelay: '0s' }}></span>
                 <span className="w-2 h-1 bg-[var(--neural-cyan)]/50 block animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-1 bg-[var(--neural-cyan)]/50 block animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>

          <div className="font-mono text-[10px] text-[var(--neural-cyan)]/50 tracking-widest text-right">
            <div>VORTEX_CORE: NOMINAL</div>
            <div>STABILIZERS: ON</div>
          </div>
        </div>
      </div>

      {/* Corner brackets container */}
      <div ref={bracketsRef} className="absolute inset-8 md:inset-16 pointer-events-none z-0">
        {/* Top-left bracket */}
        <div
          className="corner-bracket absolute top-0 left-0 h-10 w-10 md:h-16 md:w-16 opacity-0"
          style={{
            borderTop: '2px solid var(--neural-cyan)',
            borderLeft: '2px solid var(--neural-cyan)',
          }}
        />
        {/* Top-right bracket */}
        <div
          className="corner-bracket absolute top-0 right-0 h-10 w-10 md:h-16 md:w-16 opacity-0"
          style={{
            borderTop: '2px solid var(--neural-cyan)',
            borderRight: '2px solid var(--neural-cyan)',
          }}
        />
        {/* Bottom-left bracket */}
        <div
          className="corner-bracket absolute bottom-0 left-0 h-10 w-10 md:h-16 md:w-16 opacity-0"
          style={{
            borderBottom: '2px solid var(--neural-cyan)',
            borderLeft: '2px solid var(--neural-cyan)',
          }}
        />
        {/* Bottom-right bracket */}
        <div
          className="corner-bracket absolute bottom-0 right-0 h-10 w-10 md:h-16 md:w-16 opacity-0"
          style={{
            borderBottom: '2px solid var(--neural-cyan)',
            borderRight: '2px solid var(--neural-cyan)',
          }}
        />
      </div>

      {/* Main content */}
      <div 
        className="relative z-10 text-center transition-transform duration-300 ease-out"
        style={{
          transform: 'perspective(1000px) rotateY(var(--tilt-x, 0deg)) rotateX(var(--tilt-y, 0deg)) translateZ(50px)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Status label */}
        <div
          ref={labelRef}
          className="mb-6 opacity-0"
          style={{ transform: 'translateZ(20px)' }}
        >
          <span className="inline-block font-mono text-xs tracking-[0.15em] text-[var(--neural-cyan)]/80 px-4 py-2 terminal-border bg-[var(--surface)]/30">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            [ SYSTEM ONLINE ]
          </span>
        </div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="mb-4 opacity-0 group relative z-10 cursor-default"
        >
          <span className="block font-mono text-[clamp(2.5rem,8vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[var(--neural-cyan)] title-glitch">
            KUNALJEET
          </span>
          <span className="block font-mono text-[clamp(2.5rem,8vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[var(--neural-cyan)] title-glitch">
            MUDULI
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mb-10 font-mono text-sm tracking-[0.1em] text-[var(--synapse-violet)] opacity-0"
        >
          <TypeAnimation
            sequence={[
              'SOFTWARE DEVELOPER',
              2000,
              'MACHINE LEARNING ENGINEER',
              2000,
              'LEARNER',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={false}
          />
          <span className="animate-blink ml-1">_</span>
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 relative z-10">
          <button
            onClick={scrollToWork}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="cyber-btn group relative px-8 py-3 font-mono text-xs tracking-[0.1em] rounded"
          >
            <span className="relative z-10 pointer-events-none drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">[ EXPLORE_WORK ]</span>
          </button>

          <button
            onClick={scrollToContact}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="cyber-btn group relative px-8 py-3 font-mono text-xs tracking-[0.1em] rounded"
          >
            <span className="relative z-10 pointer-events-none drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">[ INITIATE_CONTACT ]</span>
          </button>
        </div>
      </div>

      <style>{`
        .cyber-btn {
          border: 1px solid rgba(0, 240, 255, 0.4);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.2), inset 0 0 5px rgba(0, 240, 255, 0.1);
          color: var(--neural-cyan);
          transition: background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s;
        }
        .cyber-btn:hover {
          background-color: rgba(0, 240, 255, 0.1);
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.2);
          border-color: rgba(0, 240, 255, 0.8);
        }

        .title-glitch {
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .group:hover .title-glitch {
          animation: hero-glitch 0.3s ease-in-out infinite;
        }

        /* Initial load glitch */
        .title-glitch {
          animation: hero-glitch 0.4s ease-in-out 1.2s 1, pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes hero-glitch {
          0% { text-shadow: none; transform: translate(0); }
          20% { text-shadow: -3px 0 #ff003c, 3px 0 #00f0ff; transform: translate(-2px, 2px); }
          40% { text-shadow: 3px 0 #ff003c, -3px 0 #00f0ff; transform: translate(2px, -2px); }
          60% { text-shadow: none; transform: translate(0); }
          80% { text-shadow: 3px 0 #ff003c, -3px 0 #00f0ff; transform: translate(-2px, -2px); }
          100% { text-shadow: none; transform: translate(0); }
        }
        @keyframes eq-bounce {
          0% { transform: scaleY(0.1); }
          100% { transform: scaleY(1); }
        }
      `}</style>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--ghost-gray)]">
          SCROLL TO INITIALIZE
        </span>
        <ChevronDown className="h-4 w-4 text-[var(--ghost-gray)] animate-bounce" />
      </div>
    </section>
  );
}
