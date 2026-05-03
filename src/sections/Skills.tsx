import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'LANGUAGES',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'JavaScript', level: 85 },
      { name: 'C++', level: 80 },
      { name: 'SQL', level: 75 },
    ],
  },
  {
    title: 'FRAMEWORKS',
    skills: [
      { name: 'PyTorch', level: 92 },
      { name: 'React', level: 88 },
      { name: 'FastAPI', level: 85 },
      { name: 'TensorFlow', level: 78 },
    ],
  },
  {
    title: 'ML / AI',
    skills: [
      { name: 'Deep Learning', level: 90 },
      { name: 'Generative AI', level: 85 },
      { name: 'NLP', level: 82 },
      { name: 'MLOps', level: 80 },
      { name: 'Reinforcement Learning', level: 75 },
    ],
  },
  {
    title: 'TOOLS',
    skills: [
      { name: 'Git', level: 92 },
      { name: 'Linux', level: 85 },
      { name: 'Docker', level: 80 },
      { name: 'AWS / GCP', level: 78 },
      { name: 'CUDA', level: 70 },
    ],
  },
];

const RADAR_SKILLS = [
  { name: 'Python', value: 95 },
  { name: 'PyTorch', value: 92 },
  { name: 'Deep Learning', value: 90 },
  { name: 'React', value: 88 },
  { name: 'Generative AI', value: 85 },
  { name: 'NLP', value: 82 },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!radarRef.current) return;
    const { left, top, width, height } = radarRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    gsap.to(radarRef.current, {
      rotationY: x * 40,
      rotationX: -y * 40,
      ease: 'power2.out',
      duration: 0.5,
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!radarRef.current) return;
    gsap.to(radarRef.current, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power2.out',
      duration: 1,
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Radar chart animation
      gsap.fromTo(
        radarRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: radarRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Skill bars animation
      if (categoriesRef.current) {
        const bars = categoriesRef.current.querySelectorAll('.skill-bar-fill');
        const items = categoriesRef.current.querySelectorAll('.skill-item');

        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: categoriesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        bars.forEach((bar) => {
          const targetWidth = (bar as HTMLElement).dataset.level || '0';
          gsap.fromTo(
            bar,
            { width: '0%' },
            {
              width: `${targetWidth}%`,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: categoriesRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Number count-up animation
        const numbers = categoriesRef.current.querySelectorAll('.skill-number');
        numbers.forEach((num) => {
          const target = parseInt((num as HTMLElement).dataset.target || '0', 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: categoriesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              num.innerHTML = Math.round(obj.val) + "%";
            }
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Radar chart SVG
  const radarSize = 280;
  const radarCenter = radarSize / 2;
  const radarRadius = 100;
  const angleStep = (Math.PI * 2) / RADAR_SKILLS.length;

  const radarPoints = RADAR_SKILLS.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (skill.value / 100) * radarRadius;
    return {
      x: radarCenter + Math.cos(angle) * r,
      y: radarCenter + Math.sin(angle) * r,
    };
  });

  const radarPolygon = radarPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Grid lines (concentric hexagons)
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPolygons = gridLevels.map((level) => {
    return RADAR_SKILLS.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (level / 100) * radarRadius;
      return `${radarCenter + Math.cos(angle) * r},${radarCenter + Math.sin(angle) * r}`;
    }).join(' ');
  });

  // Axis lines
  const axisLines = RADAR_SKILLS.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x2: radarCenter + Math.cos(angle) * radarRadius,
      y2: radarCenter + Math.sin(angle) * radarRadius,
    };
  });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative px-4 py-[120px]"
      style={{
        background: 'linear-gradient(180deg, rgba(5,5,8,0.85) 0%, rgba(5,5,8,0.7) 100%)',
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section header */}
        <div ref={headingRef} className="mb-16 opacity-0">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.15em] text-[var(--neural-cyan)]">
              [ CAPABILITIES ]
            </span>
            <span className="h-px flex-1 bg-[var(--neural-cyan)]/20" />
          </div>
          <h2 className="font-mono text-[clamp(1.5rem,4vw,2rem)] font-normal tracking-[0.05em] text-[var(--synapse-violet)] uppercase">
            TECHNICAL ARSENAL
          </h2>
        </div>

        {/* Content grid */}
        <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
          {/* Radar chart */}
          <div 
            className="flex items-center justify-center cursor-crosshair group"
            style={{ perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div ref={radarRef} className="relative opacity-0" style={{ transformStyle: 'preserve-3d' }}>
              <svg
                width={radarSize}
                height={radarSize}
                viewBox={`0 0 ${radarSize} ${radarSize}`}
                className="overflow-visible"
              >
                {/* Grid polygons */}
                {gridPolygons.map((points, idx) => (
                  <polygon
                    key={idx}
                    points={points}
                    fill="none"
                    stroke="rgba(0, 240, 255, 0.1)"
                    strokeWidth="1"
                  />
                ))}

                {/* Axis lines */}
                {axisLines.map((line, idx) => (
                  <line
                    key={idx}
                    x1={radarCenter}
                    y1={radarCenter}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="rgba(0, 240, 255, 0.1)"
                    strokeWidth="1"
                  />
                ))}

                {/* Data polygon */}
                <polygon
                  points={radarPolygon}
                  fill="rgba(0, 240, 255, 0.1)"
                  stroke="var(--neural-cyan)"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="opacity"
                    values="0.1;0.2;0.1"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </polygon>

                {/* Data points */}
                {radarPoints.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="var(--neural-cyan)"
                  >
                    <animate
                      attributeName="r"
                      values="3;5;3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${idx * 0.3}s`}
                    />
                  </circle>
                ))}

                {/* Labels */}
                {RADAR_SKILLS.map((skill, idx) => {
                  const angle = idx * angleStep - Math.PI / 2;
                  const labelR = radarRadius + 20;
                  const x = radarCenter + Math.cos(angle) * labelR;
                  const y = radarCenter + Math.sin(angle) * labelR;
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono"
                      fill="var(--neural-cyan)"
                      fontSize="10"
                      letterSpacing="0.05em"
                    >
                      {skill.name}
                    </text>
                  );
                })}
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-mono text-[10px] tracking-widest text-[var(--ghost-gray)]">
                  SKILL_MATRIX
                </span>
              </div>
            </div>
          </div>

          {/* Skill categories with progress bars */}
          <div ref={categoriesRef} className="grid gap-8 sm:grid-cols-2">
            {SKILL_CATEGORIES.map((category) => (
              <div key={category.title} className="skill-item opacity-0">
                <h3 className="mb-4 font-mono text-sm tracking-[0.1em] text-[var(--synapse-violet)]">
                  {category.title}
                </h3>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-mono text-xs tracking-wide text-[var(--signal-white)]/80">
                          {skill.name}
                        </span>
                        <span 
                          className="skill-number font-mono text-[10px] tracking-wider text-[var(--neural-cyan)]"
                          data-target={skill.level}
                        >
                          0%
                        </span>
                      </div>
                      <div 
                        className="relative h-1.5 w-full overflow-hidden bg-[var(--surface)]/50"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 99% 100%, 1% 100%)' }}
                      >
                        <div
                          className="skill-bar-fill h-full bg-gradient-to-r from-[var(--neural-cyan)] to-[var(--synapse-violet)] relative flex justify-end"
                          data-level={skill.level}
                          style={{ width: '0%' }}
                        >
                          {/* Active Data Stream */}
                          <div 
                            className="absolute inset-0 w-full h-full opacity-30 animate-[scanRight_1.5s_linear_infinite]" 
                            style={{ 
                              background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.8) 10px, rgba(255,255,255,0.8) 20px)',
                              backgroundSize: '200% 100%' 
                            }} 
                          />
                          {/* Glowing tip */}
                          <div className="w-2 h-full bg-white blur-[2px] opacity-70" />
                        </div>
                        
                        {/* Segmented Grid Mask to create battery look */}
                        <div 
                          className="absolute inset-0 pointer-events-none" 
                          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15px, var(--surface) 15px, var(--surface) 17px)' }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanRight {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
