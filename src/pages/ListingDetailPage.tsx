import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HandCoins,
  Handshake,
  Heart,
  Check,
  Home,
  MapPin,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Footer, TopNav } from "../shared/components";
import { listings } from "../shared/data";
import { buildPath, getMarket } from "../shared/utils";

const serviceActions = [
  {
    label: "Finance",
    description: "Simuler votre financement",
    icon: HandCoins,
    featured: true,
  },
  { label: "Travaux", description: "Préparer votre projet", icon: Paintbrush },
  { label: "Estimation", description: "Estimer la valeur", icon: TrendingUp },
  { label: "Documents", description: "Accéder au dossier", icon: FileText },
  {
    label: "Visite privée",
    description: "Planifier un rendez-vous",
    icon: CalendarDays,
  },
  { label: "Conciergerie", description: "Services sur mesure", icon: Sparkles },
  {
    label: "Assurances",
    description: "Protéger votre bien",
    icon: ShieldCheck,
  },
  {
    label: "Gestion locative",
    description: "Gérer votre patrimoine",
    icon: WalletCards,
  },
];

type TimelineEvent = {
  month: string;
  date: string;
  title: string;
  text: string;
  state: "done" | "today" | "upcoming";
};

function TimelineCard({ event }: { event: TimelineEvent }) {
  return (
    <div
      className={`w-full rounded-xl border px-3 py-2 transition-shadow ${
        event.state === "today"
          ? "border-[#b8caef] bg-[#eef3ff] shadow-[0_8px_18px_rgba(59,89,152,0.12)]"
          : event.state === "done"
            ? "border-[#e1e7ef] bg-white"
            : "border-[#e5e9ef] bg-white/70"
      }`}
    >
      <p
        className={`text-[0.62rem] font-black uppercase tracking-[0.13em] ${
          event.state === "today" ? "text-[#3B5998]" : "text-[#8895a1]"
        }`}
      >
        {event.date}
      </p>
      <h3 className="mt-1 text-[0.72rem] font-black uppercase leading-tight tracking-[0.025em] text-[#2b3a46]">
        {event.title}
      </h3>
    </div>
  );
}

export default function ListingDetailPage() {
  const { listingId } = useParams();
  const listing = listings.find((item) => item.id === listingId);
  const market = getMarket(listing?.country || "");
  const galleryImages = listing
    ? [
        { src: market.image, label: "Vue principale" },
        {
          src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
          label: "Façade",
        },
        {
          src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
          label: "Séjour",
        },
        {
          src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
          label: "Suite",
        },
        {
          src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
          label: "Terrasse",
        },
      ]
    : [];
  const [activeImage, setActiveImage] = useState(0);

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#f6f3ed] text-[#22303a]">
        <TopNav countryId={market.id} currentProposal={null} />
        <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#3B5998]">
            Bien introuvable
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase">
            Cette fiche n’existe plus
          </h1>
          <Link
            to="/"
            className="mt-7 rounded-full bg-[#3B5998] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white"
          >
            Retour à l’accueil
          </Link>
        </div>
      </main>
    );
  }

  const timeline = [
    {
      date: "Aujourd’hui",
      title: "Dossier mis à jour",
      text: "Les informations du bien ont été vérifiées.",
      icon: CheckCircle2,
    },
    {
      date: "Il y a 2 jours",
      title: "Nouvelle visite enregistrée",
      text: "Une demande de visite privée a été ajoutée.",
      icon: UserRoundCheck,
    },
    {
      date: "Il y a 6 jours",
      title: "Documents disponibles",
      text: "Le dossier administratif est prêt à être consulté.",
      icon: ClipboardList,
    },
    {
      date: "Il y a 10 jours",
      title: "Bien publié",
      text: "Cette opportunité est désormais visible sur Colibi.",
      icon: Home,
    },
  ];
  const monthlyTimeline: TimelineEvent[] = [
    {
      month: "Mars 2026",
      date: "08 MAR",
      title: "Premier contact",
      text: "Expression d'intérêt enregistrée.",
      state: "done",
    },
    {
      month: "Avril 2026",
      date: "17 AVR",
      title: "Visite du bien",
      text: "Visite privée réalisée avec le conseiller.",
      state: "done",
    },
    {
      month: "Mai 2026",
      date: "06 MAI",
      title: "Dossier partagé",
      text: "Documents et informations du bien consultés.",
      state: "done",
    },
    {
      month: "Juin 2026",
      date: "21 JUIN",
      title: "Étude financière",
      text: "Simulation de financement mise à jour.",
      state: "done",
    },
    {
      month: "Juillet 2026",
      date: "AUJ. · 29 JUIL",
      title: "Aujourd'hui",
      text: "Prochaine action à définir sur ce bien.",
      state: "today",
    },
  ];

  const todayIndex = monthlyTimeline.findIndex((e) => e.state === "today");
  const activeIndex =
    todayIndex === -1 ? monthlyTimeline.length - 1 : todayIndex;
  const progressPercent =
    monthlyTimeline.length > 1
      ? (activeIndex / (monthlyTimeline.length - 1)) * 100
      : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#22303a]">
      <div className="border-b border-[#edf0f4] bg-white">
        <TopNav countryId={market.id} currentProposal={null} />
        <div className="mx-auto max-w-[1500px] px-6 pb-12 pt-5 lg:px-16 lg:pt-10">
          <Link
            to={buildPath("/", { country: market.id })}
            className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.17em] text-[#647383] transition hover:text-[#3B5998]"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux biens
          </Link>
          <div className="mt-5 flex gap-4 w-full">
            <div className="overflow-hidden rounded-[24px] w-full border border-[#e2e7ed] bg-[#f5f7fa] shadow-[0_18px_40px_rgba(25,33,46,0.10)]">
              <img
                src={galleryImages[activeImage]?.src}
                alt={`${listing.title} — ${galleryImages[activeImage]?.label}`}
                className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[480px]"
                style={{
                  objectPosition: activeImage === 0 ? listing.focus : "center",
                }}
              />
            </div>
            <div className="mt-3 flex flex-col gap-3 w-[fit-content] pb-1">
              {galleryImages.map((image, index) => (
                <button
                  key={image.label}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Afficher ${image.label}`}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-32 ${
                    activeImage === index
                      ? "border-[#3B5998] shadow-[0_0_0_2px_rgba(59,89,152,0.2)]"
                      : "border-[#e2e7ed] opacity-70 hover:border-[#8ba2d3] hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/45 px-1.5 py-1 text-left text-[0.56rem] font-bold uppercase tracking-[0.08em] text-white">
                    {image.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,0.3fr)] lg:items-start">
            <section>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#eef3ff] px-3 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#3B5998]">
                  {listing.type}
                </span>
                <span className="rounded-full bg-[#3B5998] px-3 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-white">
                  {listing.offmarket
                    ? "Off-market"
                    : (listing.status ?? "Vente")}
                </span>
              </div>
              <p className="mt-6 flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#71808d]">
                <MapPin className="h-4 w-4 text-[#3B5998]" /> {listing.district}
                , {market.city}
              </p>
              <h1 className="mt-3 max-w-3xl text-2xl font-black uppercase leading-[0.96] tracking-[0.04em] text-[#1f2d38] sm:text-4xl">
                {listing.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-[#647383]">
                {listing.summary}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 grid gap-5 rounded-[26px] border border-[#e1e7ef] bg-[#fbfcfe] p-6 shadow-[0_10px_28px_rgba(25,33,46,0.05)] sm:grid-cols-[0.8fr_1.2fr]"
              >
                <div className="border-b border-[#e4e9ef] pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#71808d]">
                    Prix indicatif
                  </p>
                  <p className="mt-2 text-4xl font-black tracking-tight text-[#3B5998]">
                    {listing.price}
                  </p>
                </div>
                <div>
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#71808d]">
                    Informations du bien
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                    <span className="flex items-center gap-2 font-semibold text-[#354451]">
                      <Building2 className="h-4 w-4 text-[#3B5998]" />
                      {listing.surface}
                    </span>
                    <span className="flex items-center gap-2 font-semibold text-[#354451]">
                      <BedDouble className="h-4 w-4 text-[#3B5998]" />
                      {listing.suites}
                    </span>
                    <span className="col-span-2 text-sm text-[#647383]">
                      {listing.offmarket
                        ? "Opportunité confidentielle off-market"
                        : `Disponible à la ${listing.status?.toLowerCase() ?? "vente"}`}
                    </span>
                  </div>
                </div>
              </motion.div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-[#3B5998] px-5 py-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#3B5998]"
                >
                  Contacter le proprietaire
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#3B5998] px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#3B5998] transition hover:border-[#3B5998] hover:text-[#3B5998]"
                >
                  <Handshake className="h-4 w-4" /> Proposer une offre de
                  location
                </button>
              </div>
            </section>
            <aside className="rounded-[26px] border border-[#e1e7ef] bg-[#fafbfd] p-6 lg:sticky lg:top-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">
                Liste des évènements associés à ce bien
              </p>
              <h2 className="mt-2 text-xl font-black uppercase tracking-[0.05em] text-[#22303a]">
                Woodline
              </h2>
              <div className="mt-7 space-y-0">
                {timeline.map(({ date, title, text, icon: Icon }, index) => (
                  <div
                    key={title}
                    className="relative grid grid-cols-[28px_1fr] gap-3 pb-6 last:pb-0"
                  >
                    <div className="relative flex justify-center">
                      {index < timeline.length - 1 && (
                        <span className="absolute top-8 h-[calc(100%+1px)] w-px bg-[#dce3eb]" />
                      )}
                      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#cbd8f1] bg-white text-[#3B5998]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div>
                      <p className="text-[0.61rem] font-bold uppercase tracking-[0.12em] text-[#8794a0]">
                        {date}
                      </p>
                      <h3 className="mt-1 text-sm font-black uppercase tracking-[0.03em] text-[#293744]">
                        {title}
                      </h3>
                      <p className="mt-1 text-[0.77rem] leading-5 text-[#71808d]">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* Timeline secondaire */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 border-y border-[#e5e9ef] bg-[#fbfcfe] py-12">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">
                Woodline
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em] text-[#22303a]">
                Liste des évènements associés à ce bien
              </h2>

              <div className="mt-10 overflow-x-auto pb-2">
                <div className="relative flex min-w-[900px] justify-between gap-2 px-4 lg:min-w-0">
                  {/* ligne de fond */}
                  <span className="absolute left-4 right-4 top-[142px] h-[3px] rounded-full bg-[#e3e9f1]" />
                  {/* ligne de progression */}
                  <span
                    className="absolute left-4 top-[142px] h-[3px] rounded-full bg-gradient-to-r from-[#3B5998] to-[#7d9ae0] transition-all duration-700"
                    style={{
                      width: `calc((100% - 2rem) * ${progressPercent / 100})`,
                    }}
                  />

                  {monthlyTimeline.map((event, index) => {
                    const isTop = index % 2 === 0;
                    return (
                      <div
                        key={event.month}
                        className="relative z-10 flex w-[170px] shrink-0 flex-col items-center text-center"
                      >
                        <div className="flex h-[92px] w-full items-end justify-center">
                          {isTop && <TimelineCard event={event} />}
                        </div>

                        <p
                          className={`mt-2 text-[0.62rem] font-black uppercase tracking-[0.1em] ${
                            event.state === "today"
                              ? "text-[#3B5998]"
                              : "text-[#8a96a2]"
                          }`}
                        >
                          {event.month}
                        </p>

                        <div className="relative mt-2 flex h-9 items-center justify-center">
                          {event.state === "today" && (
                            <span className="absolute h-10 w-10 animate-ping rounded-full bg-[#3B5998]/20" />
                          )}
                          <span
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-[3px] bg-white ${
                              event.state === "today"
                                ? "border-[#3B5998] shadow-[0_0_0_6px_rgba(59,89,152,0.14)]"
                                : event.state === "done"
                                  ? "border-[#3B5998]"
                                  : "border-[#dde3ea]"
                            }`}
                          >
                            {event.state === "done" ? (
                              <Check
                                className="h-3.5 w-3.5 text-[#3B5998]"
                                strokeWidth={3}
                              />
                            ) : (
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  event.state === "today"
                                    ? "bg-[#3B5998]"
                                    : "bg-[#c3ccd6]"
                                }`}
                              />
                            )}
                          </span>
                        </div>

                        <div className="mt-3 flex h-[92px] w-full items-start justify-center">
                          {!isTop && <TimelineCard event={event} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          {/* <section className="mt-14 border-t border-[#e5e9ef] pt-10">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">
              Chronologie mensuelle
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em] text-[#22303a]">
              Suivi du projet
            </h2>
            <div className="mt-7 max-w-5xl overflow-x-auto rounded-[22px] border border-[#e1e7ef] bg-[#fbfcfe] p-4 sm:p-5">
              <div className="relative flex min-w-[760px] items-start justify-between px-2 pt-1">
                <span className="absolute left-[9%] right-[9%] top-[51px] h-px bg-[#d9e1eb]" />
                {monthlyTimeline.map((event, index) => (
                  <div
                    key={event.month}
                    className="relative z-10 flex w-[142px] shrink-0 flex-col items-center text-center"
                  >
                    <p
                      className={`h-8 text-[0.62rem] font-black uppercase tracking-[0.1em] ${event.state === "today" ? "text-[#3B5998]" : "text-[#8a96a2]"}`}
                    >
                      {event.month}
                    </p>
                    <div className="flex h-9 items-center justify-center">
                      <span
                        className={`relative flex h-7 w-7 items-center justify-center rounded-full border-4 ${event.state === "today" ? "border-[#dce8ff] bg-[#3B5998] shadow-[0_0_0_5px_rgba(59,89,152,0.12)]" : "border-[#eef1f5] bg-white"}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${event.state === "today" ? "bg-white" : "bg-[#93a3b3]"}`}
                        />
                      </span>
                    </div>
                    <div
                      className={`mt-2 w-full rounded-xl border px-3 py-2 ${event.state === "today" ? "border-[#b8caef] bg-[#eef3ff] shadow-[0_6px_14px_rgba(59,89,152,0.09)]" : "border-[#e5e9ef] bg-white"}`}
                    >
                      <p
                        className={`text-[0.62rem] font-black uppercase tracking-[0.13em] ${event.state === "today" ? "text-[#3B5998]" : "text-[#8895a1]"}`}
                      >
                        {event.date}
                      </p>
                      <h3 className="mt-1 text-[0.72rem] font-black uppercase leading-tight tracking-[0.025em] text-[#2b3a46]">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section> */}
          <section className="mt-14 rounded-[32px] border border-[#e1e7ef] bg-[#fbfcfe] p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">
                  Services associés
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em]">
                  Pilotez votre bien
                </h2>
              </div>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {serviceActions.map(
                ({ label, description, icon: Icon, featured }) => (
                  <button
                    key={label}
                    type="button"
                    className={`group flex min-h-28 flex-col rounded-[20px] border p-4 text-left transition hover:-translate-y-1 ${featured ? "border-[#3B5998] bg-[#3B5998] text-white shadow-[0_12px_24px_rgba(59,89,152,0.22)]" : "border-[#e0e6ee] bg-white text-[#263440] hover:border-[#3B5998]"}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${featured ? "text-white" : "text-[#3B5998]"}`}
                    />
                    <span className="mt-auto text-sm font-black uppercase tracking-[0.05em]">
                      {label}
                    </span>
                    <span
                      className={`mt-1 text-[0.67rem] ${featured ? "text-white/70" : "text-[#718090]"}`}
                    >
                      {description}
                    </span>
                  </button>
                ),
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer market={market} />
    </main>
  );
}
