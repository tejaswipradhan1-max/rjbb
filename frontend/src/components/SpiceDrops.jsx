import { useMemo } from "react";

// Hand-drawn raw spice SVGs (transparent, sized to ~20-30px, premium aesthetic)
const Chili = ({ s = 1 }) => (
  <svg width={28 * s} height={28 * s} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="chiliG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#E53935" />
        <stop offset="0.6" stopColor="#B71C1C" />
        <stop offset="1" stopColor="#7F0000" />
      </linearGradient>
    </defs>
    <path d="M8 6 Q14 4 18 8 Q26 14 30 24 Q33 32 28 36 Q24 38 22 34 Q20 28 16 22 Q10 14 8 6 Z" fill="url(#chiliG)" />
    <path d="M8 6 Q12 4 14 6 Q12 8 10 8 Q8 7 8 6 Z" fill="#3E2723" />
    <path d="M16 14 Q20 18 22 26" stroke="#FFCDD2" strokeWidth="0.5" fill="none" opacity="0.4" />
  </svg>
);

const Turmeric = ({ s = 1 }) => (
  <svg width={26 * s} height={26 * s} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="turmG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#FFB300" />
        <stop offset="0.6" stopColor="#E65100" />
        <stop offset="1" stopColor="#BF360C" />
      </linearGradient>
    </defs>
    <path d="M12 14 Q8 10 12 6 Q18 4 22 8 Q28 6 32 12 Q34 18 30 22 Q34 28 28 32 Q22 34 18 30 Q12 32 8 26 Q6 20 12 14 Z" fill="url(#turmG)" />
    <path d="M14 12 Q18 10 22 14" stroke="#5D2C00" strokeWidth="0.6" fill="none" opacity="0.5" />
    <path d="M16 22 Q22 20 26 24" stroke="#5D2C00" strokeWidth="0.6" fill="none" opacity="0.5" />
  </svg>
);

const Cumin = ({ s = 1 }) => (
  <svg width={20 * s} height={20 * s} viewBox="0 0 30 30" fill="none">
    <defs>
      <linearGradient id="cumG" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#8D6E63" />
        <stop offset="0.5" stopColor="#5D4037" />
        <stop offset="1" stopColor="#3E2723" />
      </linearGradient>
    </defs>
    <path d="M5 15 Q10 8 18 10 Q25 12 26 16 Q22 20 14 19 Q8 18 5 15 Z" fill="url(#cumG)" />
    <path d="M8 15 Q14 13 22 15" stroke="#FFE0B2" strokeWidth="0.4" fill="none" opacity="0.5" />
  </svg>
);

const Coriander = ({ s = 1 }) => (
  <svg width={18 * s} height={18 * s} viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id="corG" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#D7CCC8" />
        <stop offset="0.5" stopColor="#A1887F" />
        <stop offset="1" stopColor="#5D4037" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="9" fill="url(#corG)" />
    <path d="M12 4 L12 20 M4 12 L20 12 M6 6 L18 18 M6 18 L18 6" stroke="#3E2723" strokeWidth="0.4" opacity="0.5" />
  </svg>
);

const Cardamom = ({ s = 1 }) => (
  <svg width={20 * s} height={20 * s} viewBox="0 0 24 30" fill="none">
    <defs>
      <linearGradient id="cardG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#AED581" />
        <stop offset="0.6" stopColor="#558B2F" />
        <stop offset="1" stopColor="#33691E" />
      </linearGradient>
    </defs>
    <path d="M12 2 Q18 4 18 14 Q18 22 12 28 Q6 22 6 14 Q6 4 12 2 Z" fill="url(#cardG)" />
    <path d="M12 6 L12 24" stroke="#1B5E20" strokeWidth="0.5" opacity="0.5" />
    <path d="M9 10 Q12 8 15 10 M9 16 Q12 14 15 16" stroke="#1B5E20" strokeWidth="0.4" fill="none" opacity="0.5" />
  </svg>
);

const Pepper = ({ s = 1 }) => (
  <svg width={16 * s} height={16 * s} viewBox="0 0 20 20" fill="none">
    <defs>
      <radialGradient id="pepG" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#5D4037" />
        <stop offset="0.5" stopColor="#3E2723" />
        <stop offset="1" stopColor="#1B0A05" />
      </radialGradient>
    </defs>
    <circle cx="10" cy="10" r="7.5" fill="url(#pepG)" />
    <path d="M5 8 Q10 6 15 9 M4 12 Q10 10 16 13 M6 14 Q10 13 14 15" stroke="#000" strokeWidth="0.4" fill="none" opacity="0.6" />
  </svg>
);

const StarAnise = ({ s = 1 }) => (
  <svg width={26 * s} height={26 * s} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="anG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#A1887F" />
        <stop offset="1" stopColor="#3E2723" />
      </linearGradient>
    </defs>
    <g transform="translate(20 20)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(r => (
        <ellipse key={r} cx="0" cy="-10" rx="3" ry="7" fill="url(#anG)" transform={`rotate(${r})`} />
      ))}
      <circle cx="0" cy="0" r="3" fill="#3E2723" />
    </g>
  </svg>
);

// Dalchini (cinnamon stick) — rolled bark
const Cinnamon = ({ s = 1 }) => (
  <svg width={32 * s} height={14 * s} viewBox="0 0 44 18" fill="none">
    <defs>
      <linearGradient id="cinG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#8D6E63" />
        <stop offset="0.5" stopColor="#5D4037" />
        <stop offset="1" stopColor="#3E2723" />
      </linearGradient>
    </defs>
    <rect x="2" y="4" width="40" height="10" rx="3" fill="url(#cinG)" />
    <ellipse cx="42" cy="9" rx="2" ry="5" fill="#3E2723" />
    <ellipse cx="42" cy="9" rx="1.2" ry="3.5" fill="#1B0A05" />
    <ellipse cx="2" cy="9" rx="2" ry="5" fill="#3E2723" />
    <ellipse cx="2" cy="9" rx="1.2" ry="3.5" fill="#1B0A05" />
    <path d="M6 6 Q22 5 38 6 M6 12 Q22 13 38 12" stroke="#1B0A05" strokeWidth="0.4" opacity="0.5" />
  </svg>
);

// Laung (cloves) — nail-shaped bud
const Clove = ({ s = 1 }) => (
  <svg width={14 * s} height={22 * s} viewBox="0 0 16 26" fill="none">
    <defs>
      <linearGradient id="clvG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#8D6E63" />
        <stop offset="1" stopColor="#3E2723" />
      </linearGradient>
    </defs>
    <ellipse cx="8" cy="5" rx="4" ry="4.5" fill="url(#clvG)" />
    <path d="M8 9 L7 24 L9 24 Z" fill="#3E2723" />
    <path d="M5 4 L11 4 M6 2 Q8 0 10 2" stroke="#1B0A05" strokeWidth="0.5" fill="none" opacity="0.6" />
  </svg>
);

// Tej Patta (bay leaf)
const BayLeaf = ({ s = 1 }) => (
  <svg width={30 * s} height={18 * s} viewBox="0 0 40 24" fill="none">
    <defs>
      <linearGradient id="bayG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#7CB342" />
        <stop offset="0.5" stopColor="#558B2F" />
        <stop offset="1" stopColor="#33691E" />
      </linearGradient>
    </defs>
    <path d="M2 12 Q10 2 22 4 Q36 6 38 12 Q36 18 22 20 Q10 22 2 12 Z" fill="url(#bayG)" />
    <path d="M4 12 Q20 11 36 12" stroke="#1B5E20" strokeWidth="0.6" fill="none" opacity="0.6" />
    <path d="M10 8 Q14 11 18 8 M10 16 Q14 13 18 16 M22 8 Q26 11 30 8 M22 16 Q26 13 30 16" stroke="#1B5E20" strokeWidth="0.4" fill="none" opacity="0.4" />
  </svg>
);

// Sarson / Rai (mustard seed) — tiny ochre sphere
const Mustard = ({ s = 1 }) => (
  <svg width={10 * s} height={10 * s} viewBox="0 0 12 12" fill="none">
    <defs>
      <radialGradient id="musG" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFCA28" />
        <stop offset="0.7" stopColor="#F57F17" />
        <stop offset="1" stopColor="#BF360C" />
      </radialGradient>
    </defs>
    <circle cx="6" cy="6" r="4.5" fill="url(#musG)" />
    <circle cx="4.5" cy="4.5" r="1" fill="#FFF59D" opacity="0.5" />
  </svg>
);

// Methi (fenugreek) — small angular yellow seed
const Fenugreek = ({ s = 1 }) => (
  <svg width={14 * s} height={12 * s} viewBox="0 0 16 14" fill="none">
    <defs>
      <linearGradient id="fenG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#FFD54F" />
        <stop offset="1" stopColor="#E65100" />
      </linearGradient>
    </defs>
    <path d="M2 7 L8 2 L14 7 L8 12 Z" fill="url(#fenG)" />
    <path d="M5 7 L11 7" stroke="#5D2C00" strokeWidth="0.4" opacity="0.6" />
  </svg>
);

// Saunf (fennel seeds) — slim green-yellow seeds
const Fennel = ({ s = 1 }) => (
  <svg width={18 * s} height={10 * s} viewBox="0 0 22 12" fill="none">
    <defs>
      <linearGradient id="fnG" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#C5E1A5" />
        <stop offset="0.5" stopColor="#9CCC65" />
        <stop offset="1" stopColor="#558B2F" />
      </linearGradient>
    </defs>
    <path d="M3 6 Q11 1 19 6 Q11 11 3 6 Z" fill="url(#fnG)" />
    <path d="M5 6 Q11 5 17 6" stroke="#33691E" strokeWidth="0.4" opacity="0.6" />
  </svg>
);

// Kashmiri Red Chili — long slim
const KashmiriChili = ({ s = 1 }) => (
  <svg width={14 * s} height={36 * s} viewBox="0 0 18 44" fill="none">
    <defs>
      <linearGradient id="kashG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#3E2723" />
        <stop offset="0.15" stopColor="#C62828" />
        <stop offset="0.6" stopColor="#8B0000" />
        <stop offset="1" stopColor="#560000" />
      </linearGradient>
    </defs>
    <path d="M9 4 Q13 8 12 18 Q11 30 9 40 Q7 30 6 18 Q5 8 9 4 Z" fill="url(#kashG)" />
    <path d="M7 3 Q9 1 11 3 Q10 5 9 5 Q8 5 7 3 Z" fill="#1B5E20" />
  </svg>
);

// Jaiphal (nutmeg) — round brown nut
const Nutmeg = ({ s = 1 }) => (
  <svg width={22 * s} height={26 * s} viewBox="0 0 26 30" fill="none">
    <defs>
      <radialGradient id="nutG" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#A1887F" />
        <stop offset="0.6" stopColor="#5D4037" />
        <stop offset="1" stopColor="#3E2723" />
      </radialGradient>
    </defs>
    <ellipse cx="13" cy="15" rx="10" ry="13" fill="url(#nutG)" />
    <path d="M5 12 Q13 10 21 13 M4 18 Q13 16 22 19 M6 22 Q13 21 20 23" stroke="#1B0A05" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);

// Ajwain (carom seed) — tiny oval
const Ajwain = ({ s = 1 }) => (
  <svg width={10 * s} height={14 * s} viewBox="0 0 12 16" fill="none">
    <defs>
      <linearGradient id="ajG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#A1887F" />
        <stop offset="1" stopColor="#5D4037" />
      </linearGradient>
    </defs>
    <ellipse cx="6" cy="8" rx="3.5" ry="6" fill="url(#ajG)" />
    <path d="M6 3 L6 13" stroke="#3E2723" strokeWidth="0.4" opacity="0.6" />
  </svg>
);

// Saffron (kesar) — thin red strands
const Saffron = ({ s = 1 }) => (
  <svg width={20 * s} height={18 * s} viewBox="0 0 24 22" fill="none">
    <defs>
      <linearGradient id="safG" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#FF5722" />
        <stop offset="0.5" stopColor="#BF360C" />
        <stop offset="1" stopColor="#7F1D00" />
      </linearGradient>
    </defs>
    <path d="M2 12 Q8 6 12 8 Q14 4 22 6" stroke="url(#safG)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M3 16 Q10 14 18 18" stroke="url(#safG)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85" />
  </svg>
);

const SPICES = [Chili, Turmeric, Cumin, Coriander, Cardamom, Pepper, StarAnise, Cinnamon, Clove, BayLeaf, Mustard, Fenugreek, Fennel, KashmiriChili, Nutmeg, Ajwain, Saffron];

export default function SpiceDrops({ count = 22, className = "" }) {
  const drops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        Cmp: SPICES[Math.floor(Math.random() * SPICES.length)],
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 9 + Math.random() * 10,
        scale: 0.55 + Math.random() * 0.95,
        rotateStart: Math.random() * 360,
        rotateEnd: Math.random() * 720 - 360,
        drift: (Math.random() - 0.5) * 80,
        opacity: 0.35 + Math.random() * 0.45,
      });
    }
    return arr;
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <style>{`
        @keyframes spice-drop {
          0%   { transform: translate3d(0, -10vh, 0) rotate(var(--r0)); opacity: 0; }
          8%   { opacity: var(--op); }
          85%  { opacity: var(--op); }
          100% { transform: translate3d(var(--dx), 110vh, 0) rotate(var(--r1)); opacity: 0; }
        }
      `}</style>
      {drops.map(d => {
        const Cmp = d.Cmp;
        return (
          <div
            key={d.id}
            style={{
              position: "absolute",
              top: 0,
              left: `${d.left}%`,
              animation: `spice-drop ${d.duration}s linear ${d.delay}s infinite`,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.45))",
              willChange: "transform, opacity",
              ["--r0"]: `${d.rotateStart}deg`,
              ["--r1"]: `${d.rotateStart + d.rotateEnd}deg`,
              ["--dx"]: `${d.drift}px`,
              ["--op"]: d.opacity,
            }}
          >
            <Cmp s={d.scale} />
          </div>
        );
      })}
    </div>
  );
}
