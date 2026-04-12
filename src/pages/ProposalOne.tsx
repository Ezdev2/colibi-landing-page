import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, Heart, MapPin } from "lucide-react";
import {
  TopNav,
  CountryRail,
  ListingsSection,
  Footer,
  useHeroSearch,
  ProposalSideRail,
  MascotWidget,
  WhyIASection,
} from "../shared/components";
import { quickFilters } from "../shared/data";
import { buildPath } from "../shared/utils";
import { useNavigate } from "react-router-dom";

export default function ProposalOnePage() {
  const {
    activeMarket,
    mode,
    setMode,
    form,
    setForm,
    changeCountry,
    submitSearch,
  } = useHeroSearch("/");
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-[#1f2933]">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative isolate overflow-hidden min-h-screen">
        {/* Background dynamique */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMarket.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeMarket.image}
              alt={activeMarket.title}
              className="hero-zoom absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* Overlay centré doux */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/55 to-white/25" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_28%,rgba(255,255,255,0.65),transparent)]" />
          </motion.div>
        </AnimatePresence>

        <TopNav countryId={activeMarket.id} currentProposal="one" />

        <div className="absolute left-2 top-24 z-30 hidden h-[calc(100%-9rem)] items-center lg:flex">
          <CountryRail activeId={activeMarket.id} onChange={changeCountry} />
        </div>

        {/* Contenu centré */}
        <section className="relative z-20 flex min-h-[calc(100vh-126px)] flex-col items-center justify-center px-6 pb-16 pt-4">
          <div className="w-full max-w-3xl text-center">
            {/* Headline */}
            <motion.h1
              key={activeMarket.id + "-h1"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-black leading-[1.05] tracking-[-0.01em] text-[#1a2535] sm:text-6xl"
            >
              Trouvez le bien idéal
              <br />
              <span className="text-[#3B5998]">en quelques secondes</span>
            </motion.h1>

            <motion.p
              key={activeMarket.id + "-sub"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base text-[#617182] sm:text-lg"
            >
              Avec recherche classique ou IA intelligente ·{" "}
              {activeMarket.country}
            </motion.p>

            {/* Search tabs — scrollable horizontalement sur mobile */}
            <div className="mt-8">
              <div className="mb-1 flex overflow-x-auto scrollbar-hide sm:inline-flex sm:overflow-visible rounded-full border border-white/60 bg-white/70 p-1 shadow-[0_8px_24px_rgba(20,28,40,0.08)] backdrop-blur-xl">
                {[
                  {
                    id: "classic" as const,
                    label: "Recherche classique",
                    icon: Search,
                  },
                  {
                    id: "ai" as const,
                    label: "Recherche avec IA",
                    icon: Sparkles,
                  },
                  {
                    id: "offmarket" as const,
                    label: "Je cherche off-market",
                    icon: Heart,
                  },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id)}
                    className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[0.70rem] font-semibold uppercase tracking-[0.14em] transition sm:px-5 ${
                      mode === id
                        ? "bg-[#3B5998] text-white shadow-[0_6px_18px_rgba(59,89,152,0.3)]"
                        : "text-[#344150] hover:bg-white/80"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {/* Label caché sur très petit écran, visible à partir de sm */}
                    <span className="hidden xs:inline sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search input box — pleine largeur sur mobile */}
            <motion.div
              layout
              className="mx-auto mt-5 w-full max-w-2xl rounded-[20px] border border-white/75 bg-white/80 p-3 sm:p-4 shadow-[0_16px_40px_rgba(20,28,40,0.10)] backdrop-blur-xl"
            >
              {mode === "ai" ? (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#3B5998]/10 text-[#3B5998] sm:h-10 sm:w-10 sm:rounded-[12px]">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={form.aiPrompt}
                      onChange={(e) =>
                        setForm((c) => ({ ...c, aiPrompt: e.target.value }))
                      }
                      className="w-full resize-none bg-transparent text-sm font-medium leading-6 text-[#283340] outline-none placeholder:text-[#9aa5b0] sm:text-base sm:leading-7"
                      placeholder="Décrivez votre bien idéal..."
                      rows={2}
                    />
                    <p className="mt-1 text-[0.65rem] text-[#9aa5b0] sm:text-[0.68rem]">
                      Ex: maison avec jardin à {activeMarket.city}, 3 chambres,
                      budget 400k
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#3B5998] text-white shadow-[0_6px_16px_rgba(59,89,152,0.28)] transition hover:brightness-105 sm:h-10 sm:w-10 sm:rounded-[12px]"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              ) : mode === "offmarket" ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#3B5998]/10 text-[#3B5998] sm:h-10 sm:w-10 sm:rounded-[12px]">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    value={form.offmarketArea}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, offmarketArea: e.target.value }))
                    }
                    className="flex-1 min-w-0 bg-transparent text-sm font-medium text-[#283340] outline-none placeholder:text-[#9aa5b0] sm:text-base"
                    placeholder={`Secteur premium à ${activeMarket.city}...`}
                  />
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#3B5998] text-white shadow-[0_6px_16px_rgba(59,89,152,0.28)] transition hover:brightness-105 sm:h-10 sm:w-10 sm:rounded-[12px]"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#3B5998]/10 text-[#3B5998] sm:h-10 sm:w-10 sm:rounded-[12px]">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, location: e.target.value }))
                    }
                    className="flex-1 min-w-0 bg-transparent text-sm font-medium text-[#283340] outline-none placeholder:text-[#9aa5b0] sm:text-base"
                    placeholder={`Quartier, commune, zone à ${activeMarket.city}...`}
                  />
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#3B5998] text-white shadow-[0_6px_16px_rgba(59,89,152,0.28)] transition hover:brightness-105 sm:h-10 sm:w-10 sm:rounded-[12px]"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Quick filters — scrollable sur mobile */}
            <div className="mt-4 flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-hide sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
              {[
                { label: "Appartement à votre proximité", key: "appartement" },
                { label: "Maison avec piscine", key: "piscine" },
                { label: "Villa avec terrasse", key: "villa" },
              ].map(({ label, key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => submitSearch({ filter: key })}
                  className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-[0.70rem] font-semibold uppercase tracking-[0.13em] text-[#3d4e5c] shadow-[0_4px_12px_rgba(20,28,40,0.06)] backdrop-blur-sm transition hover:border-[#3B5998]/40 hover:text-[#3B5998]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── LISTINGS SECTION ─────────────────────────────────────── */}
      <ListingsSection
        activeMarket={activeMarket}
        onNavigate={(p) => navigate(p)}
      />

      <WhyIASection />

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <Footer market={activeMarket} />

      <ProposalSideRail countryId={activeMarket.id} current="one" />
      <MascotWidget />
    </main>
  );
}
