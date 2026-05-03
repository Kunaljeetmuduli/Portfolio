import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'WORK', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [displayTexts, setDisplayTexts] = useState(NAV_LINKS.map(l => l.label));
  const glitchIntervals = useRef<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [isVisible]);

  const triggerGlitch = useCallback((index: number) => {
    const original = NAV_LINKS[index].label;
    let iteration = 0;

    // Clear any existing interval for this index
    if (glitchIntervals.current[index]) {
      clearInterval(glitchIntervals.current[index]);
    }

    const interval = window.setInterval(() => {
      setDisplayTexts(prev => {
        const next = [...prev];
        next[index] = original
          .split('')
          .map((_char, charIndex) => {
            if (charIndex < iteration) return original[charIndex];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('');
        return next;
      });

      iteration += 1 / 2;

      if (iteration >= original.length) {
        clearInterval(interval);
        setDisplayTexts(prev => {
          const next = [...prev];
          next[index] = original;
          return next;
        });
      }
    }, 30);

    glitchIntervals.current[index] = interval;
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    triggerGlitch(index);
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    if (glitchIntervals.current[index]) {
      clearInterval(glitchIntervals.current[index]);
    }
    setDisplayTexts(prev => {
      const next = [...prev];
      next[index] = NAV_LINKS[index].label;
      return next;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] opacity-0 -translate-y-[100px]"
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(5, 5, 8, 0.7)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
        }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-mono text-sm tracking-[0.1em] text-[var(--neural-cyan)] hover:text-white transition-colors duration-300"
          >
            K.MUDULI
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className={`font-mono text-xs tracking-[0.1em] transition-all duration-200 ${
                  hoveredIndex === index
                    ? 'text-[var(--neural-cyan)]'
                    : 'text-[var(--neural-cyan)]/70 hover:text-[var(--neural-cyan)]'
                }`}
              >
                {displayTexts[index]}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[var(--neural-cyan)]"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-8 md:hidden"
          style={{
            backgroundColor: 'rgba(5, 5, 8, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="font-mono text-2xl tracking-[0.1em] text-[var(--neural-cyan)] hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
