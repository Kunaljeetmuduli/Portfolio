import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Cpu, BookOpen, Code2, Zap, Download, X, Terminal } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ScrambleText = ({ text, isVisible, delay = 0 }: { text: string; isVisible: boolean; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setDisplayText('');
      return;
    }

    let iteration = 0;
    let interval: ReturnType<typeof setInterval>;

    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === ' ') return ' ';
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join('');
        });

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 2; // Controls reveal speed
      }, 15);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, isVisible, delay]);

  return <span>{displayText}</span>;
};

const TERMINAL_LINES = [
  { label: 'NAME', value: 'KUNALJEET_MUDULI', color: 'cyan' as const },
  { label: 'STATUS', value: 'AVAILABLE_FOR_HIRE', color: 'green' as const },
  { label: 'FIELD', value: 'SOFTWARE_ENGINEERING / ML', color: 'cyan' as const },
  { label: 'LOCATION', value: 'BHUBANESWAR, INDIA', color: 'violet' as const },
  { label: 'INTERESTS', value: 'DEEP_LEARNING, NLP, RL', color: 'cyan' as const },
  { label: 'CURRENT_FOCUS', value: 'MULTI_AGENT_SYSTEMS', color: 'violet' as const },
  { label: 'PHILOSOPHY', value: 'BUILD_LEARN_REPEAT', color: 'cyan' as const },
];

const STATS = [
  { icon: Code2, value: 2, suffix: '+', label: 'YEARS CODING' },
  { icon: Cpu, value: 6, suffix: '+', label: 'PROJECTS BUILT' },
  { icon: Zap, value: 200, suffix: '+', label: 'COMMITS' },
  { icon: BookOpen, value: 100, suffix: '%', label: 'LEARNING', display: '∞' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [terminalStarted, setTerminalStarted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [bioVisible, setBioVisible] = useState(false);

  // Resume Modal State
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeBootPhase, setResumeBootPhase] = useState(0);

  const openResumeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResumeModalOpen(true);
    setResumeBootPhase(0);
    document.body.style.overflow = 'hidden';

    // Animation sequence
    setTimeout(() => setResumeBootPhase(1), 1200);
  };

  const closeResumeModal = () => {
    setIsResumeModalOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      setResumeBootPhase(0);
    }, 500);
  };

  // Handle terminal lines sequence
  useEffect(() => {
    if (terminalStarted && visibleLines < TERMINAL_LINES.length) {
      const timer = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, 200); // 200ms per line
      return () => clearTimeout(timer);
    }
  }, [terminalStarted, visibleLines]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left content animation
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
            onEnter: () => setBioVisible(true),
          },
        }
      );

      // Right terminal panel animation
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
            onEnter: () => setTimeout(() => setTerminalStarted(true), 800),
          },
        }
      );

      // Stats Count-up Animation
      if (statsRef.current) {
        const statElements = statsRef.current.querySelectorAll('.stat-number');
        statElements.forEach((el, index) => {
          const target = STATS[index].value;
          gsap.fromTo(
            el,
            { innerHTML: "0" },
            {
              innerHTML: target,
              duration: 2,
              ease: "power2.out",
              snap: { innerHTML: 1 },
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
              onUpdate: function () {
                if (STATS[index].display) {
                  if (this.progress() === 1) {
                    el.innerHTML = STATS[index].display as string;
                  }
                }
              }
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative px-4 py-[120px]"
      style={{
        background: 'linear-gradient(180deg, rgba(5,5,8,0.7) 0%, rgba(5,5,8,0.85) 100%)',
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section header */}
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.15em] text-[var(--neural-cyan)]">
              [ ABOUT ]
            </span>
            <span className="h-px flex-1 bg-[var(--neural-cyan)]/20" />
          </div>
          <h2 className="font-mono text-[clamp(1.5rem,4vw,2rem)] font-normal tracking-[0.05em] text-[var(--synapse-violet)] uppercase">
            THE ARCHITECT
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-[60%_40%] lg:gap-12">
          {/* Left: Bio & Image */}
          <div ref={leftRef} className="opacity-0">
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start">
              {/* Left Column: Image & Button */}
              <div className="flex flex-col gap-6 w-full sm:w-[200px] lg:w-[240px] flex-shrink-0 mx-auto sm:mx-0">
                <div className="relative w-full aspect-square terminal-border overflow-hidden bg-black/40 group">
                  {/* Image */}
                  <img
                    src="/myavatar.jpeg"
                    alt="Biometric Scan"
                    className="w-full h-full object-cover filter contrast-125 saturate-50 opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* CSS Scanner Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--neural-cyan)] shadow-[0_0_15px_var(--neural-cyan)] animate-[scan_3s_ease-in-out_infinite]" />

                  {/* Glitch Overlay on Hover */}
                  <div className="absolute inset-0 bg-[var(--neural-cyan)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-color" />

                  {/* Data overlays */}
                  <div className="absolute top-2 left-2 font-mono text-[9px] text-[var(--neural-cyan)] tracking-widest bg-black/50 px-1">
                    [ ID: KUNAL_M ]
                  </div>
                  <div className="absolute bottom-2 right-2 font-mono text-[9px] text-green-400 tracking-widest animate-pulse bg-black/50 px-1">
                    MATCH_FOUND
                  </div>

                  {/* Cyberpunk corner brackets */}
                  <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-[var(--synapse-violet)] opacity-70" />
                  <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-[var(--synapse-violet)] opacity-70" />
                  <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[var(--synapse-violet)] opacity-70" />
                  <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[var(--synapse-violet)] opacity-70" />
                </div>

                {/* Download Resume Button */}
                <button
                  onClick={openResumeModal}
                  className="cyber-btn flex justify-center items-center gap-2 px-4 py-3 font-mono text-[10px] md:text-xs tracking-[0.1em] rounded transition-all duration-300 hover:-translate-y-1 w-full"
                >
                  <Download className="w-4 h-4" />
                  <span>[ VIEW_DOSSIER ]</span>
                </button>
              </div>

              <div className="flex flex-col w-full">
                <div className="space-y-6 font-sans text-sm leading-[1.8] text-[var(--signal-white)]/85">
                  <p>
                    <ScrambleText
                      text="I'm a software developer and machine learning engineer based in Bhubaneswar, India. My work sits at the intersection of intelligent systems and scalable software — building applications that leverage the latest advances in AI while maintaining production-grade reliability."
                      isVisible={bioVisible}
                      delay={0}
                    />
                  </p>
                  <p>
                    <ScrambleText
                      text="Currently focused on multi-agent orchestration systems and distributed training frameworks. I believe in the power of reinforcement learning and generative AI to transform how we build and interact with software."
                      isVisible={bioVisible}
                      delay={400}
                    />
                  </p>
                  <p>
                    <ScrambleText
                      text="When not training models or optimizing inference pipelines, you'll find me contributing to open-source ML tools, experimenting with new architectures, or writing about the future of autonomous systems."
                      isVisible={bioVisible}
                      delay={800}
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div ref={statsRef} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden terminal-border bg-[var(--surface)]/40 p-4 text-center transition-all duration-300 hover:border-[var(--neural-cyan)] hover:bg-[var(--neural-cyan)]/5"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at center, var(--neural-cyan) 0%, transparent 70%)', filter: 'blur(20px)', opacity: 0.15 }} />

                  <stat.icon className="relative z-10 mx-auto mb-2 h-5 w-5 text-[var(--neural-cyan)]/60 group-hover:text-[var(--neural-cyan)] transition-colors duration-300 group-hover:scale-110" />
                  <div className="relative z-10 font-mono text-xl text-[var(--neural-cyan)] flex justify-center items-center">
                    <span className="stat-number">0</span>
                    <span>{stat.suffix}</span>
                  </div>
                  <div className="relative z-10 mt-1 font-mono text-[9px] tracking-widest text-[var(--ghost-gray)] group-hover:text-[var(--signal-white)] transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Terminal panel */}
          <div ref={rightRef} className="opacity-0">
            <div
              ref={terminalRef}
              className="overflow-hidden terminal-border bg-[var(--surface)]/60"
            >
              {/* Terminal title bar */}
              <div className="flex items-center gap-2 border-b border-[var(--neural-cyan)]/10 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-3 font-mono text-[10px] tracking-widest text-[var(--ghost-gray)]">
                  about.txt
                </span>
              </div>

              {/* Terminal content */}
              <div className="space-y-3 p-5 min-h-[280px]">
                {/* Fake command execution */}
                <div className="mb-4">
                  <span className="font-mono text-xs text-green-400">guest@neural-net:~$ </span>
                  {terminalStarted && (
                    <TypeAnimation
                      sequence={[
                        'cat about.txt',
                      ]}
                      wrapper="span"
                      speed={50}
                      cursor={false}
                      className="font-mono text-xs text-[var(--signal-white)]"
                    />
                  )}
                </div>

                {/* Executed output */}
                <div className="space-y-3 border-l-2 border-[var(--neural-cyan)]/20 pl-3">
                  {TERMINAL_LINES.map((line, idx) => (
                    <div
                      key={idx}
                      className={`transition-all duration-200 ${idx < visibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 hidden'}`}
                    >
                      <span className="font-mono text-xs text-[var(--ghost-gray)]">
                        {`>`}
                      </span>
                      <span
                        className={`ml-2 font-mono text-xs tracking-wide ${line.color === 'cyan'
                          ? 'text-[var(--neural-cyan)]'
                          : line.color === 'green'
                            ? 'text-green-400'
                            : 'text-[var(--synapse-violet)]'
                          }`}
                      >
                        {line.label}: {line.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Blinking cursor at end */}
                <div className="pt-2 mt-4">
                  <span className="font-mono text-xs text-[var(--neural-cyan)] animate-blink">
                    {terminalStarted && visibleLines >= TERMINAL_LINES.length ? 'guest@neural-net:~$ _' : '_'}
                  </span>
                </div>
              </div>

              {/* Decorative: location indicator */}
              <div className="flex items-center gap-2 border-t border-[var(--neural-cyan)]/10 px-5 py-3">
                <MapPin className="h-3 w-3 text-[var(--synapse-violet)]" />
                <span className="font-mono text-[10px] tracking-wider text-[var(--ghost-gray)]">
                  20.2961° N, 85.8245° E
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Resume Modal */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isResumeModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeResumeModal}
        />

        {/* Modal Container */}
        <div
          className={`relative w-full max-w-5xl h-[85dvh] flex flex-col border border-[var(--neural-cyan)] bg-[var(--surface)] p-1 shadow-[0_0_50px_rgba(0,240,255,0.15)] transition-all duration-500 ${isResumeModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
            }`}
        >
          {/* Close Button */}
          <button
            onClick={closeResumeModal}
            className="absolute top-4 right-4 z-20 text-[var(--ghost-gray)] hover:text-[var(--neural-cyan)] transition-colors bg-black/50 rounded-sm p-1"
          >
            <X className="h-6 w-6" />
          </button>

          {resumeBootPhase === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center font-mono text-sm text-[var(--neural-cyan)]">
              <Terminal className="mb-4 h-8 w-8 animate-pulse" />
              <p>REQUESTING_SECURITY_CLEARANCE...</p>
              <div className="mt-4 h-1 w-48 overflow-hidden bg-[var(--neural-cyan)]/20">
                <div className="h-full w-1/3 animate-[scan_1s_ease-in-out_infinite] bg-[var(--neural-cyan)]" />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--neural-cyan)]/30 px-6 py-4 bg-black/40">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-widest text-green-400 animate-pulse hidden sm:inline">
                    [ CLEARANCE_GRANTED ]
                  </span>
                  <span className="font-mono text-xl tracking-widest text-[var(--signal-white)] glow-cyan">
                    DOSSIER.PDF
                  </span>
                </div>
                <a
                  href="/My_Resume Main.pdf"
                  download="Kunaljeet_Resume.pdf"
                  className="cyber-btn flex items-center justify-center gap-2 px-4 py-2 font-mono text-[10px] sm:text-xs"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">DOWNLOAD_PDF</span>
                  <span className="sm:hidden">DOWNLOAD</span>
                </a>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 w-full bg-[#323639] relative">
                <iframe
                  src="/My_Resume Main.pdf"
                  className="w-full h-full border-0 absolute inset-0"
                  title="Resume"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
