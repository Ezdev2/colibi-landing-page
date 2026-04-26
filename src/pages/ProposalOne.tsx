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
  FieldShell,
  MostViewSection,
} from "../shared/components";
import { useNavigate } from "react-router-dom";

import {
  Building2,
  Calendar,
  Home,
  Infinity as InfinityIcon,
  Landmark,
  ShieldCheck,
  List,
} from "lucide-react";

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

  const handleMapSearch = () => {
    submitSearch();
  };

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
            <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/50 to-white/25" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_28%,rgba(255,255,255,0.65),transparent)]" />
          </motion.div>
        </AnimatePresence>

        <TopNav countryId={activeMarket.id} currentProposal="one" />

        {/* <div className="absolute left-2 top-24 z-30 hidden h-[calc(100%-9rem)] items-center lg:flex">
          <CountryRail activeId={activeMarket.id} onChange={changeCountry} />
        </div> */}

        {/* Contenu centré */}
        <section className="relative z-20 flex min-h-[calc(100vh-126px)] flex-col items-center justify-center px-6 pb-16 pt-4">
          <div className="w-full max-w-3xl text-center relative">
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
              Votre bien idéal avec l'IA ou la recherche classique · Opérant sur
              toute la France et la Belgique
              {/* {activeMarket.country} */}
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
                    className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[0.70rem] font-semibold uppercase tracking-[0.14em] transition sm:px-5 ${mode === id
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

            {/* Mode classic */}
            {mode === "classic" && (
              <div>
                <div className="flex items-center gap-2">
                  {/* <div className="sm:block absolute left-[-156px] bottom-[-22px] hidden">
                    <img
                      src="/images/mascot.jpg"
                      alt="Mascotte Colibi"
                      className="transition group-hover:scale-105"
                      width={350}
                    />
                  </div> */}
                  <div className="sm:block hidden">
                    <video
                      src="/images/mascot.webm"
                      className="transition group-hover:scale-105 z-10"
                      width={200}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                    />
                  </div>
                  <div className="w-full glass-card rounded-[20px] p-5 sm:p-6 mt-5 shadow-[0_16px_40px_rgba(20,28,40,0.10)] backdrop-blur-xl border border-white/75">
                    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                      <FieldShell
                        icon={<Home className="h-4 w-4" />}
                        label="Type de bien"
                      >
                        <select
                          value={form.propertyType}
                          onChange={(e) =>
                            setForm((c) => ({
                              ...c,
                              propertyType: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
                        >
                          <option>Maison</option>
                          <option>Appartement</option>
                          <option>Penthouse</option>
                          <option>Terrain</option>
                          <option>Villa</option>
                        </select>
                      </FieldShell>

                      <FieldShell
                        icon={<MapPin className="h-4 w-4" />}
                        label="Adresse"
                      >
                        <input
                          value={form.location}
                          onChange={(e) =>
                            setForm((c) => ({ ...c, location: e.target.value }))
                          }
                          className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none placeholder:text-[#7a8795]"
                          placeholder="Quartier, commune, zone"
                        />
                      </FieldShell>

                      <FieldShell
                        icon={<Landmark className="h-4 w-4" />}
                        label="Budget"
                      >
                        <select
                          value={form.budget}
                          onChange={(e) =>
                            setForm((c) => ({ ...c, budget: e.target.value }))
                          }
                          className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
                        >
                          <option>1 M€ – 3 M€</option>
                          <option>3 M€ – 8 M€</option>
                          <option>8 M€ – 15 M€</option>
                          <option>15 M€ +</option>
                        </select>
                      </FieldShell>

                      <FieldShell
                        icon={<Building2 className="h-4 w-4" />}
                        label="Surface"
                      >
                        <select
                          value={form.surface}
                          onChange={(e) =>
                            setForm((c) => ({ ...c, surface: e.target.value }))
                          }
                          className="w-full bg-transparent text-sm font-semibold text-[#283340] outline-none"
                        >
                          <option>150 m² +</option>
                          <option>250 m² +</option>
                          <option>400 m² +</option>
                          <option>800 m² +</option>
                        </select>
                      </FieldShell>
                    </div>
                    {/* CTA buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-center w-full">
                      <button
                        type="button"
                        onClick={() => submitSearch()}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5998] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(30,86,255,0.28)] transition hover:brightness-105"
                      >
                        <List className="h-4 w-4" />
                        Rechercher dans la liste
                      </button>

                      <button
                        type="button"
                        onClick={handleMapSearch}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[#cad2de] bg-white/72 px-6 py-3.5 text-xs font-semibold tracking-[0.14em] text-[#2e3a46] transition hover:border-[#3B5998] hover:text-[#3B5998]"
                      >
                        <MapPin className="h-4 w-4" />
                        Rechercher sur la carte
                      </button>
                    </div>
                  </div>
                </div>
                {/* Quick filters — scrollable sur mobile */}
                <div className="mt-4 flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-hide sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
                  {[
                    {
                      label: "Appartement à votre proximité",
                      key: "appartement",
                    },
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
            )}

            {/* Mode AI */}
            {mode === "ai" && (
              <div className="flex items-start gap-2">
                <div className="sm:block hidden">
                    <video
                      src="/images/mascot.webm"
                      className="transition group-hover:scale-105 z-10"
                      width={200}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                    />
                  </div>
                <div className="w-full mt-5">
                  <FieldShell
                    icon={
                       <Sparkles className="border-1 border-[#3B5998]/50 p-1 rounded-full object-cover" />
                    }
                    label="Décrivez le bien idéal"
                    className="min-h-[100px]"
                  >
                    <textarea
                      onChange={(e) =>
                        setForm((c) => ({ ...c, aiPrompt: e.target.value }))
                      }
                      className="mt-3 min-h-[50px] w-full resize-none bg-transparent text-sm font-medium leading-7 text-[#283340] outline-none placeholder:text-[#7a8795]"
                      placeholder="Décrivez le bien idéal : volume, lumière, style architectural..."
                    />
                  </FieldShell>
                </div>
              </div>
            )}

            {/* Mode offmarket */}
            {mode === "offmarket" && (
              <div className="flex items-start gap-2">
                <div className="sm:block hidden">
                    <video
                      src="/images/mascot.webm"
                      className="transition group-hover:scale-105 z-10"
                      width={200}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                    />
                  </div>
                <div className="flex flex-col gap-3 w-full mt-5 glass-card rounded-[20px] p-5 sm:p-6 shadow-[0_16px_40px_rgba(20,28,40,0.10)] backdrop-blur-xl border border-white/75">
                  <button
                    type="button"
                    onClick={handleMapSearch}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[#cad2de] bg-white/72 px-6 py-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#2e3a46] transition hover:border-[#3B5998] hover:text-[#3B5998]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Rechercher via l'IA
                  </button>
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5998] px-6 py-6 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(30,86,255,0.28)] transition hover:brightness-105"
                  >
                    <MapPin className="h-4 w-4" />
                    Rechercher sur la carte
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── LISTINGS SECTION ─────────────────────────────────────── */}
      <ListingsSection
        activeMarket={activeMarket}
        onMarketChange={changeCountry}
        onNavigate={(p) => navigate(p)}
      />

      <MostViewSection
        activeMarket={activeMarket}
        onMarketChange={changeCountry}
        onNavigate={(p) => navigate(p)}
      />

      <WhyIASection />

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <Footer market={activeMarket} />

      {/* <ProposalSideRail countryId={activeMarket.id} current="one" /> */}
      {/* <MascotWidget /> */}
    </main>
  );
}
