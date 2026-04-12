import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Footer,
  QuickFilters,
  SearchModeTabs,
  SearchPanel,
  TopNav,
} from "../shared/components";
import { markets, searchModes } from "../shared/data";
import { listings } from "../shared/data";
import type { SearchFormState } from "../shared/types";
import {
  buildPath,
  createFormState,
  getFilterLabel,
  getMarket,
  getMode,
  normalize,
} from "../shared/utils";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeMarket = getMarket(searchParams.get("country"));
  const mode = getMode(searchParams.get("mode"));
  const activeFilter = searchParams.get("filter");
  const [form, setForm] = useState<SearchFormState>(() =>
    createFormState(activeMarket, searchParams)
  );

  const serializedSearch = searchParams.toString();

  useEffect(() => {
    setForm(createFormState(activeMarket, searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMarket, serializedSearch]);

  const updateSearch = (overrides?: Record<string, string | undefined>) => {
    const base: Record<string, string | undefined> = {
      country: activeMarket.id,
      mode,
      filter: activeFilter ?? undefined,
      interest: searchParams.get("interest") ?? undefined,
      ...overrides,
    };

    const nextMode = (overrides?.mode ?? mode) as "classic" | "ai" | "offmarket";

    if (nextMode === "classic") {
      navigate(
        buildPath("/search", {
          ...base,
          type: form.propertyType,
          location: form.location,
          budget: form.budget,
          surface: form.surface,
          prompt: undefined,
          availability: undefined,
          offType: undefined,
          offArea: undefined,
          offBudget: undefined,
          offTiming: undefined,
        })
      );
      return;
    }

    if (nextMode === "ai") {
      navigate(
        buildPath("/search", {
          ...base,
          location: form.location,
          availability: form.availability,
          prompt: form.aiPrompt,
          type: undefined,
          budget: undefined,
          surface: undefined,
          offType: undefined,
          offArea: undefined,
          offBudget: undefined,
          offTiming: undefined,
        })
      );
      return;
    }

    navigate(
      buildPath("/search", {
        ...base,
        offType: form.offmarketType,
        offArea: form.offmarketArea,
        offBudget: form.offmarketBudget,
        offTiming: form.offmarketTiming,
        type: undefined,
        budget: undefined,
        surface: undefined,
        prompt: undefined,
        availability: undefined,
      })
    );
  };

  const results = useMemo(() => {
    const requestedType = normalize(
      searchParams.get("type") ?? searchParams.get("offType") ?? ""
    );
    const requestedLocation = normalize(
      searchParams.get("location") ??
        searchParams.get("offArea") ??
        activeMarket.defaultLocation
    );

    return listings.filter((listing) => {
      if (listing.country !== activeMarket.id) return false;
      if (mode === "offmarket" && !listing.offmarket) return false;
      if (activeFilter && !listing.tags.includes(activeFilter)) return false;

      if (requestedType && requestedType !== "tous biens") {
        const listingType = normalize(listing.type);
        if (!listingType.includes(requestedType)) return false;
      }

      if (requestedLocation) {
        const haystack = normalize(`${listing.district} ${activeMarket.defaultLocation}`);
        if (!haystack.includes(requestedLocation.split("/")[0]?.trim() ?? "")) return false;
      }

      return true;
    });
  }, [activeFilter, activeMarket.defaultLocation, activeMarket.id, mode, searchParams]);

  const interestSaved = searchParams.get("interest") === "1";
  const filterLabel = getFilterLabel(activeFilter);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#1d2732]">
      {/* Header band with background */}
      <div className="relative isolate overflow-hidden border-b border-[#d6d0c6]">
        <div className="absolute inset-0">
          <img
            src={activeMarket.image}
            alt={activeMarket.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,243,237,0.92)_0%,rgba(246,243,237,0.83)_38%,rgba(246,243,237,0.68)_100%)]" />
        </div>

        <div className="relative z-10">
          <TopNav countryId={activeMarket.id} currentProposal={null} />

          <section className="mx-auto max-w-[1500px] px-6 pb-12 pt-4 lg:px-16 lg:pb-14">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#677484]">
                <span className="rounded-full border border-white/70 bg-white/65 px-3 py-1">
                  {activeMarket.country}
                </span>
                <span className="rounded-full border border-white/70 bg-white/65 px-3 py-1">
                  {searchModes.find((item) => item.id === mode)?.label}
                </span>
                {filterLabel && (
                  <span className="rounded-full border border-[#3B5998]/20 bg-[#3B5998]/10 px-3 py-1 text-[#3B5998]">
                    Filtre : {filterLabel}
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-black uppercase leading-tight tracking-[0.08em] text-[#222c35] sm:text-5xl lg:text-6xl">
                Recherche de biens sur-mesure
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#546372] sm:text-base">
                Une page dédiée à la sélection immobilière : recherche classique, IA ou mandats
                off-market, avec critères, filtres rapides et résultats pré-sélectionnés.
              </p>

              {interestSaved && (
                <div className="mt-6 rounded-[24px] border border-[#3B5998]/20 bg-white/75 p-4 text-sm text-[#30404f] shadow-[0_12px_24px_rgba(20,28,40,0.05)] backdrop-blur-xl">
                  <span className="font-semibold text-[#3B5998]">Intérêt enregistré.</span> Nos
                  équipes peuvent reprendre ces critères pour vous proposer une sélection courte et
                  qualifiée.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Search body */}
      <section className="mx-auto max-w-[1500px] px-6 py-10 lg:px-16">
        {/* Country tabs */}
        <div className="flex flex-wrap gap-3">
          {markets.map((market) => (
            <button
              key={market.id}
              type="button"
              onClick={() =>
                navigate(
                  buildPath("/search", {
                    country: market.id,
                    mode,
                    filter: activeFilter,
                  })
                )
              }
              className={`rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition ${
                market.id === activeMarket.id
                  ? "border-[#3B5998] bg-[#3B5998] text-white"
                  : "border-[#d2d9e2] bg-white text-[#32404e] hover:border-[#3B5998]/40 hover:text-[#3B5998]"
              }`}
            >
              {market.country}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <SearchModeTabs
              active={mode}
              onChange={(nextMode) =>
                updateSearch({ mode: nextMode, filter: activeFilter ?? undefined })
              }
            />

            <div className="mt-5">
              <SearchPanel
                mode={mode}
                form={form}
                setForm={setForm}
                onSearch={() => updateSearch()}
                onInterest={() => updateSearch({ interest: "1" })}
                compact
              />
            </div>

            <QuickFilters
              activeKey={activeFilter}
              onSelect={(key) =>
                navigate(
                  buildPath("/search", {
                    country: activeMarket.id,
                    mode: "classic",
                    filter: key,
                    type: form.propertyType,
                    location: form.location,
                    budget: form.budget,
                    surface: form.surface,
                  })
                )
              }
            />

            {/* Results header */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#677484]">
                  Résultats
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.07em] text-[#22303a]">
                  {results.length} bien{results.length > 1 ? "s" : ""} sélectionné
                  {results.length > 1 ? "s" : ""}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#556473]">
                {filterLabel
                  ? `Le filtre ${filterLabel} est appliqué par défaut aux résultats.`
                  : "Utilisez les filtres rapides pour pré-appliquer une orientation de recherche."}
              </p>
            </div>

            {/* Listing cards */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {results.length > 0 ? (
                results.map((listing, index) => (
                  <motion.article
                    key={listing.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="overflow-hidden rounded-[30px] border border-[#d9e0e8] bg-white shadow-[0_16px_36px_rgba(25,33,46,0.06)]"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getMarket(listing.country).image}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: listing.focus }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/88 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#23303a]">
                          {listing.type}
                        </span>
                        {listing.offmarket && (
                          <span className="rounded-full bg-[#3B5998]/90 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white">
                            Off-market
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                          {listing.district}
                        </p>
                        <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.06em]">
                          {listing.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-sm leading-7 text-[#556473]">{listing.summary}</p>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-[20px] bg-[#f4f6f8] p-3">
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#677484]">
                            Prix
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#24313b]">
                            {listing.price}
                          </p>
                        </div>
                        <div className="rounded-[20px] bg-[#f4f6f8] p-3">
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#677484]">
                            Surface
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#24313b]">
                            {listing.surface}
                          </p>
                        </div>
                        <div className="rounded-[20px] bg-[#f4f6f8] p-3">
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#677484]">
                            Suites
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#24313b]">
                            {listing.suites}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {listing.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              navigate(
                                buildPath("/search", {
                                  country: activeMarket.id,
                                  mode: "classic",
                                  filter: tag,
                                })
                              )
                            }
                            className="rounded-full border border-[#d6dce4] px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#556473] transition hover:border-[#3B5998] hover:text-[#3B5998]"
                          >
                            {getFilterLabel(tag) ?? tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="rounded-[30px] border border-dashed border-[#cfd7e2] bg-white/70 p-8 text-center text-sm text-[#566474]">
                  Aucun résultat ne correspond exactement à ces critères. Ajustez le filtre ou
                  élargissez la zone de recherche.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-[30px] bg-[#223141] p-6 text-white shadow-[0_18px_36px_rgba(15,22,31,0.16)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/60">
                Résumé de la recherche
              </p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[0.08em]">
                {activeMarket.country}
              </h3>
              <div className="mt-5 space-y-3 text-sm text-white/80">
                <p>
                  <span className="font-semibold text-white">Mode :</span>{" "}
                  {searchModes.find((item) => item.id === mode)?.label}
                </p>
                {filterLabel && (
                  <p>
                    <span className="font-semibold text-white">Filtre :</span> {filterLabel}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-white">Zone :</span>{" "}
                  {searchParams.get("location") ??
                    searchParams.get("offArea") ??
                    activeMarket.defaultLocation}
                </p>
              </div>
            </div>

            <div className="glass-card rounded-[30px] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#677484]">
                Accès confidentiel
              </p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-[#22303a]">
                COLIBI
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#566474]">
                Pour les mandats les plus sensibles, nous préparons une short-list confidentielle et
                une approche discrète des propriétaires.
              </p>
              <button
                type="button"
                onClick={() => updateSearch({ mode: "offmarket", interest: "1" })}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-[#cad2de] bg-white/75 px-5 py-3 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#32404e] transition hover:border-[#3B5998] hover:text-[#3B5998]"
              >
                <Heart className="h-4 w-4" />
                Marquer mon intérêt
              </button>
            </div>
          </aside>
        </div>
      </section>

      <Footer market={activeMarket} />
    </main>
  );
}
