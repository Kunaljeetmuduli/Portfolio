import { useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Components
import BootSequence from './components/BootSequence';
import WarpVortex from './components/WarpVortex';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Sections
import Hero from './sections/Hero';
import Work from './sections/Work';
import About from './sections/About';
import Skills from './sections/Skills';
import Contact from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);

  // Check if boot was already seen this session
  useEffect(() => {
    const hasSeenBoot = sessionStorage.getItem('bootSeen');
    if (hasSeenBoot) {
      setBootComplete(true);
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('bootSeen', 'true');
    setBootComplete(true);
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!bootComplete) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [bootComplete]);

  // Refresh ScrollTrigger after boot
  useEffect(() => {
    if (bootComplete) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [bootComplete]);

  return (
    <>
      {/* Boot Sequence */}
      {!bootComplete && <BootSequence onComplete={handleBootComplete} />}

      {/* Main content - visible after boot */}
      <div
        className={`transition-opacity duration-500 ${
          bootComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Warp Vortex Background */}
        <WarpVortex />

        {/* CRT Scanline Overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[9998]"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 1px, transparent 1px, transparent 2px)',
            animation: 'scanlineFlicker 0.15s steps(1) infinite',
          }}
        />

        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main>
          <Hero />
          <Work />
          <About />
          <Skills />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
