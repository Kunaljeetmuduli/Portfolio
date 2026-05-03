import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative px-4 py-10"
      style={{
        borderTop: '1px solid rgba(0, 240, 255, 0.2)',
        backgroundColor: 'rgba(5, 5, 8, 0.95)',
      }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-mono text-xs tracking-wider text-[var(--ghost-gray)]">
          &copy; 2025 KUNALJEET MUDULI
        </span>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-[var(--ghost-gray)]">
            DESIGNED & BUILT WITH
          </span>
          <Heart className="h-3 w-3 text-[var(--synapse-violet)] animate-pulse" />
        </div>

        <span className="font-mono text-[10px] tracking-wider text-[var(--ghost-gray)]/60">
          REACT + TAILWIND + GSAP
        </span>
      </div>
    </footer>
  );
}
