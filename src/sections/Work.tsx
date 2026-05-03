import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, X, Terminal } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  status?: 'coming_soon';
  logs?: string[];
}

const PROJECTS: Project[] = [
  {
    number: '001',
    title: 'MeetSphere',
    category: 'Full-Stack Web',
    year: '2025',
    description: 'A real-time video conferencing platform with collaborative features, screen sharing, and intelligent meeting summaries powered by NLP.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/kunaljeetmuduli/meetsphere',
    live: 'https://meetsphere.vercel.app',
    logs: [
      'Arch: Scalable microservices deployed via container orchestration.',
      'Sec: Zero-trust architecture strictly enforced at all network edges.',
      'Perf: Sub-100ms latency achieved through edge caching.',
      'Data: Distributed NoSQL databases with active-active replication.',
      'CI/CD: Automated deployment pipelines with canary release strategy.',
      'Mon: Comprehensive observability with distributed tracing and alerting.'
    ],
  },
  {
    number: '002',
    title: 'DocBook+ | Clinical Intelligence',
    category: 'Multi-Agent Orchestration',
    year: '2026',
    description: 'AI-powered clinical documentation system using multi-agent orchestration to automate patient record analysis and diagnostic assistance.',
    tech: ['Langchain', 'Python', 'Pillow', 'CrewAI'],
    github: 'https://github.com/kunaljeetmuduli/docbook',
    live: '#',
    logs: [
      'Arch: Scalable microservices deployed via container orchestration.',
      'Sec: Zero-trust architecture strictly enforced at all network edges.',
      'Perf: Sub-100ms latency achieved through edge caching.',
      'Data: Distributed NoSQL databases with active-active replication.',
      'CI/CD: Automated deployment pipelines with canary release strategy.',
      'Mon: Comprehensive observability with distributed tracing and alerting.'
    ],
  },
  {
    number: '003',
    title: 'Distributed Training Framework',
    category: 'MLOps',
    year: '2024',
    description: 'Scalable distributed deep learning framework with automatic model parallelism and gradient synchronization across GPU clusters.',
    tech: ['PyTorch', 'NCCL', 'Docker', 'Kubernetes'],
    github: 'https://github.com',
    live: '#',
    logs: [
      'Arch: Scalable microservices deployed via container orchestration.',
      'Sec: Zero-trust architecture strictly enforced at all network edges.',
      'Perf: Sub-100ms latency achieved through edge caching.',
      'Data: Distributed NoSQL databases with active-active replication.',
      'CI/CD: Automated deployment pipelines with canary release strategy.',
      'Mon: Comprehensive observability with distributed tracing and alerting.'
    ],
  },
  {
    number: '004',
    title: 'Real-time ASR Engine',
    category: 'NLP',
    year: '2024',
    description: 'Low-latency automatic speech recognition engine optimized for streaming transcription with sub-200ms word-level latency.',
    tech: ['Whisper', 'ONNX', 'WebRTC', 'React'],
    github: 'https://github.com',
    live: '#',
    logs: [
      'Arch: Scalable microservices deployed via container orchestration.',
      'Sec: Zero-trust architecture strictly enforced at all network edges.',
      'Perf: Sub-100ms latency achieved through edge caching.',
      'Data: Distributed NoSQL databases with active-active replication.',
      'CI/CD: Automated deployment pipelines with canary release strategy.',
      'Mon: Comprehensive observability with distributed tracing and alerting.'
    ],
  },
  {
    number: '005',
    title: 'GenAI Content Pipeline',
    category: 'Generative AI',
    year: '2025',
    description: 'End-to-end generative AI pipeline for automated content creation. Development currently ongoing.',
    tech: ['Diffusers', 'ComfyUI', 'AWS Lambda', 'Python'],
    github: 'https://github.com',
    live: '#',
    status: 'coming_soon',
    logs: [
      'Arch: Scalable microservices deployed via container orchestration.',
      'Sec: Zero-trust architecture strictly enforced at all network edges.',
      'Perf: Sub-100ms latency achieved through edge caching.',
      'Data: Distributed NoSQL databases with active-active replication.',
      'CI/CD: Automated deployment pipelines with canary release strategy.',
      'Mon: Comprehensive observability with distributed tracing and alerting.'
    ],
  },
  {
    number: '006',
    title: 'RL Trading Agent',
    category: 'Reinforcement Learning',
    year: '2024',
    description: 'Deep reinforcement learning trading system with proximal policy optimization. Backtesting engine in progress.',
    tech: ['Ray', 'Gymnasium', 'Pandas', 'Plotly'],
    github: 'https://github.com',
    live: '#',
    status: 'coming_soon',
    logs: [
      'Arch: Scalable microservices deployed via container orchestration.',
      'Sec: Zero-trust architecture strictly enforced at all network edges.',
      'Perf: Sub-100ms latency achieved through edge caching.',
      'Data: Distributed NoSQL databases with active-active replication.',
      'CI/CD: Automated deployment pipelines with canary release strategy.',
      'Mon: Comprehensive observability with distributed tracing and alerting.'
    ],
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBootPhase, setModalBootPhase] = useState(0);

  // Calculate SVG Neural Grid Lines
  const calculateLines = () => {
    if (!gridRef.current) return;
    const newLines = [];
    const cards = cardRefs.current.filter(Boolean);
    
    // Connect sequential cards
    for (let i = 0; i < cards.length - 1; i++) {
      const el1 = cards[i];
      const el2 = cards[i + 1];
      if (el1 && el2) {
        newLines.push({
          x1: el1.offsetLeft + el1.offsetWidth / 2,
          y1: el1.offsetTop + el1.offsetHeight / 2,
          x2: el2.offsetLeft + el2.offsetWidth / 2,
          y2: el2.offsetTop + el2.offsetHeight / 2,
        });
      }
    }
    // Connect cards vertically if in 2-col mode (i to i+2)
    for (let i = 0; i < cards.length - 2; i++) {
      const el1 = cards[i];
      const el2 = cards[i + 2];
      if (el1 && el2) {
        newLines.push({
          x1: el1.offsetLeft + el1.offsetWidth / 2,
          y1: el1.offsetTop + el1.offsetHeight / 2,
          x2: el2.offsetLeft + el2.offsetWidth / 2,
          y2: el2.offsetTop + el2.offsetHeight / 2,
        });
      }
    }
    setLines(newLines);
  };

  useEffect(() => {
    const timer = setTimeout(calculateLines, 500);
    window.addEventListener('resize', calculateLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLines);
    };
  }, []);

  // GSAP Entry Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onEnter: () => setIsHeadingVisible(true),
          },
        }
      );

      // Cards stagger animation
      if (cardsRef.current) {
        const wrappers = cardsRef.current.querySelectorAll('.project-card-wrapper');
        gsap.to(wrappers, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          keyframes: [
            { opacity: 0, y: 60, scale: 0.95, duration: 0 },
            { opacity: 1, y: 40, scale: 0.97, duration: 0.1 },
            { opacity: 0.2, y: 40, scale: 0.97, duration: 0.1 },
            { opacity: 1, y: 20, scale: 0.98, duration: 0.1 },
            { opacity: 0.5, y: 20, scale: 0.98, duration: 0.1 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
          ],
          stagger: 0.15,
          onComplete: calculateLines // Recalculate lines after they snap into place
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt Logic
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    setHoveredCardIndex(index);

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max tilt 10 degrees
    const tiltX = ((y - centerY) / centerY) * -10;
    const tiltY = ((x - centerX) / centerX) * 10;
    
    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Update glare position
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    
    setHoveredCardIndex(null);
    
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  // Modal Logic
  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setModalBootPhase(0);
    document.body.style.overflow = 'hidden';

    setTimeout(() => setModalBootPhase(1), 800);
    setTimeout(() => setModalBootPhase(2), 1600);
  };

  const closeModal = () => {
    setModalBootPhase(3); // Start encrypting sequence
    
    setTimeout(() => {
      setModalBootPhase(4); // Terminate connection sequence
    }, 600);

    setTimeout(() => {
      setIsModalOpen(false);
      document.body.style.overflow = 'auto';
      setTimeout(() => {
        setSelectedProject(null);
        setModalBootPhase(0);
      }, 500); // Wait for exit transition
    }, 1200);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative px-4 py-[120px]"
      style={{
        background: 'linear-gradient(180deg, rgba(5,5,8,0.85) 0%, rgba(5,5,8,0.7) 100%)',
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section header */}
        <div ref={headingRef} className="mb-16 opacity-0 relative z-20">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.15em] text-[var(--neural-cyan)]">
              [ SELECTED_WORK ]
            </span>
            <span className="h-px flex-1 bg-[var(--neural-cyan)]/20" />
          </div>
          <h2 className="font-mono text-[clamp(1.5rem,4vw,2rem)] font-normal tracking-[0.05em] text-[var(--synapse-violet)] uppercase flex items-center">
            {isHeadingVisible ? (
              <TypeAnimation
                sequence={['PROJECTS', 1000]}
                wrapper="span"
                speed={50}
                cursor={false}
              />
            ) : (
              <span className="invisible">PROJECTS</span>
            )}
            <span className="animate-blink ml-1">_</span>
          </h2>
        </div>

        {/* Projects grid with Neural Grid Background */}
        <div ref={cardsRef} className="relative">
          {/* Neural grid SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" style={{ minHeight: '100%' }}>
            {lines.map((line, i) => {
              // Pulse lines connected to the hovered card
              // This is a naive but effective way to find connected lines
              const isConnected = hoveredCardIndex !== null && 
                (i === hoveredCardIndex - 1 || 
                 i === hoveredCardIndex || 
                 i === hoveredCardIndex + (cardRefs.current.length / 2) - 1 || 
                 i === hoveredCardIndex - (cardRefs.current.length / 2));
              
              return (
                <path
                  key={i}
                  d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}
                  stroke="var(--neural-cyan)"
                  strokeWidth={isConnected ? "2" : "1"}
                  strokeOpacity={isConnected ? "0.6" : "0.15"}
                  strokeDasharray={isConnected ? "none" : "4 4"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          <div ref={gridRef} className="relative z-10 grid gap-8 md:grid-cols-2">
            {PROJECTS.map((project, index) => (
              <div key={project.number} className="project-card-wrapper opacity-0 h-full" style={{ perspective: '1000px' }}>
                <div
                  ref={(el) => { cardRefs.current[index] = el; }}
                  onClick={() => project.status !== 'coming_soon' ? openProjectModal(project) : null}
                  onMouseMove={(e) => project.status !== 'coming_soon' ? handleCardMouseMove(e, index) : null}
                  onMouseLeave={() => project.status !== 'coming_soon' ? handleCardMouseLeave(index) : null}
                  className={`group relative h-full w-full overflow-hidden terminal-border bg-[var(--surface)]/80 p-8 transition-colors duration-500 ${
                    project.status === 'coming_soon'
                      ? 'opacity-60 cursor-not-allowed border-[var(--ghost-gray)]/20'
                      : 'hover:border-[var(--neural-cyan)] cursor-pointer'
                  }`}
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
                >
                  {/* Glare overlay */}
                  <div 
                    className="pointer-events-none absolute inset-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                    style={{
                      background: 'radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15), transparent 80%)'
                    }}
                  />

                  {/* Card header */}
                  <div className="mb-4 flex items-start justify-between" style={{ transform: 'translateZ(30px)' }}>
                    <div>
                      <span className="font-mono text-[10px] tracking-widest text-[var(--ghost-gray)]">
                        {project.number}
                      </span>
                      <h3 className={`mt-1 font-mono text-xl tracking-wide transition-all duration-300 ${
                        project.status === 'coming_soon'
                          ? 'text-[var(--ghost-gray)]'
                          : 'text-[var(--neural-cyan)] group-hover:glow-cyan'
                      }`}>
                        {project.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[var(--ghost-gray)]">
                      {project.year}
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="mb-4" style={{ transform: 'translateZ(20px)' }}>
                    <span className={`inline-block px-2 py-0.5 font-mono text-[10px] tracking-wider border rounded ${
                      project.status === 'coming_soon'
                        ? 'text-[var(--ghost-gray)] border-[var(--ghost-gray)]/30'
                        : 'text-[var(--synapse-violet)] border-[var(--synapse-violet)]/30'
                    }`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mb-6 font-sans text-sm leading-relaxed text-[var(--signal-white)]/80" style={{ transform: 'translateZ(10px)' }}>
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="mb-6 flex flex-wrap gap-2" style={{ transform: 'translateZ(15px)' }}>
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className={`px-2 py-1 font-mono text-[10px] tracking-wider border rounded-full ${
                          project.status === 'coming_soon'
                            ? 'text-[var(--ghost-gray)] border-[var(--ghost-gray)]/30'
                            : 'text-[var(--neural-cyan)]/80 border-[var(--neural-cyan)]/20'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--neural-cyan)]/10" style={{ transform: 'translateZ(20px)' }}>
                    <div className={`flex items-center gap-2 font-mono text-xs tracking-wider transition-colors duration-300 ${
                      project.status === 'coming_soon'
                        ? 'text-red-400/80'
                        : 'text-[var(--ghost-gray)] group-hover:text-[var(--neural-cyan)]'
                    }`}>
                      {project.status === 'coming_soon' ? (
                        <>
                          <X className="h-3.5 w-3.5" />
                          ACCESS_DENIED // COMING_SOON
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-3.5 w-3.5" />
                          VIEW_DETAILS
                        </>
                      )}
                    </div>
                  </div>

                  {project.status !== 'coming_soon' && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--neural-cyan)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-[var(--neural-cyan)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:top-2 group-hover:left-2" />
                      <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-[var(--neural-cyan)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:top-2 group-hover:right-2" />
                      <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[var(--neural-cyan)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2 group-hover:left-2" />
                      <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[var(--neural-cyan)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2 group-hover:right-2" />
                      <div className="absolute -top-[10%] left-0 w-full h-[2px] bg-[var(--neural-cyan)] shadow-[0_0_15px_var(--neural-cyan)] opacity-0 group-hover:opacity-50 group-hover:animate-[scan_2s_linear_infinite]" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holographic Modal */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-500 ${
          isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        
        {/* Modal Container */}
        <div 
          className={`relative w-full max-w-4xl border border-[var(--neural-cyan)] bg-[var(--surface)] shadow-[0_0_50px_rgba(0,240,255,0.15)] transition-all duration-500 flex flex-col ${
            isModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
          }`}
        >
          {/* Mac-style Window Header */}
          <div className="flex items-center gap-2 border-b border-[var(--neural-cyan)]/20 px-4 py-3 bg-black/40">
            <button 
              onClick={closeModal}
              className="h-3.5 w-3.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors flex items-center justify-center group cursor-pointer"
            >
              <X className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-black" />
            </button>
            <div className="h-3.5 w-3.5 rounded-full bg-yellow-500/70" />
            <div className="h-3.5 w-3.5 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-[10px] tracking-widest text-[var(--ghost-gray)]">
              project_dossier.exe
            </span>
          </div>

          <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
            {modalBootPhase === 0 && (
              <div className="flex flex-col items-center justify-center font-mono text-sm text-[var(--neural-cyan)]">
                <Terminal className="mb-4 h-8 w-8 animate-pulse" />
                <p>ESTABLISHING_SECURE_CONNECTION...</p>
                <div className="mt-4 h-1 w-48 overflow-hidden bg-[var(--neural-cyan)]/20">
                  <div className="h-full w-1/3 animate-[scan_1s_ease-in-out_infinite] bg-[var(--neural-cyan)]" />
                </div>
              </div>
            )}

            {modalBootPhase === 1 && (
              <div className="flex flex-col items-center justify-center font-mono text-sm text-[var(--synapse-violet)]">
                <p className="animate-pulse">DECRYPTING_PROJECT_DATA...</p>
                <p className="mt-2 text-xs opacity-50">ACCESS_GRANTED</p>
              </div>
            )}

            {modalBootPhase === 2 && selectedProject && (
              <div className="animate-fade-in-up">
                <div className="mb-6 border-b border-[var(--neural-cyan)]/30 pb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-mono text-xl tracking-widest text-[var(--neural-cyan)]">
                      {selectedProject.number}
                    </span>
                    <h2 className="font-mono text-2xl md:text-4xl text-[var(--signal-white)] glow-cyan">
                      {selectedProject.title}
                    </h2>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <span className="border border-[var(--synapse-violet)] px-3 py-1 font-mono text-xs text-[var(--synapse-violet)] bg-[var(--synapse-violet)]/10">
                      {selectedProject.category}
                    </span>
                    <span className="border border-[var(--signal-white)]/30 px-3 py-1 font-mono text-xs text-[var(--signal-white)]/90 bg-[var(--signal-white)]/5">
                      {selectedProject.year}
                    </span>
                  </div>
                </div>

                <div className="mb-8 font-sans text-lg md:text-xl leading-relaxed text-[var(--signal-white)]/90">
                  <p>{selectedProject.description}</p>
                  {/* Dynamic System Logs */}
                  {selectedProject.logs && selectedProject.logs.length > 0 && (
                    <div className="mt-6 p-4 border border-[var(--ghost-gray)]/50 bg-black/40 font-mono text-xs text-[var(--signal-white)]/70">
                      <p className="mb-2 text-[var(--neural-cyan)] font-bold">&gt; SYSTEM_LOGS_RETRIEVED</p>
                      <div className="space-y-1">
                        {selectedProject.logs.map((log, index) => (
                          <p key={index}>{log}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-10">
                  <h3 className="mb-4 font-mono text-sm tracking-widest text-[var(--signal-white)]/80">
                    [ TECHNOLOGY_STACK ]
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map(t => (
                      <span key={t} className="bg-[var(--neural-cyan)]/20 border border-[var(--neural-cyan)]/50 px-4 py-2 font-mono text-xs text-[var(--signal-white)] font-semibold shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="cyber-btn flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm">
                    <Github className="h-4 w-4" /> SOURCE_CODE
                  </a>
                  {selectedProject.live && (
                    <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="cyber-btn flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm">
                      <ExternalLink className="h-4 w-4" /> LIVE_DEPLOYMENT
                    </a>
                  )}
                </div>
              </div>
            )}

            {modalBootPhase === 3 && (
              <div className="flex h-full flex-col items-center justify-center font-mono text-sm text-[var(--synapse-violet)]">
                <p className="animate-pulse">ENCRYPTING_PROJECT_DATA...</p>
                <p className="mt-2 text-xs opacity-50">SECURING_PACKETS</p>
              </div>
            )}

            {modalBootPhase === 4 && (
              <div className="flex h-full flex-col items-center justify-center font-mono text-sm text-red-400">
                <Terminal className="mb-4 h-8 w-8 animate-pulse" />
                <p>TERMINATING_CONNECTION...</p>
                <p className="mt-2 text-xs opacity-50">CONNECTION_SEVERED</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: -10%; left: -10%; }
          100% { top: 110%; left: 110%; }
        }
      `}</style>
    </section>
  );
}
