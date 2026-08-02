import { AnimatePresence, motion } from "framer-motion";
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
  Leaf,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Footer, TopNav } from "../shared/components";
import { listings } from "../shared/data";
import { buildPath, getMarket } from "../shared/utils";

const serviceActions = [
  {
    label: "Finances",
    description: "Simuler votre financement",
    icon: HandCoins,
    featured: false,
  },
  { label: "Travaux", description: "Préparer votre projet", icon: Paintbrush },
  { label: "Fournisseur", description: "Trouver des fournisseurs", icon: TrendingUp },
  { label: "Urbanisme", description: "Obtenir les autorisations nécessaires", icon: FileText },
  {
    label: "Environnement",
    description: "Vérifier la conformité du bien",
    icon: Leaf,
  },
  { label: "Localiser mon bien", description: "Trouver la position exacte", icon: MapPin },
  {
    label: "Assurances",
    description: "Protéger votre bien",
    icon: ShieldCheck,
  },
  {
    label: "Gestion Location",
    description: "Gérer la location de votre bien",
    icon: WalletCards,
  },
];

const serviceDocuments: Record<
  string,
  {
    title: string;
    type: string;
    owner: string;
    email: string;
    status: "Signé" | "À signer";
    date: string;
  }[]
> = {
  Finances: [
    { title: "Attestation de financement", type: "Attestation bancaire", owner: "Émilie Laurent", email: "emilie.laurent@conseil-finance.fr", status: "Signé", date: "18 juin 2026" },
    { title: "Simulation de prêt", type: "Document de synthèse", owner: "Émilie Laurent", email: "emilie.laurent@conseil-finance.fr", status: "À signer", date: "24 juin 2026" },
  ],
  Travaux: [
    { title: "Certificat énergétique", type: "Certificat de performance énergétique", owner: "Julien Morel", email: "julien.morel@diagnostics-pro.fr", status: "Signé", date: "12 mai 2026" },
    { title: "Certificat électrique", type: "Contrôle de conformité électrique", owner: "Sofia Benali", email: "sofia.benali@controle-elec.fr", status: "À signer", date: "15 mai 2026" },
  ],
  Fournisseur: [{ title: "Liste des fournisseurs référencés", type: "Annuaire fournisseurs", owner: "Clara Martin", email: "clara.martin@colibi.fr", status: "Signé", date: "03 juillet 2026" }],
  Urbanisme: [{ title: "Certificat d’urbanisme", type: "Document administratif", owner: "Mairie de secteur", email: "urbanisme@ville.fr", status: "Signé", date: "08 avril 2026" }],
  Environnement: [{ title: "Rapport environnemental", type: "Diagnostic environnemental", owner: "Nora Diallo", email: "nora.diallo@diagnostics-pro.fr", status: "Signé", date: "16 mai 2026" }],
  "Localiser mon bien": [{ title: "Plan de localisation", type: "Plan cadastral", owner: "Service cartographie", email: "cartographie@colibi.fr", status: "Signé", date: "28 avril 2026" }],
  Assurances: [{ title: "Proposition d’assurance", type: "Devis habitation", owner: "Lucas Petit", email: "lucas.petit@protection.fr", status: "À signer", date: "26 juin 2026" }],
  "Gestion Location": [{ title: "Mandat de gestion", type: "Mandat locatif", owner: "Manon Roche", email: "manon.roche@gestion-immo.fr", status: "À signer", date: "04 juillet 2026" }],
};

type TimelineEvent = {
  month: string;
  date: string;
  title: string;
  text: string;
  state: "done" | "today" | "upcoming";
};

type TimelineDateGroup = {
  month: string;
  date: string;
  state: "done" | "today" | "upcoming";
  events: TimelineEvent[];
};

function TimelineCard({ event }: { event: TimelineEvent }) {
  return (
    <div
      className={`relative w-full border-l border-r border-[#e9edf3] bg-transparent px-2.5 py-2 transition-shadow before:absolute before:inset-x-1 before:top-1 before:h-px before:rounded-full before:bg-[#dfe7f3] before:content-[''] ${
        event.state === "today"
          ? "shadow-[0_8px_18px_rgba(59,89,152,0.08)]"
          : ""
      }`}
    >
      <p
        className={`text-[0.58rem] font-black uppercase tracking-[0.12em] ${
          event.state === "today" ? "text-[#3B5998]" : "text-[#8895a1]"
        }`}
      >
        {event.date}
      </p>
      <h3 className="mt-1 text-[0.7rem] font-black uppercase leading-tight tracking-[0.025em] text-[#2b3a46]">
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
  const [activeService, setActiveService] = useState<string | null>(null);
  const [openDocument, setOpenDocument] = useState<{
    title: string;
    type: string;
  } | null>(null);
  const [documentsView, setDocumentsView] = useState<"list" | "grid">("list");

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
  const monthlyTimeline: TimelineDateGroup[] = [
    {
      month: "Mars 2026",
      date: "08 MAR",
      state: "done",
      events: [
        {
          month: "Mars 2026",
          date: "08 MAR",
          title: "Premier contact",
          text: "Expression d'intérêt enregistrée.",
          state: "done",
        },
      ],
    },
    {
      month: "Avril 2026",
      date: "17 AVR",
      state: "done",
      events: [
        {
          month: "Avril 2026",
          date: "17 AVR",
          title: "Visite du bien",
          text: "Visite privée réalisée avec le conseiller.",
          state: "done",
        },
      ],
    },
    {
      month: "Mai 2026",
      date: "06 MAI",
      state: "done",
      events: [
        {
          month: "Mai 2026",
          date: "06 MAI",
          title: "Dossier partagé",
          text: "Documents et informations du bien consultés.",
          state: "done",
        },
      ],
    },
    {
      month: "Juin 2026",
      date: "21 JUIN",
      state: "done",
      events: [
        {
          month: "Juin 2026",
          date: "21 JUIN",
          title: "Étude financière",
          text: "Simulation de financement mise à jour.",
          state: "done",
        },
        {
          month: "Juin 2026",
          date: "21 JUIN",
          title: "Contrat de mission",
          text: "Validation du mandat de vente et des prochaines étapes.",
          state: "done",
        },
      ],
    },
    {
      month: "Juillet 2026",
      date: "AUJ. · 29 JUIL",
      state: "today",
      events: [
        {
          month: "Juillet 2026",
          date: "AUJ. · 29 JUIL",
          title: "Aujourd'hui",
          text: "Prochaine action à définir sur ce bien.",
          state: "today",
        },
        {
          month: "Juillet 2026",
          date: "AUJ. · 29 JUIL",
          title: "Validation finale",
          text: "Vérification des pièces et préparation à la signature.",
          state: "today",
        },
        {
          month: "Juillet 2026",
          date: "AUJ. · 29 JUIL",
          title: "Pré-contrat",
          text: "Rédaction du dossier de vente et contrôle final.",
          state: "today",
        },
        {
          month: "Juillet 2026",
          date: "AUJ. · 29 JUIL",
          title: "Signature notaire",
          text: "Préparation des derniers documents à signer.",
          state: "today",
        },
        {
          month: "Juillet 2026",
          date: "AUJ. · 29 JUIL",
          title: "Mise en ligne",
          text: "Publication marketing et diffusion du bien.",
          state: "today",
        },
      ],
    },
  ];

  const todayIndex = monthlyTimeline.findIndex((group) => group.state === "today");
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
          <div className="my-12">
            <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
              <div>
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
                  <MapPin className="h-4 w-4 text-[#3B5998]" />{" "}
                  {listing.district}, {market.city}
                </p>
                <h1 className="mt-3 max-w-3xl text-2xl font-black uppercase leading-[0.96] tracking-[0.04em] text-[#1f2d38] sm:text-4xl">
                  {listing.title}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-7 text-[#647383]">
                  {listing.summary}
                </p>
                <div className="my-5 flex flex-wrap gap-3">
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
                    <Heart className="h-4 w-4" /> Ajouter aux favoris
                  </button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 grid gap-5 items-center rounded-[26px] border border-[#e1e7ef] bg-[#fbfcfe] p-6 shadow-[0_10px_28px_rgba(25,33,46,0.05)] sm:grid-cols-[0.8fr_1.2fr]"
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
            </section>
            {/* <aside className="rounded-[26px] border border-[#e1e7ef] bg-[#fafbfd] p-6 lg:sticky lg:top-6">
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
            </aside> */}
          </div>

          {/* Timeline secondaire */}
          <section className="relative left-1/2 w-screen -translate-x-1/2 border-y border-[#e5e9ef] bg-[#fff] py-12">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">
                Woodline
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em] text-[#22303a]">
                Liste des évènements associés à ce bien
              </h2>

              <div className="mt-10 rounded-[30px] border border-[#e4eaf3] bg-[linear-gradient(180deg,#f9fbff_0%,#f4f8ff_100%)] p-4 shadow-[0_18px_46px_rgba(30,42,58,0.08)] sm:p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">
                      Calendrier
                    </p>
                    <h3 className="mt-2 text-xl font-black uppercase tracking-[0.04em] text-[#22303a]">
                      Évènements du projet
                    </h3>
                  </div>
                  <span className="rounded-full border border-[#dfe7f3] bg-white px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.12em] text-[#647383]">
                    3 max
                  </span>
                </div>

                <div className="overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="relative min-w-[900px] px-2 pb-4 lg:min-w-0">
                    <div className="absolute bottom-[2.1rem] left-4 right-4 h-8 rounded-[14px] border border-[#edf2fa] bg-[linear-gradient(180deg,rgba(59,89,152,0.03),rgba(59,89,152,0.01))] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-[#dfe7f3]" />
                      <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
                        {Array.from({ length: 18 }).map((_, index) => (
                          <span
                            key={`ruler-${index}`}
                            className={`h-3.5 w-px rounded-full ${
                              index % 2 === 0 ? "bg-[#b6c4d8]" : "bg-[#e8edf7]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="absolute bottom-14 left-4 right-4 h-[3px] rounded-full bg-[#e3e9f1]" />
                    <span
                      className="absolute bottom-14 left-4 h-[3px] rounded-full bg-gradient-to-r from-[#3B5998] to-[#7d9ae0] transition-all duration-700"
                      style={{
                        width: `calc((100% - 2rem) * ${progressPercent / 100})`,
                      }}
                    />

                    <div className="relative z-10 flex items-end justify-between gap-3">
                      {monthlyTimeline.map((group) => {
                        const groupState = group.state;
                      const visibleEvents = group.events.slice(0, 2);
                      const hiddenEvents = group.events.slice(2);

                        return (
                          <div
                            key={`${group.month}-${group.date}`}
                            className="relative w-[180px] shrink-0"
                          >
                            <div className="rounded-[22px] border border-[#eaf0f7] bg-white/80 p-2 shadow-[0_12px_26px_rgba(30,42,58,0.05)] backdrop-blur-sm">
                              <div className="mb-2 flex items-center justify-between px-0.5 text-[0.56rem] font-black uppercase tracking-[0.12em] text-[#8a96a2]">
                                <span>{group.month}</span>
                                <span className="rounded-full bg-[#eef3ff] px-1.5 py-0.5 text-[#3B5998]">
                                  {group.events.length}
                                </span>
                              </div>

                              <div className="flex min-h-[138px] flex-col gap-1.5">
                                {visibleEvents.map((event) => (
                                  <TimelineCard
                                    key={`${group.date}-${event.title}`}
                                    event={event}
                                  />
                                ))}

                                {hiddenEvents.length > 0 && (
                                  <div className="group relative mt-0.5">
                                    <button
                                      type="button"
                                      aria-label={`Afficher ${hiddenEvents.length} événements supplémentaires de ${group.month}`}
                                      className="flex h-8 items-center justify-center rounded-full border border-[#b8caef] bg-[#eef3ff] px-2.5 text-[0.62rem] font-black uppercase tracking-[0.12em] text-[#3B5998] shadow-[0_8px_18px_rgba(59,89,152,0.08)] transition hover:border-[#3B5998]"
                                    >
                                      +{hiddenEvents.length}
                                    </button>

                                    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-64 -translate-x-1/2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                                      <div className="rounded-[20px] border border-[#dfe7f3] bg-white p-3 text-left shadow-[0_18px_36px_rgba(30,42,58,0.15)]">
                                        <p className="text-[0.58rem] font-black uppercase tracking-[0.14em] text-[#71808d]">
                                          Événements
                                        </p>
                                        <div className="mt-2 space-y-2">
                                          {hiddenEvents.map((event) => (
                                            <div
                                              key={`${group.date}-${event.title}-tooltip`}
                                              className="rounded-xl border border-[#edf1f6] bg-[#f8fafc] px-2.5 py-2"
                                            >
                                              <p className="text-[0.56rem] font-black uppercase tracking-[0.1em] text-[#8a96a2]">
                                                {event.date}
                                              </p>
                                              <p className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.03em] text-[#2b3a46]">
                                                {event.title}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="relative mt-4 flex h-10 items-center justify-center">
                              {groupState === "today" && (
                                <span className="absolute h-10 w-10 animate-ping rounded-full bg-[#3B5998]/20" />
                              )}
                              <span
                                className={`relative flex h-8 w-8 items-center justify-center rounded-full border-[3px] bg-white ${
                                  groupState === "today"
                                    ? "border-[#3B5998] shadow-[0_0_0_6px_rgba(59,89,152,0.14)]"
                                    : groupState === "done"
                                      ? "border-[#3B5998]"
                                      : "border-[#dde3ea]"
                                }`}
                              >
                                {groupState === "done" ? (
                                  <Check
                                    className="h-3.5 w-3.5 text-[#3B5998]"
                                    strokeWidth={3}
                                  />
                                ) : (
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      groupState === "today"
                                        ? "bg-[#3B5998]"
                                        : "bg-[#c3ccd6]"
                                    }`}
                                  />
                                )}
                              </span>
                            </div>

                            <p
                              className={`mt-3 text-center text-[0.62rem] font-black uppercase tracking-[0.1em] ${
                                groupState === "today"
                                  ? "text-[#3B5998]"
                                  : "text-[#8a96a2]"
                              }`}
                            >
                              {group.month}
                            </p>
                            <p className="mt-1 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#a0a9b3]">
                              {group.date}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
            {activeService ? (
              <div>
                <button type="button" onClick={() => setActiveService(null)} className="inline-flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.15em] text-[#637383] transition hover:text-[#3B5998]"><ArrowLeft className="h-4 w-4" /> Retour aux détails du bien</button>
                <div className="mt-5 flex flex-col gap-3 border-b border-[#e1e7ef] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">{activeService}</p><h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em]">Documents et certificats associés</h2></div><div className="flex items-center gap-3"><p className="text-sm text-[#71808d]">{serviceDocuments[activeService]?.length ?? 0} document(s)</p><div className="flex rounded-lg border border-[#dfe5ec] bg-white p-1"><button type="button" onClick={() => setDocumentsView("list")} className={`flex h-8 w-8 items-center justify-center rounded-md transition ${documentsView === "list" ? "bg-[#3B5998] text-white" : "text-[#71808d] hover:text-[#3B5998]"}`} aria-label="Vue liste"><List className="h-4 w-4" /></button><button type="button" onClick={() => setDocumentsView("grid")} className={`flex h-8 w-8 items-center justify-center rounded-md transition ${documentsView === "grid" ? "bg-[#3B5998] text-white" : "text-[#71808d] hover:text-[#3B5998]"}`} aria-label="Vue grille"><LayoutGrid className="h-4 w-4" /></button></div></div></div>
                <div className={`mt-6 gap-4 ${documentsView === "grid" ? "grid lg:grid-cols-2" : "flex flex-col"}`}>{serviceDocuments[activeService]?.map((document) => <article key={document.title} className={`rounded-[22px] border border-[#e1e7ef] bg-white p-5 shadow-[0_8px_22px_rgba(25,33,46,0.04)] ${documentsView === "list" ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" : ""}`}><div className={documentsView === "list" ? "flex min-w-0 items-start gap-4" : ""}><div className="flex min-w-0 gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f1] text-[0.65rem] font-black text-[#d44747]">PDF</span><div><p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#7b8996]">{document.type}</p><h3 className="mt-1 text-sm font-black uppercase tracking-[0.035em] text-[#2b3a46]">{document.title}</h3></div></div><div className={`text-sm ${documentsView === "list" ? "mt-0 sm:ml-8 sm:border-l sm:border-[#edf0f4] sm:pl-8" : "mt-5 border-t border-[#edf0f4] pt-4"}`}><p className="font-semibold text-[#40505d]">{document.owner}</p><a href={`mailto:${document.email}`} className="mt-1 block text-[#617baf] transition hover:text-[#3B5998]">{document.email}</a><p className="mt-2 text-[0.72rem] text-[#84919c]">Émis le {document.date}</p></div></div><div className={`flex shrink-0 items-center gap-3 ${documentsView === "list" ? "sm:pl-4" : "mt-5"}`}><span className={`rounded-full px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] ${document.status === "Signé" ? "bg-[#e8f6ed] text-[#27854d]" : "bg-[#fff5df] text-[#b77913]"}`}>{document.status}</span><button type="button" onClick={() => setOpenDocument(document)} className="inline-flex items-center gap-2 rounded-full bg-[#22303a] px-4 py-2.5 text-[0.66rem] font-black uppercase tracking-[0.13em] text-white transition hover:bg-[#3B5998]"><FileText className="h-4 w-4" /> Voir</button></div></article>)}</div>
              </div>
            ) : (
              <><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3B5998]">Services associés</p><h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em]">Pilotez votre bien</h2></div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{serviceActions.map(({ label, description, icon: Icon, featured }) => <button key={label} type="button" onClick={() => setActiveService(label)} className={`group flex min-h-28 flex-col rounded-[20px] border p-4 text-left transition hover:-translate-y-1 ${featured ? "border-[#3B5998] bg-[#3B5998] text-white shadow-[0_12px_24px_rgba(59,89,152,0.22)]" : "border-[#e0e6ee] bg-white text-[#263440] hover:border-[#3B5998]"}`}><Icon className={`h-5 w-5 ${featured ? "text-white" : "text-[#3B5998]"}`} /><span className="mt-auto text-sm font-black uppercase tracking-[0.05em]">{label}</span><span className={`mt-1 text-[0.67rem] ${featured ? "text-white/70" : "text-[#718090]"}`}>{description}</span></button>)}</div></>
            )}
          </section>
        </div>
      </div>
      <Footer market={market} />
      <AnimatePresence>
        {openDocument && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenDocument(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#162331]/55 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e5e9ef] px-6 py-4"><div><p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[#d44747]">Aperçu PDF</p><h2 className="mt-1 text-base font-black uppercase tracking-[0.03em] text-[#263440]">{openDocument.title}</h2></div><button type="button" onClick={() => setOpenDocument(null)} className="rounded-full p-2 text-[#687785] transition hover:bg-[#f1f4f7] hover:text-[#263440]" aria-label="Fermer"><X className="h-5 w-5" /></button></div>
              <div className="m-5 flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-[#cfd8e4] bg-[#f6f8fb] p-8 text-center"><div><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f0] text-sm font-black text-[#d44747]">PDF</span><p className="mt-4 text-sm font-semibold text-[#52616e]">Aperçu du document</p><p className="mt-1 text-sm text-[#81909c]">Le lecteur PDF sera connecté ici.</p></div></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
