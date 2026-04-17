import { useEffect, useState, useRef } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  Calendar,
  Heart,
  Home,
  Infinity as InfinityIcon,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  ShoppingCart,
  Mail,
  User,
  Send,
  X,
  Globe,
  TrendingUp,
  Zap,
  ArrowRight,
  Maximize,
  BellRing,
  List,
} from "lucide-react";

import type { Market, ProposalKey, SearchFormState, SearchMode } from "./types";
import { markets, quickFilters, searchModes } from "./data";
import { buildPath, createFormState, getMarket } from "./utils";
import { listings } from "./data";

// ---------------------------------------------------------------------------
// ProposalSwitcher
// ---------------------------------------------------------------------------
export function ProposalSwitcher({
  countryId,
  current,
}: {
  countryId: string;
  current: ProposalKey | null;
}) {
  const items = [
    { id: "one" as const, label: "Proposition 1", path: "/" },
    { id: "two" as const, label: "Proposition 2", path: "/proposal-2" },
    { id: "three" as const, label: "Proposition 3", path: "/proposal-3" },
  ];
  return (
    <div className="inline-flex rounded-full border border-white/60 bg-white/55 p-1 shadow-[0_10px_30px_rgba(20,28,40,0.08)] backdrop-blur-xl">
      {items.map((item) => (
        <Link
          key={item.id}
          to={buildPath(item.path, { country: countryId })}
          className={`rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition ${
            current === item.id
              ? "bg-[#3B5998] text-white shadow-[0_8px_20px_rgba(30,86,255,0.28)]"
              : "text-[#33404d] hover:bg-white/70"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProposalSideRail — switcher vertical fixé à droite
// ---------------------------------------------------------------------------
export function ProposalSideRail({
  countryId,
  current,
}: {
  countryId: string;
  current: ProposalKey | null;
}) {
  const items = [
    { id: "one" as const, label: "Proposition 1", path: "/" },
    { id: "two" as const, label: "Proposition 2", path: "/proposal-2" },
    { id: "three" as const, label: "Proposition 3", path: "/proposal-3" },
  ];

  return (
    <div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
      <div className="flex flex-col overflow-hidden rounded-l-[14px] border border-r-0 border-white/60 bg-white/80 shadow-[0_12px_32px_rgba(20,28,40,0.12)] backdrop-blur-xl">
        {items.map((item, i) => (
          <Link
            key={item.id}
            to={buildPath(item.path, { country: countryId })}
            className={`group relative flex items-center justify-center px-3 py-4 transition ${
              i < items.length - 1 ? "border-b border-white/50" : ""
            } ${
              current === item.id
                ? "bg-[#3B5998] text-white"
                : "text-[#55616f] hover:bg-[#3B5998]/08 hover:text-[#3B5998]"
            }`}
          >
            {/* Vertical label */}
            <span
              className="block text-[0.60rem] font-semibold uppercase tracking-[0.20em]"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {item.label}
            </span>

            {/* Dot indicator */}
            {current === item.id && (
              <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white" />
            )}

            {/* Tooltip on hover */}
            <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-[8px] border border-white/60 bg-white/90 px-3 py-1.5 text-[0.68rem] font-semibold text-[#2e3a45] opacity-0 shadow-[0_8px_20px_rgba(20,28,40,0.10)] backdrop-blur-md transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TopNav
// ---------------------------------------------------------------------------

const navMenus = [
  {
    label: "Immo",
    items: ["Maisons", "Appartements", "Villas", "Terrains", "Penthouse"],
  },
  {
    label: "Local",
    items: ["Paris", "Côte d'Azur", "Bordeaux", "Lyon", "Internationale"],
  },
  {
    label: "Art-home",
    items: ["Architecture", "Décoration", "Design d'intérieur", "Tendances"],
  },
  {
    label: "Travaux",
    items: ["Rénovation", "Construction neuve", "Aménagement", "Artisans"],
  },
];

function DropdownMenu({
  label,
  items,
  countryId,
}: {
  label: string;
  items: string[];
  countryId: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#55616f] transition hover:text-[#3B5998]"
      >
        {label}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-[16px] border border-white/70 bg-white/90 py-2 shadow-[0_16px_40px_rgba(20,28,40,0.12)] backdrop-blur-xl">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setOpen(false);
                const el = document.getElementById("listings");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="block w-full px-4 py-2 text-left text-[0.70rem] font-semibold uppercase tracking-[0.14em] text-[#3d4e5c] transition hover:bg-[#3B5998]/8 hover:text-[#3B5998]"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function TopNav({
  countryId,
  currentProposal,
}: {
  countryId: string;
  currentProposal: ProposalKey | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-40">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-6 py-5 lg:px-16">
        {/* ── LEFT: logo + nav desktop ── */}
        <div className="flex items-center gap-8">
          <Link to={buildPath("/", { country: countryId })}>
            <img src="/images/Logo_blanc.png" alt="Logo" className="w-16" />
          </Link>
        </div>
        {/* Nav desktop uniquement */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#55616f] transition hover:text-[#3B5998]"
            to={buildPath("/", { country: countryId })}
          >
            Accueil
          </Link>
          {navMenus.map((menu) => (
            <DropdownMenu
              key={menu.label}
              label={menu.label}
              items={menu.items}
              countryId={countryId}
            />
          ))}
        </nav>

        {/* ── RIGHT: icônes desktop + hamburger mobile ── */}
        <div className="flex items-center gap-2">
          {/* Icônes — desktop seulement */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#55616f] shadow-[0_4px_12px_rgba(20,28,40,0.06)] backdrop-blur-md transition hover:text-[#3B5998]"
            >
              <Search className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#55616f] shadow-[0_4px_12px_rgba(20,28,40,0.06)] backdrop-blur-md transition hover:text-[#e05555]"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#55616f] shadow-[0_4px_12px_rgba(20,28,40,0.06)] backdrop-blur-md transition hover:text-[#3B5998]"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#3B5998] text-[0.55rem] font-bold text-white">
                3
              </span>
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#55616f] shadow-[0_4px_12px_rgba(20,28,40,0.06)] backdrop-blur-md transition hover:text-[#3B5998]"
            >
              <Mail className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#3B5998]/40 bg-[#3B5998]/10 text-[#3B5998] transition hover:border-[#3B5998]"
            >
              <img
                src="/images/user.jpeg"
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
            <span className="mx-1 h-5 w-px bg-[#c8d0da]" />
          </div>

          {/* Hamburger — mobile seulement */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#55616f] shadow-[0_4px_12px_rgba(20,28,40,0.06)] backdrop-blur-md transition hover:text-[#3B5998] lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Menu mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full z-50 mx-4 mb-2 overflow-hidden rounded-[20px] border border-white/70 bg-white/95 shadow-[0_20px_48px_rgba(20,28,40,0.14)] backdrop-blur-xl lg:hidden"
          >
            {/* Liens principaux */}
            <div className="px-5 pt-5 pb-3">
              <Link
                to={buildPath("/", { country: countryId })}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#2e3a45] transition hover:text-[#3B5998]"
              >
                Accueil
              </Link>
              {navMenus.map((menu) => (
                <div key={menu.label}>
                  <p className="py-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#2e3a45]">
                    {menu.label}
                  </p>
                  <div className="mb-2 flex flex-wrap gap-2 pl-2">
                    {menu.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          document
                            .getElementById("listings")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="rounded-full border border-[#d6dce6] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#55616f] transition hover:border-[#3B5998] hover:text-[#3B5998]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Séparateur */}
            <div className="mx-5 border-t border-[#e8edf2]" />

            {/* Icônes utilisateur en bas du drawer */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6dce6] text-[#55616f] hover:text-[#e05555]"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#d6dce6] text-[#55616f] hover:text-[#3B5998]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#3B5998] text-[0.55rem] font-bold text-white">
                    3
                  </span>
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6dce6] text-[#55616f] hover:text-[#3B5998]"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
              <Link
                to="/search"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-[#3B5998] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white"
              >
                <Search className="h-3.5 w-3.5" />
                Rechercher
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---------------------------------------------------------------------------
// CountryRail
// ---------------------------------------------------------------------------
const countryMeta: Record<string, { flag: string; short: string }> = {
  france: { flag: "🇫🇷", short: "FR" },
  luxembourg: { flag: "🇱🇺", short: "LU" },
  belgium: { flag: "🇧🇪", short: "BE" },
};

export function CountryRail({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {markets.map((market) => {
        const meta = countryMeta[market.id] ?? {
          flag: "🌍",
          short: market.id.toUpperCase(),
        };
        const isActive = activeId === market.id;

        return (
          <button
            key={market.id}
            type="button"
            onClick={() => onChange(market.id)}
            className={`group relative flex items-center gap-2.5 rounded-[14px] border px-3 py-2.5 text-left transition-all duration-200 ${
              isActive
                ? "border-[#3B5998] bg-[#3B5998] text-white shadow-[0_8px_20px_rgba(59,89,152,0.30)]"
                : "border-white/60 bg-white/65 text-[#3d4e5c] shadow-[0_4px_12px_rgba(20,28,40,0.08)] backdrop-blur-md hover:border-[#3B5998]/50 hover:bg-white/85 hover:text-[#3B5998]"
            }`}
          >
            {/* Flag */}
            <span className="text-base leading-none">{meta.flag}</span>

            {/* Label — visible quand actif, sinon juste le code */}
            <span
              className={`text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
                isActive
                  ? "max-w-[80px] opacity-100"
                  : "max-w-0 overflow-hidden opacity-0 group-hover:max-w-[80px] group-hover:opacity-100"
              }`}
            >
              {market.country}
            </span>

            {/* Code court toujours visible quand inactif */}
            {!isActive && (
              <span className="text-[0.64rem] font-bold tracking-widest group-hover:hidden">
                {meta.short}
              </span>
            )}

            {/* Dot actif */}
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchModeTabs
// ---------------------------------------------------------------------------
export function SearchModeTabs({
  active,
  onChange,
}: {
  active: SearchMode;
  onChange: (mode: SearchMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {searchModes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.73rem] font-semibold uppercase tracking-[0.16em] transition ${
              active === mode.id
                ? "border-[#3B5998] bg-[#3B5998] text-white shadow-[0_12px_24px_rgba(30,86,255,0.24)]"
                : "border-white/70 bg-white/42 text-[#344150] hover:border-[#3B5998]/35 hover:bg-white/70"
            }`}
          >
            <Icon className="h-4 w-4" />
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FieldShell
// ---------------------------------------------------------------------------
export function FieldShell({
  icon,
  label,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`flex min-h-[80px] flex-col justify-between rounded-[24px] border border-white/70 bg-white/58 p-4 shadow-[0_10px_25px_rgba(20,28,40,0.05)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#667382]">
        <span className="text-[#3B5998]">{icon}</span>
        {label}
      </div>
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// SearchPanel
// ---------------------------------------------------------------------------
export function SearchPanel({
  mode, form, setForm, onSearch, onInterest, compact = false,
}: {
  mode: SearchMode;
  form: SearchFormState;
  setForm: React.Dispatch<React.SetStateAction<SearchFormState>>;
  onSearch: () => void;
  onInterest: () => void;
  compact?: boolean;
}) {
  const content = searchModes.find((item) => item.id === mode) ?? searchModes[0];

  return (
    <div className={`glass-card rounded-[30px] ${compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}`}>
      {/* Header */}
      {/* <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#677484]">
            {content.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#526170] line-clamp-2 sm:line-clamp-none">
            {content.description}
          </p>
        </div>
        <div className="flex-shrink-0 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/62 text-[#3B5998]">
          <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div> */}

      {/* Mode classic */}
      {mode === "classic" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FieldShell icon={<Home className="h-4 w-4" />} label="Type de bien">
            <select
              value={form.propertyType}
              onChange={(e) => setForm((c) => ({ ...c, propertyType: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
            >
              <option>Maison</option>
              <option>Appartement</option>
              <option>Penthouse</option>
              <option>Terrain</option>
              <option>Villa</option>
            </select>
          </FieldShell>

          <FieldShell icon={<MapPin className="h-4 w-4" />} label="Adresse">
            <input
              value={form.location}
              onChange={(e) => setForm((c) => ({ ...c, location: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none placeholder:text-[#7a8795]"
              placeholder="Quartier, commune, zone"
            />
          </FieldShell>

          <FieldShell icon={<Landmark className="h-4 w-4" />} label="Budget">
            <select
              value={form.budget}
              onChange={(e) => setForm((c) => ({ ...c, budget: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
            >
              <option>1 M€ – 3 M€</option>
              <option>3 M€ – 8 M€</option>
              <option>8 M€ – 15 M€</option>
              <option>15 M€ +</option>
            </select>
          </FieldShell>

          <FieldShell icon={<Building2 className="h-4 w-4" />} label="Surface">
            <select
              value={form.surface}
              onChange={(e) => setForm((c) => ({ ...c, surface: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
            >
              <option>150 m² +</option>
              <option>250 m² +</option>
              <option>400 m² +</option>
              <option>800 m² +</option>
            </select>
          </FieldShell>
        </div>
      )}

      {/* Mode AI */}
      {mode === "ai" && (
        <div className="">
          <FieldShell
            icon={<Sparkles className="h-4 w-4" />}
            label="Prompt IA"
            className="min-h-[160px]"
          >
            <textarea
              value={form.aiPrompt}
              onChange={(e) => setForm((c) => ({ ...c, aiPrompt: e.target.value }))}
              className="mt-3 min-h-[80px] w-full resize-none bg-transparent text-sm font-medium leading-7 text-[#283340] outline-none placeholder:text-[#7a8795]"
              placeholder="Décrivez le bien idéal : volume, lumière, style architectural..."
            />
          </FieldShell>
        </div>
      )}

      {/* Mode offmarket */}
      {mode === "offmarket" && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <FieldShell icon={<Home className="h-4 w-4" />} label="Typologie visée">
            <select
              value={form.offmarketType}
              onChange={(e) => setForm((c) => ({ ...c, offmarketType: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
            >
              <option>Maison</option>
              <option>Appartement</option>
              <option>Penthouse</option>
              <option>Immeuble</option>
              <option>Terrain</option>
            </select>
          </FieldShell>

          <FieldShell icon={<MapPin className="h-4 w-4" />} label="Zone confidentielle">
            <input
              value={form.offmarketArea}
              onChange={(e) => setForm((c) => ({ ...c, offmarketArea: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none placeholder:text-[#7a8795]"
              placeholder="Secteur premium ciblé"
            />
          </FieldShell>

          <FieldShell icon={<ShieldCheck className="h-4 w-4" />} label="Enveloppe">
            <select
              value={form.offmarketBudget}
              onChange={(e) => setForm((c) => ({ ...c, offmarketBudget: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
            >
              <option>Confidentiel</option>
              <option>5 M€ +</option>
              <option>10 M€ +</option>
              <option>20 M€ +</option>
            </select>
          </FieldShell>

          <FieldShell icon={<Calendar className="h-4 w-4" />} label="Horizon d'acquisition">
            <select
              value={form.offmarketTiming}
              onChange={(e) => setForm((c) => ({ ...c, offmarketTiming: e.target.value }))}
              className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
            >
              <option>Sous 6 mois</option>
              <option>Sous 12 mois</option>
              <option>Veille active</option>
              <option>Long terme</option>
            </select>
          </FieldShell>
        </div>
      )}

      {/* CTA buttons */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center justify-center w-full">
        <button
          type="button"
          onClick={onSearch}
          className="w-full  inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5998] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(30,86,255,0.28)] transition hover:brightness-105"
        >
          <List className="h-4 w-4" />
          Rechercher dans la liste
        </button>

        <button
          type="button"
          onClick={onInterest}
          className="w-full  inline-flex items-center justify-center gap-2 rounded-2xl border border-[#cad2de] bg-white/72 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#2e3a46] transition hover:border-[#3B5998] hover:text-[#3B5998]"
        >
          <MapPin className="h-4 w-4" />
          Recherche sur la carte
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QuickFilters
// ---------------------------------------------------------------------------
export function QuickFilters({
  activeKey,
  onSelect,
}: {
  activeKey?: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="mt-7">
      {/* <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#677484]">
        <Sparkles className="h-4 w-4 text-[#3B5998]" />
        Filtres rapides — redirection vers la page de recherche avec filtre pré-appliqué
      </div> */}
      <div className="mt-4 flex flex-wrap gap-3">
        {quickFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => onSelect(filter.key)}
            className={`rounded-full border px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition ${
              activeKey === filter.key
                ? "border-[#3B5998] bg-[#3B5998] text-white"
                : "border-white/70 bg-white/55 text-[#364452] hover:border-[#3B5998]/40 hover:text-[#3B5998]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatsBadges
// ---------------------------------------------------------------------------
export function StatsBadges({ market }: { market: Market }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {[
        { icon: <Building2 className="h-4 w-4" />, label: market.stats?.size },
        { icon: <BedDouble className="h-4 w-4" />, label: market.stats?.beds },
        {
          icon: <InfinityIcon className="h-4 w-4" />,
          label: market.stats?.pool,
        },
      ].map((item, index) => (
        <div
          key={item.label}
          className="rise-in inline-flex items-center gap-2.5 rounded-full border border-white/65 bg-white/38 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#2f3b47] backdrop-blur-xl"
          style={{ animationDelay: `${index * 0.12 + 0.16}s` }}
        >
          <span className="text-[#3B5998]">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MarketStoryCard
// ---------------------------------------------------------------------------
export function MarketStoryCard({ market }: { market: Market }) {
  return (
    <motion.aside
      key={market.id}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-card h-full rounded-[34px] p-5 lg:p-6"
    >
      <div className="overflow-hidden rounded-[28px]">
        <img
          src={market.image}
          alt={market.title}
          className="h-56 w-full object-cover object-center"
        />
      </div>

      <div className="">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#677484]">
          {market.country} — Plus populaire
        </p>
        <h3 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-[#25303a]">
          {market.subtitle}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#526170]">Appartement meublé avec marbre clair, salon traversant et finitions de galerie résidentielle.</p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-[22px] border border-white/70 bg-white/62 p-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#677484]">
            Surface
          </p>
          <p className="mt-2 text-sm font-semibold text-[#26323d]">
            {market.stats?.size}
          </p>
        </div>
        <div className="rounded-[22px] border border-white/70 bg-white/62 p-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#677484]">
            Suites
          </p>
          <p className="mt-2 text-sm font-semibold text-[#26323d]">
            {market.stats?.beds}
          </p>
        </div>
        <div className="rounded-[22px] border border-white/70 bg-white/62 p-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#677484]">
            Atout
          </p>
          <p className="mt-2 text-sm font-semibold text-[#26323d]">
            {market.stats?.pool}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const el = document.getElementById("listings");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#3B5998] transition hover:gap-3"
      >
        En savoir plus
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </motion.aside>
  );
}

// ---------------------------------------------------------------------------
// ListingsSection — section de listings partagée entre tous les proposals
// ---------------------------------------------------------------------------
export function ListingsSection({
  activeMarket,
}: {
  activeMarket: Market;
  onNavigate: (path: string) => void;
}) {
  const displayedListings = listings.filter(
    (l) => l.country === activeMarket.id,
  );
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section
      id="listing"
      className="bg-white/80 backdrop-blur-sm border-[#d7d1c7]"
    >
      <div className="mx-auto max-w-[1500px] px-6 py-14 lg:px-16">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#677484]">
              {activeMarket.country}
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[0.07em] text-[#22303a]">
              Derniers biens disponibles
            </h2>
          </div>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {["Tous", "Maison", "Appartement", "Villa", "Bungallow", "Autre"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  document
                    .getElementById("listings")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d6dce6] bg-white px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#3d4e5c] transition hover:border-[#3B5998] hover:text-[#3B5998]"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {displayedListings.map((listing, index) => (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="overflow-hidden rounded-[16px] border border-[#d9e0e8] bg-white shadow-[0_16px_36px_rgba(25,33,46,0.07)] transition hover:shadow-[0_20px_44px_rgba(25,33,46,0.12)] hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={getMarket(listing.country).image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  style={{ objectPosition: listing.focus }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* Badge */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {listing.offmarket ? (
                    <span className="rounded-full bg-[#3B5998]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Off-market
                    </span>
                  ) : index === 0 ? (
                    <span className="rounded-full bg-[#e85d30]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Nouveau
                    </span>
                  ) : index === 1 ? (
                    <span className="rounded-full bg-[#2da05b]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Bonne affaire
                    </span>
                  ) : index === 2 ? (
                    <span className="rounded-full bg-[#e8a020]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Très consulté
                    </span>
                  ) : null}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-[0.63rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                    {listing.district}
                  </p>
                  <h3 className="mt-1 text-lg font-black uppercase leading-tight tracking-[0.06em] text-white">
                    {listing.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-lg font-black tracking-tight text-[#22303a]">
                    {listing.price}
                  </p>
                  <button
                    type="button"
                    className="rounded-full border border-[#d6dce4] p-1.5 text-[#8a97a4] transition hover:border-[#3B5998] hover:text-[#3B5998]"
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.68rem] text-[#667484]">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {listing.surface}
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3 w-3" />
                    {listing.suites}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.district}
                  </span>
                </div>

                <p className="mt-2 text-[0.68rem] text-[#8a97a4]">
                  Publié il y à {index + 1} jour{index > 0 ? "s" : ""}
                  {index === 2 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[#e8a020]">
                      · Très consulté
                    </span>
                  )}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-full bg-[#3B5998] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(59,89,152,0.32)] transition hover:brightness-105"
          >
            Voir tous les biens
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function MostViewSection({
  activeMarket,
}: {
  activeMarket: Market;
  onNavigate: (path: string) => void;
}) {
  const displayedListings = listings.filter(
    (l) => l.country === activeMarket.id,
  );
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section
      id="listing"
      className="bg-white/80 backdrop-blur-sm border-[#d7d1c7]"
    >
      <div className="mx-auto max-w-[1500px] px-6 py-14 lg:px-16">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#677484]">
              {activeMarket.country}
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[0.07em] text-[#22303a]">
              Plus populaires
            </h2>
          </div>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {["Tous", "Maison", "Appartement", "Villa", "Bungallow", "Autre"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  document
                    .getElementById("listings")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d6dce6] bg-white px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#3d4e5c] transition hover:border-[#3B5998] hover:text-[#3B5998]"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {displayedListings.map((listing, index) => (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="overflow-hidden rounded-[16px] border border-[#d9e0e8] bg-white shadow-[0_16px_36px_rgba(25,33,46,0.07)] transition hover:shadow-[0_20px_44px_rgba(25,33,46,0.12)] hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={getMarket(listing.country).image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  style={{ objectPosition: listing.focus }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* Badge */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {listing.offmarket ? (
                    <span className="rounded-full bg-[#3B5998]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Off-market
                    </span>
                  ) : index === 0 ? (
                    <span className="rounded-full bg-[#e85d30]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Nouveau
                    </span>
                  ) : index === 1 ? (
                    <span className="rounded-full bg-[#2da05b]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Bonne affaire
                    </span>
                  ) : index === 2 ? (
                    <span className="rounded-full bg-[#e8a020]/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Très consulté
                    </span>
                  ) : null}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-[0.63rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                    {listing.district}
                  </p>
                  <h3 className="mt-1 text-lg font-black uppercase leading-tight tracking-[0.06em] text-white">
                    {listing.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-lg font-black tracking-tight text-[#22303a]">
                    {listing.price}
                  </p>
                  <button
                    type="button"
                    className="rounded-full border border-[#d6dce4] p-1.5 text-[#8a97a4] transition hover:border-[#3B5998] hover:text-[#3B5998]"
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.68rem] text-[#667484]">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {listing.surface}
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3 w-3" />
                    {listing.suites}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.district}
                  </span>
                </div>

                <p className="mt-2 text-[0.68rem] text-[#8a97a4]">
                  Publié il y à {index + 1} jour{index > 0 ? "s" : ""}
                  {index === 2 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[#e8a020]">
                      · Très consulté
                    </span>
                  )}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-full bg-[#3B5998] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(59,89,152,0.32)] transition hover:brightness-105"
          >
            Voir tous les biens
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function ListingsSection3({
  activeMarket,
  onNavigate,
}: {
  activeMarket: Market;
  onNavigate: (path: string) => void | Promise<void>;
}) {
  const displayedListings = listings.filter(
    (l) => l.country === activeMarket.id,
  );
  
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section id="listing" className="bg-[#fcfcfb] py-20 border-t border-[#eee]">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-16">
        
        {/* Header avec Navigation "Pill" */}
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#3B5998]">
            {activeMarket.country}
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-[#22303a]">
            Derniers biens disponibles
          </h2>
          
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Tous", "Maison", "Appartement", "Villa", "Bungallow", "Autre"].map((cat) => (
              <button
                key={cat}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d6dce6] bg-white px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#3d4e5c] transition hover:border-[#3B5998] hover:text-[#3B5998]"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid avec style "Card sans bordures" */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {displayedListings.map((listing, index) => (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer relative"
              onClick={() => onNavigate(`/listing/${listing.id}`)} // Utilisation de onNavigate ici
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-gray-200 shadow-xl">
                <img
                  src={getMarket(listing.country).image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  style={{ objectPosition: listing.focus }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-4">
                   <span className="backdrop-blur-md bg-white/20 border border-white/30 px-3 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-widest text-white">
                     {listing.offmarket ? "Off-Market" : "Nouveauté"}
                   </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/70">
                    {listing.district}
                  </p>
                  <h3 className="mt-1 text-xl font-bold leading-tight">
                    {listing.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-lg font-black">{listing.price}</span>
                    <div className="flex gap-3 text-[0.65rem] font-semibold text-white/90">
                       <span className="flex items-center gap-1">
                         <Building2 className="h-3.5 w-3.5"/> {listing.surface}
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <button 
            type="button"
            onClick={scrollToTop}
            className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-[#3B5998] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
          >
            <span>Voir tous les biens</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WhyIASection — Pourquoi section
// ---------------------------------------------------------------------------
export function WhyIASection() {
  const features = [
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Rapide & instantané",
      desc: "Analyse en temps réel de milliers d'annonces pour des résultats immédiats.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Personnalisé",
      desc: "L'IA comprend vos priorités (style de vie, budget) pour affiner chaque suggestion.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Ultra pertinent",
      desc: "Fini le hors-sujet. Nous filtrons l'intention réelle derrière vos mots.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "100 % confidentiel",
      desc: "Données privées, sessions anonymisées et aucune revente à des tiers.",
    },
  ];

  return (
    <section className="bg-white py-24 border-t border-[#eee]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-12 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-5">
            <span className="inline-block rounded-full border border-[#3B5998]/20 bg-[#3B5998]/5 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#3B5998]">
              Intelligence Artificielle
            </span>
            <h2 className="mt-6 text-5xl font-black uppercase tracking-tight text-[#22303a] leading-[1.1]">
              Pourquoi utiliser <br /> notre IA.
            </h2>
            <p className="mt-6 text-lg text-[#667484] leading-relaxed max-w-md">
              Notre moteur IA comprend vos besoins en langage naturel. Plus de filtres complexes, juste une conversation.
            </p>
          </div>

          {/* Right Side: Bento Grid inspired Cards */}
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group p-8 rounded-[32px] border border-[#f0f0f0] bg-[#fafafa] transition-all duration-300 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] ${
                  i === 1 || i === 3 ? "sm:translate-y-6" : ""
                }`}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#eee] text-[#3B5998] group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-[0.9rem] font-bold uppercase tracking-wider text-[#22303a]">
                  {f.title}
                </h3>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-[#667484]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MascotWidget — mascotte fixée en bas à gauche
// ---------------------------------------------------------------------------
export function MascotWidget({
  message = "Bienvenu sur Colibi, en quoi puis-je vous aider ?",
}: {
  message?: string;
}) {
  const [open, setOpen] = useState(true);
  const { setMode, submitSearch } = useHeroSearch("/");

  return (
    <div className="fixed bottom-0 left-0 z-50 flex items-start">
      {/* Mascot button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group relative transition h-20 w-20 sm:h-40 sm:w-40"
        aria-label="Assistant Colibi"
      >
        {/* Glow ring when popup closed */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full" />
        )}
        <img
          src="/images/mascot.jpg"
          alt="Mascotte Colibi"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </button>
      {/* Popup bubble */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative max-w-[280px] rounded-[16px] border border-white/70 bg-white/92 px-4 py-3 shadow-[0_12px_32px_rgba(20,28,40,0.14)] backdrop-blur-xl"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-[#d0d8e2] bg-white text-[#8a97a4] shadow-sm transition hover:text-[#3B5998]"
            >
              <X className="h-3 w-3" />
            </button>

            <p className="text-[0.78rem] font-medium leading-5 text-[#2e3a45]">
              {message}
            </p>
            {/* AI CTA bubble */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-2 hidden md:block"
            >
              <button
                type="button"
                onClick={() => {
                  setMode("ai");
                  submitSearch();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#3B5998]/20 bg-white/80 px-5 py-2.5 text-[0.72rem] font-semibold text-[#3B5998] shadow-[0_8px_20px_rgba(59,89,152,0.12)] backdrop-blur-sm transition hover:bg-white"
              >
                <Sparkles className="h-4 w-4" />
                En savoir plus sur nous →
              </button>
            </motion.div>

            {/* Tail pointing down-left toward mascot */}
            {/* <span className="absolute -bottom-2 left-6 h-0 w-0 border-l-[7px] border-r-[7px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/92" /> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export function Footer({ market }: { market: Market }) {
  const [email, setEmail] = useState("");

  const columns = [
    {
      title: "À propos",
      links: ["Fonctionnalités", "Contact", "Tarifs"],
    },
    {
      title: "Support",
      links: ["Centre d'aide", "FAQ", "Conditions et confidentialité"],
    },
    {
      title: "Explorer",
      links: [
        "Appartements",
        "Investissement locatif",
        "Propriétés de luxe",
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <footer id="footer" className="bg-[#121212] text-white"> {/* Changé en #121212 pour matcher le thème Dark de Proposal 3 */}
      <div className="mx-auto max-w-[1500px] px-6 py-14 lg:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
          
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-5 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-white/90">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[0.80rem] text-white/50 transition hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Alerte Immobilière (Remplace Newsletter) */}
          <div>
            <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-white">
              Créer une alerte
            </p>
            <p className="mb-5 text-[0.78rem] text-white/50">
              Soyez le premier informé des nouveaux biens.
            </p>
            
            <div className="group flex overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1 focus-within:border-[#3B5998]/50 transition-all">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 bg-transparent px-4 py-2 text-[0.82rem] text-white placeholder:text-white/30 outline-none"
              />
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-[#3B5998] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.05em] text-white transition hover:brightness-110 active:scale-95"
              >
                <BellRing className="h-3.5 w-3.5" />
                Alerte
              </button>
            </div>

            {/* Social icons */}
            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition hover:border-[#3B5998] hover:text-[#3B5998]"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-6 py-6 text-[0.68rem] text-white/30 md:flex-row md:items-center md:justify-between lg:px-16">
          <p className="tracking-wide">
            © {new Date().getFullYear()} <span className="font-bold text-white/60">COLIBI</span> · Excellence Immobilière en {market.country}
          </p>
          <nav className="flex flex-wrap gap-6">
            <a href="#" className="transition hover:text-white">Confidentialité</a>
            <a href="#" className="transition hover:text-white">Conditions</a>
            <a href="#" className="transition hover:text-white">Cookies</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// useHeroSearch – shared hook for hero pages
// ---------------------------------------------------------------------------
export function useHeroSearch(pathname: string) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeMarket = getMarket(searchParams.get("country"));
  const [mode, setMode] = useState<SearchMode>("classic");
  const [form, setForm] = useState<SearchFormState>(() =>
    createFormState(activeMarket),
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      location: activeMarket.defaultLocation,
      offmarketArea: activeMarket.defaultLocation,
      propertyType: activeMarket.defaultType,
      offmarketType: activeMarket.defaultType,
      aiPrompt: `Je cherche une ${activeMarket.defaultType.toLowerCase()} lumineuse à ${activeMarket.city}, avec lignes architecturales fortes, matériaux nobles, piscine et grande réception.`,
    }));
  }, [
    activeMarket.defaultLocation,
    activeMarket.defaultType,
    activeMarket.city,
  ]);

  const changeCountry = (countryId: string) => {
    navigate(buildPath(pathname, { country: countryId }), { replace: true });
  };

  const submitSearch = (options?: { filter?: string; interest?: boolean }) => {
    if (options?.filter) setActiveFilter(options.filter);
    // interest : scroll vers listings ou autre action
    setTimeout(() => {
      document
        .getElementById("listings")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return {
    activeMarket,
    mode,
    setMode,
    form,
    setForm,
    changeCountry,
    submitSearch,
    activeFilter,
    setActiveFilter,
  };
}
