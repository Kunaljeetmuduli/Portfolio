import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail, Send, CheckCircle, Loader2, Activity, Shield, Instagram } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const SOCIAL_LINKS = [
  { name: 'GITHUB', icon: Github, href: 'https://github.com/kunaljeetmuduli', handle: '@kunaljeetmuduli' },
  { name: 'LINKEDIN', icon: Linkedin, href: 'https://www.linkedin.com/in/kunaljeet-muduli-02392821b/', handle: 'Kunaljeet Muduli' },
  { name: 'X', icon: XLogo, href: 'https://x.com/spyboy9030', handle: '@kunaljeetmuduli' },
  { name: 'INSTAGRAM', icon: Instagram, href: 'https://www.instagram.com/kunaljeet__/', handle: '@kunaljeetmuduli' },
  { name: 'GMAIL', icon: Mail, href: 'mailto:2004kunaljeet@gmail.com', handle: '2004kunaljeet@gmail.com' },
];

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * canvas.height;
    }

    let animationFrameId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)'; // neural cyan, dim
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0" />;
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'imploding' | 'success'>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [keystrokeLog, setKeystrokeLog] = useState<string[]>(Array(6).fill('0x000000'));

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const hex = '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
    setKeystrokeLog(prev => [hex, ...prev.slice(0, 5)]);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formWrapperRef.current || status !== 'idle') return;
    const rect = formWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -3;
    const tiltY = ((x - centerX) / centerX) * 3;

    gsap.to(formWrapperRef.current, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!formWrapperRef.current) return;
    gsap.to(formWrapperRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('encrypting');
    setLoadingProgress(0);

    // Snap tilt back to 0
    if (formWrapperRef.current) {
      gsap.to(formWrapperRef.current, { rotateX: 0, rotateY: 0, duration: 0.5 });
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 90) {
        progress = 90;
      }
      setLoadingProgress(progress);
    }, 250);

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
    )
      .then(() => {
        clearInterval(interval);
        setLoadingProgress(100);

        setTimeout(() => {
          setStatus('imploding');

          // Implosion animation
          if (formWrapperRef.current) {
            gsap.to(formWrapperRef.current, {
              scaleY: 0.01,
              opacity: 0.5,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => {
                setStatus('success');
                gsap.to(formWrapperRef.current, {
                  scaleY: 1,
                  opacity: 1,
                  duration: 0.4,
                  ease: "back.out(1.5)"
                });
              }
            });
          }

          setTimeout(() => {
            setStatus('idle');
            setFormData({ name: '', email: '', message: '' });
          }, 4000);
        }, 500);
      })
      .catch((error) => {
        console.error('FAILED...', error);
        clearInterval(interval);
        setStatus('idle');
        alert("Transmission Failed. Please check your connection or EmailJS configuration.");
      });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative px-4 py-[120px] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(5,5,8,0.7) 0%, rgba(5,5,8,0.95) 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none animate-[scanDown_10s_linear_infinite]"
        style={{
          backgroundImage: 'linear-gradient(var(--neural-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neural-cyan) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(1000px) rotateX(60deg) scale(2)',
          transformOrigin: 'top center'
        }}
      />

      <div className="relative z-10 mx-auto max-w-[900px]">
        <div ref={contentRef} className="opacity-0">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[var(--neural-cyan)]/20" />
              <span className="font-mono text-xs tracking-[0.15em] text-[var(--neural-cyan)]">
                [ COMMUNICATION_LINK ]
              </span>
              <span className="h-px w-12 bg-[var(--neural-cyan)]/20" />
            </div>
            <h2 className="font-mono text-[clamp(1.5rem,4vw,2rem)] font-normal tracking-[0.05em] text-[var(--synapse-violet)] uppercase">
              ESTABLISH CONNECTION
            </h2>
          </div>

          <div style={{ perspective: '1000px' }}>
            <div
              ref={formWrapperRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative overflow-hidden terminal-border bg-black/80 shadow-[0_0_30px_rgba(0,240,255,0.05)] transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(0,240,255,0.1)]"
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
            >
              {status !== 'success' && <MatrixBackground />}

              <div className="relative z-10 flex items-center gap-2 border-b border-[var(--neural-cyan)]/20 px-5 py-3 bg-[var(--surface)]/80 backdrop-blur-sm">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70 animate-pulse" />
                <span className="ml-3 font-mono text-[10px] tracking-widest text-[var(--ghost-gray)]">
                  terminal_uplink.exe
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <Activity className="h-3 w-3 text-[var(--neural-cyan)] animate-pulse" />
                  <span className="font-mono text-[8px] text-[var(--neural-cyan)]">SYS_ONLINE</span>
                </div>
              </div>

              {status === 'success' ? (
                <div className="relative z-10 flex flex-col items-center justify-center py-24 px-5 bg-[var(--surface)]/90 backdrop-blur-md h-full min-h-[400px]">
                  <CheckCircle className="mb-6 h-16 w-16 text-green-400 animate-[pulse_2s_infinite]" />
                  <h3 className="font-mono text-2xl md:text-3xl tracking-widest text-green-400 mb-2 glow-cyan">
                    [ TRANSMISSION_SECURED ]
                  </h3>
                  <div className="w-full max-w-[400px] mt-6 border border-green-400/30 bg-green-400/5 p-4 text-center">
                    <p className="font-mono text-xs tracking-wider text-[var(--signal-white)] mb-2">
                      &gt; DATA PACKET DELIVERED
                    </p>
                    <p className="font-mono text-[10px] text-[var(--ghost-gray)]">
                      AWAITING_ARCHITECT_RESPONSE...
                    </p>
                  </div>
                </div>
              ) : status === 'encrypting' || status === 'imploding' ? (
                <div className="relative z-10 flex flex-col items-center justify-center py-24 px-5 bg-[var(--surface)]/90 backdrop-blur-sm min-h-[400px]">
                  <Loader2 className="mb-4 h-10 w-10 text-[var(--synapse-violet)] animate-spin" />
                  <p className="mb-6 font-mono text-sm tracking-widest text-[var(--signal-white)] animate-pulse">
                    ENCRYPTING_PAYLOAD...
                  </p>
                  <div className="w-full max-w-[300px] bg-black h-2 border border-[var(--neural-cyan)]/50 relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[var(--neural-cyan)] transition-all duration-200 shadow-[0_0_10px_var(--neural-cyan)]"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <div className="mt-4 flex justify-between w-full max-w-[300px] font-mono text-[10px] text-[var(--neural-cyan)]">
                    <span>SYS.UPLINK.ENC</span>
                    <span>{loadingProgress}%</span>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_250px] min-h-[400px]">

                  {/* Form Container */}
                  <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 bg-[var(--surface)]/60 backdrop-blur-sm border-r border-[var(--neural-cyan)]/10">
                    <div>
                      <label className="mb-2 block font-mono text-[10px] tracking-[0.15em] text-[var(--neural-cyan)]/60">
                        NAME_
                      </label>
                      <div className="relative group">
                        {!formData.name && focusedField !== 'name' && (
                          <div className="absolute left-0 top-2 pointer-events-none font-mono text-sm text-[var(--signal-white)] opacity-40">
                            <TypeAnimation sequence={['ENTER_IDENTIFIER...', 2000, 'AWAITING_INPUT...', 2000]} repeat={Infinity} speed={50} cursor={false} />
                          </div>
                        )}
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="relative z-10 w-full border-0 border-b bg-transparent py-2 font-mono text-sm text-[var(--signal-white)] outline-none transition-colors duration-300 focus:border-transparent"
                          style={{
                            borderBottomWidth: '1px',
                            borderBottomColor: focusedField === 'name' ? 'transparent' : 'rgba(0, 240, 255, 0.2)',
                          }}
                        />
                        {focusedField === 'name' && (
                          <>
                            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-[var(--neural-cyan)]" />
                            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-[var(--neural-cyan)]" />
                            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[var(--neural-cyan)]" />
                            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[var(--neural-cyan)]" />
                            <div className="absolute inset-0 bg-[var(--neural-cyan)]/5 pointer-events-none animate-pulse" />
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block font-mono text-[10px] tracking-[0.15em] text-[var(--neural-cyan)]/60">
                        EMAIL_
                      </label>
                      <div className="relative group">
                        {!formData.email && focusedField !== 'email' && (
                          <div className="absolute left-0 top-2 pointer-events-none font-mono text-sm text-[var(--signal-white)] opacity-40">
                            <TypeAnimation sequence={['ENTER_COMMS_LINK...', 2000, 'AWAITING_INPUT...', 2000]} repeat={Infinity} speed={50} cursor={false} />
                          </div>
                        )}
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="relative z-10 w-full border-0 border-b bg-transparent py-2 font-mono text-sm text-[var(--signal-white)] outline-none transition-colors duration-300 focus:border-transparent"
                          style={{
                            borderBottomWidth: '1px',
                            borderBottomColor: focusedField === 'email' ? 'transparent' : 'rgba(0, 240, 255, 0.2)',
                          }}
                        />
                        {focusedField === 'email' && (
                          <>
                            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-[var(--neural-cyan)]" />
                            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-[var(--neural-cyan)]" />
                            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[var(--neural-cyan)]" />
                            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[var(--neural-cyan)]" />
                            <div className="absolute inset-0 bg-[var(--neural-cyan)]/5 pointer-events-none animate-pulse" />
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block font-mono text-[10px] tracking-[0.15em] text-[var(--neural-cyan)]/60">
                        MESSAGE_
                      </label>
                      <div className="relative group">
                        {!formData.message && focusedField !== 'message' && (
                          <div className="absolute left-0 top-2 pointer-events-none font-mono text-sm text-[var(--signal-white)] opacity-40">
                            <TypeAnimation sequence={['ENTER_ENCRYPTED_PAYLOAD...', 2000, 'AWAITING_INPUT...', 2000]} repeat={Infinity} speed={50} cursor={false} />
                          </div>
                        )}
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          className="relative z-10 w-full resize-none border-0 border-b bg-transparent py-2 font-mono text-sm text-[var(--signal-white)] outline-none transition-colors duration-300 focus:border-transparent"
                          style={{
                            borderBottomWidth: '1px',
                            borderBottomColor: focusedField === 'message' ? 'transparent' : 'rgba(0, 240, 255, 0.2)',
                          }}
                        />
                        {focusedField === 'message' && (
                          <>
                            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-[var(--neural-cyan)]" />
                            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-[var(--neural-cyan)]" />
                            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[var(--neural-cyan)]" />
                            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[var(--neural-cyan)]" />
                            <div className="absolute inset-0 bg-[var(--neural-cyan)]/5 pointer-events-none animate-pulse" />
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="group relative flex w-full items-center justify-center gap-3 border border-[var(--neural-cyan)]/30 py-4 font-mono text-xs tracking-[0.1em] text-[var(--neural-cyan)] transition-all duration-300 hover:border-transparent hover:bg-[var(--neural-cyan)]/10 overflow-hidden"
                    >
                      <div className="absolute inset-0 border border-[var(--neural-cyan)] opacity-0 group-hover:opacity-100 group-hover:animate-[rgb-glitch-svg_0.2s_ease-in-out_infinite]" />
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--neural-cyan)] -translate-x-full group-hover:animate-[scanRight_1s_linear_infinite]" />
                      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-[var(--neural-cyan)] translate-x-full group-hover:animate-[scanLeft_1s_linear_infinite]" />

                      <Send className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="relative z-10 group-hover:animate-pulse">INITIATE_TRANSMISSION</span>
                    </button>
                  </form>

                  {/* Keystroke Interceptor Widget (Right Column) */}
                  <div className="hidden md:flex flex-col bg-black/60 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-[var(--synapse-violet)]/30 pb-3 mb-4">
                      <Shield className="h-4 w-4 text-[var(--synapse-violet)] animate-pulse" />
                      <span className="font-mono text-[10px] tracking-widest text-[var(--synapse-violet)]">
                        UPLINK_STATUS
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="font-mono text-[9px] text-[var(--ghost-gray)] mb-3">
                        &gt; INTERCEPTING_KEYSTROKES...
                      </p>
                      <div className="space-y-2 font-mono text-[10px]">
                        {keystrokeLog.map((hex, i) => (
                          <div
                            key={i}
                            className={`flex justify-between items-center transition-all duration-300 ${i === 0 ? 'text-[var(--neural-cyan)] opacity-100 scale-105' : 'text-[var(--ghost-gray)] opacity-50'}`}
                          >
                            <span>[HASH_{i}]</span>
                            <span>{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[var(--ghost-gray)]/20">
                      <div className="flex items-center justify-between text-[8px] font-mono text-[var(--ghost-gray)]">
                        <span>SECURE_TUNNEL:</span>
                        <span className="text-green-400">ESTABLISHED</span>
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-mono text-[var(--ghost-gray)] mt-1">
                        <span>ENCRYPTION:</span>
                        <span>AES-256</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 terminal-border bg-[var(--surface)]/30 p-4 text-center transition-all duration-300 hover:border-[var(--neural-cyan)]/50 hover:bg-[var(--neural-cyan)]/5"
              >
                <link.icon className="h-5 w-5 text-[var(--ghost-gray)] transition-colors duration-300 group-hover:text-[var(--neural-cyan)] group-hover:animate-[rgb-glitch-svg_0.3s_ease-in-out_infinite]" />
                <span className="font-mono text-[10px] tracking-wider text-[var(--ghost-gray)] transition-colors duration-300 group-hover:text-[var(--neural-cyan)] group-hover:animate-[rgb-glitch_0.3s_ease-in-out_infinite]">
                  [ {link.name} ]
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanDown {
          0% { background-position: 0 0; }
          100% { background-position: 0 50px; }
        }
        @keyframes scanRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scanLeft {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes rgb-glitch {
          0% { text-shadow: none; transform: translate(0); }
          20% { text-shadow: -1px 0 red, 1px 0 blue; transform: translate(-1px, 1px); }
          40% { text-shadow: 1px 0 red, -1px 0 blue; transform: translate(1px, -1px); }
          60% { text-shadow: none; transform: translate(0); }
          80% { text-shadow: 1px 0 red, -1px 0 blue; transform: translate(-1px, -1px); }
          100% { text-shadow: none; transform: translate(0); }
        }
        @keyframes rgb-glitch-svg {
          0% { filter: none; transform: translate(0); }
          20% { filter: drop-shadow(-1px 0 red) drop-shadow(1px 0 blue); transform: translate(-1px, 1px); }
          40% { filter: drop-shadow(1px 0 red) drop-shadow(-1px 0 blue); transform: translate(1px, -1px); }
          60% { filter: none; transform: translate(0); }
          80% { filter: drop-shadow(1px 0 red) drop-shadow(-1px 0 blue); transform: translate(-1px, -1px); }
          100% { filter: none; transform: translate(0); }
        }
      `}</style>
    </section>
  );
}
