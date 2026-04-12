import { AnimatePresence, motion } from "framer-motion";

import {
  CountryRail,
  Footer,
  ListingsSection,
  MarketStoryCard,
  MascotWidget,
  ProposalSideRail,
  QuickFilters,
  SearchModeTabs,
  SearchPanel,
  StatsBadges,
  TopNav,
  useHeroSearch,
  WhyIASection,
} from "../shared/components";
import { useNavigate } from "react-router-dom";

export default function ProposalTwoPage() {
  const {
    activeMarket,
    mode,
    setMode,
    form,
    setForm,
    changeCountry,
    submitSearch,
  } = useHeroSearch("/proposal-2");

  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-[#1f2933]">
      <div className="relative isolate overflow-hidden min-h-screen">
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
            <div
              className="absolute inset-0 bg-gradient-to-r 
            from-white/80
            via-white/40
            via-white/25 
            to-white/10"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.55),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(245,243,238,0.22))]" />
          </motion.div>
        </AnimatePresence>

        <TopNav countryId={activeMarket.id} currentProposal="two" />

        <div className="absolute left-2 top-24 z-30 hidden h-[calc(100%-9rem)] items-center lg:flex">
          <CountryRail activeId={activeMarket.id} onChange={changeCountry} />
        </div>

        <section className="relative z-20 mx-auto max-w-[1500px] px-6 pb-16 pt-4 lg:px-16 lg:pb-20 lg:pt-6">
          <div className="grid min-h-[calc(100vh-126px)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="max-w-5xl">
              <div className="hero-panel">
                <p className="mt-7 max-w-xl text-base font-medium text-[#617182] sm:text-lg">
                  {activeMarket.subtitle}
                </p>

                <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.94] tracking-[0.08em] text-[#25303a] sm:text-5xl xl:text-6xl">
                  {activeMarket.title}
                </h1>

                {/* <p className="mt-6 max-w-3xl text-sm leading-7 text-[#526170] sm:text-base">
                  Avec recherche classique ou IA Intelligence
                </p> */}

                <div className="mt-8">
                  <SearchModeTabs active={mode} onChange={setMode} />
                  <div className="mt-5 max-w-5xl">
                    <SearchPanel
                      mode={mode}
                      form={form}
                      setForm={setForm}
                      onSearch={() => submitSearch()}
                      onInterest={() => submitSearch({ interest: true })}
                    />
                  </div>
                </div>

                <QuickFilters
                  activeKey={null}
                  onSelect={(key) => submitSearch({ filter: key })}
                />
                {/* <StatsBadges market={activeMarket} /> */}
              </div>
            </div>

            <div className="hidden lg:block">
              <AnimatePresence mode="wait">
                <MarketStoryCard market={activeMarket} />
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <ListingsSection
        activeMarket={activeMarket}
        onNavigate={(p) => navigate(p)}
      />
      <WhyIASection />

      <Footer market={activeMarket} />

      <ProposalSideRail countryId={activeMarket.id} current="two" />
      <MascotWidget />
    </main>
  );
}
