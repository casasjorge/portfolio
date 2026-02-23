import Link from 'next/link';
import { uiButtonStyles } from '@/lib/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-[var(--nav-height)] text-center">
      {/* Decorative orbit ring */}
      <div className="relative mb-10">
        <div className="w-40 h-40 rounded-full border border-cyan-500/20 flex items-center justify-center">
          <span className="text-6xl font-display font-bold text-cyan-400">404</span>
        </div>
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-3 font-display">
        Lost in Space
      </h1>
      <p className="text-gray-400 max-w-md mb-8">
        The page you&apos;re looking for has drifted beyond the observable boundary.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className={uiButtonStyles.primaryMd}
        >
          Return Home
        </Link>
        <Link
          href="/projects"
          className={uiButtonStyles.outlineMd}
        >
          Browse Projects
        </Link>
      </div>
    </div>
  );
}
