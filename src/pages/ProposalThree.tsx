import { AnimatePresence, motion } from "framer-motion";

import {
  CountryRail,
  Footer,
  ListingsSection,
  ListingsSection3,
  MascotWidget,
  ProposalSideRail,
  QuickFilters,
  SearchModeTabs,
  SearchPanel,
  TopNav,
  useHeroSearch,
  WhyIASection,
} from "../shared/components";
import { useNavigate } from "react-router-dom";

export default function ProposalThreePage() {
  const {
    activeMarket,
    mode,
    setMode,
    form,
    setForm,
    changeCountry,
    submitSearch,
  } = useHeroSearch("/proposal-3");
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-[#1f2933]">
      <div className="relative isolate overflow-hidden min-h-screen">
        {/* Background animé */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.6),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(245,243,238,0.22))]" />
          </motion.div>
        </AnimatePresence>

        <TopNav countryId={activeMarket.id} currentProposal="three" />

        <div className="absolute left-2 top-24 z-30 hidden h-[calc(100%-9rem)] items-center lg:flex">
          <CountryRail activeId={activeMarket.id} onChange={changeCountry} />
        </div>

        {/* Contenu centré */}
        <section className="relative z-20 flex min-h-[calc(100vh-126px)] flex-col items-center justify-center px-6 pb-16 pt-4 lg:px-16 lg:pb-20 lg:pt-6">
          <div className="w-full max-w-3xl text-center">
            <div className="hero-panel">
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

              {/* Search & Filters */}
              <div className="mt-8">
                <div className="flex justify-center">
                  <SearchModeTabs active={mode} onChange={setMode} />
                </div>
                <div className="mt-5 max-w-3xl mx-auto">
                  <SearchPanel
                    mode={mode}
                    form={form}
                    setForm={setForm}
                    onSearch={() => submitSearch()}
                    onInterest={() => submitSearch({ interest: true })}
                  />
                </div>
              </div>

              {/* <div className="mt-6 flex justify-center">
                <QuickFilters
                  activeKey={null}
                  onSelect={(key) => submitSearch({ filter: key })}
                />
              </div> */}
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
          </div>
        </section>
      </div>

      <ListingsSection3
        activeMarket={activeMarket}
        onNavigate={(p) => navigate(p)}
      />
      <WhyIASection />

      <Footer market={activeMarket} />

      <ProposalSideRail countryId={activeMarket.id} current="three" />
      <MascotWidget />
    </main>
  );
}

// export default function ProposalThreePage() {
//   const {
//     activeMarket,
//     mode,
//     setMode,
//     form,
//     setForm,
//     changeCountry,
//     submitSearch,
//   } = useHeroSearch("/proposal-3");
//   const navigate = useNavigate();

//   return (
//     // On change le bg global en noir pour éviter le flash blanc au scroll
//     <main className="min-h-screen overflow-hidden bg-[#121212] text-white">
//       <div className="relative isolate overflow-hidden min-h-screen">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeMarket.id}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.8 }}
//             className="absolute inset-0"
//           >
//             <img
//               src={activeMarket.image}
//               alt={activeMarket.title}
//               className="hero-zoom absolute inset-0 h-full w-full object-cover object-center"
//             />
//             {/* OVERLAY DARK PREMIUM */}
//             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#121212]" />
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,89,152,0.15),transparent_70%)]" />
//           </motion.div>
//         </AnimatePresence>

//         <TopNav countryId={activeMarket.id} currentProposal="three" />

//         <div className="absolute left-2 top-24 z-30 hidden h-[calc(100%-9rem)] items-center lg:flex">
//           <CountryRail activeId={activeMarket.id} onChange={changeCountry} />
//         </div>

//         <section className="relative z-20 flex min-h-[calc(100vh-126px)] flex-col items-center justify-center px-6 pb-16 pt-4 lg:px-16 lg:pb-20 lg:pt-6">
//           <div className="w-full max-w-5xl text-center">
//             <div className="hero-panel">
//               {/* Strapline */}
//               <div className="hidden md:flex flex-wrap items-center justify-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.3em] text-white/50">
//                 <span className="inline-flex h-px w-10 bg-white/20" />
//                 {activeMarket.strapline}
//                 <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/90">
//                   {activeMarket.country}
//                 </span>
//               </div>

//               {/* Title - Style Image Attachée */}
//               <motion.h1
//                 key={activeMarket.id + "-h1"}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7 }}
//                 className="mt-8 text-5xl font-light italic leading-[1] tracking-tight text-white sm:text-7xl xl:text-8xl font-serif"
//               >
//                 Trouvez le bien idéal
//                 <br />
//                 <span className="font-normal not-italic text-[#3B5998] opacity-90">en quelques secondes</span>
//               </motion.h1>

//               <p className="mt-8 max-w-2xl mx-auto text-lg font-light text-white/60">
//                 {activeMarket.subtitle}
//               </p>

//               {/* Search Panel (Il ressortira mieux sur le fond noir) */}
//               <div className="mt-12">
//                 <div className="flex justify-center">
//                   <SearchModeTabs active={mode} onChange={setMode} />
//                 </div>
//                 <div className="mt-6 max-w-3xl mx-auto">
//                   <SearchPanel
//                     mode={mode}
//                     form={form}
//                     setForm={setForm}
//                     onSearch={() => submitSearch()}
//                     onInterest={() => submitSearch({ interest: true })}
//                   />
//                 </div>
//               </div>

//               <div className="mt-8 flex justify-center opacity-80 transition-hover hover:opacity-100">
//                 <QuickFilters
//                   activeKey={null}
//                   onSelect={(key) => submitSearch({ filter: key })}
//                 />
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       <ListingsSection3
//         activeMarket={activeMarket}
//         onNavigate={(p) => navigate(p)}
//       />
//       <WhyIASection />

//       <Footer market={activeMarket} />

//       <ProposalSideRail countryId={activeMarket.id} current="three" />
//       <MascotWidget />
//     </main>
//   );
// }
