import { motion } from "framer-motion";
import {
  ArrowRight,
  Gift,
  MapPin,
  Sparkles,
  Trophy,
  Users,
  Star,
  Crown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TopNav, Footer, useHeroSearch } from "../shared/components";

type GameItem = {
  id: number;
  title: string;
  subtitle: string;
  reward: string;
  rewardText: string;
  description: string;
  challenge: string;
  steps: string[];
  cta: string;
  accent: string;
  image: string;
  imageAlt: string;
  layout: "mockup" | "capture" | "browser";
  action: () => void;
};

function GameSection({ game, reverse = false }: { game: GameItem; reverse?: boolean }) {
  return (
    <article
      className={`grid grid-cols-1 lg:grid-cols-2 ${reverse ? "lg:[direction:rtl]" : ""}`}
    >
      {/* ══════════════════════════
          MEDIA — fond style "ad modal"
          ══════════════════════════ */}
      <div className="relative flex items-center justify-center overflow-hidden bg-[#3B5998] p-10 lg:p-16">
        {/* ── Background decorations (same as ad modal) ── */}

        {/* Giant watermark text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none whitespace-nowrap text-[140px] font-black uppercase leading-none tracking-tighter text-white/[0.04] sm:text-[180px]">
            JEU {game.id}
          </span>
        </div>

        {/* Outlined text bottom */}
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 overflow-hidden">
          <span
            className="block whitespace-nowrap text-center text-[36px] font-black uppercase leading-none tracking-tight sm:text-[44px]"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.08)",
              color: "transparent",
            }}
          >
            biens mystères · biens mystères · biens mystères
          </span>
        </div>

        {/* Radial glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FBBF24]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[#FBBF24]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />

        {/* ── Image content (LTR always) ── */}
        <div className={`relative z-10 w-full max-w-[420px] ${reverse ? "[direction:ltr]" : ""}`}>
          {/* Floating reward badge */}
          <div
            className="absolute rounded-lg -top-2 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#78350F] shadow-lg"
            style={{ backgroundColor: "#FBBF24" }}
          >
            <Trophy className="h-3 w-3" />
            {game.reward}
          </div>

          {game.layout === "mockup" && (
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-[#FBBF24]/10 blur-3xl" />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-[220px] overflow-hidden sm:w-[240px]"
                >
                  {/* <div className="absolute left-1/2 top-0 z-10 h-4 w-24 -translate-x-1/2 bg-gray-900" /> */}
                  <img src={game.image} alt={game.imageAlt} className="w-full object-cover" />
                </motion.div>
              </div>
            </div>
          )}

          {game.layout === "capture" && (
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-white/5 blur-2xl" />
              <div className="relative border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
                <img src={game.image} alt={game.imageAlt} className="w-full object-cover" />
              </div>
            </motion.div>
          )}

          {game.layout === "browser" && (
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-white/5 blur-2xl" />
              <div className="relative overflow-hidden border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/10 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <div className="ml-3 h-2 w-28 rounded-full bg-white/15" />
                </div>
                <img src={game.image} alt={game.imageAlt} className="w-full object-cover" />
              </div>
            </motion.div>
          )}

          {/* Game number at bottom */}
          <div className="mt-6 flex justify-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Jeu {game.id} sur 3
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          CONTENT
          ══════════════════════════ */}
      <div className={`flex items-center bg-white p-8 lg:p-16 ${reverse ? "[direction:ltr]" : ""}`}>
        <div className="max-w-xl">
          {/* Tags */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                backgroundColor: `${game.accent}12`,
                color: game.accent,
              }}
            >
              <Star className="h-3 w-3" />
              Jeu {game.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 bg-[#FBBF24]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${game.rewardText}`}
            >
              <Gift className="h-3 w-3" />
              {game.reward}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black uppercase leading-[1.1] tracking-[0.04em] text-[#222c35] sm:text-4xl">
            {game.title}
          </h2>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a9aac]">
            {game.subtitle}
          </p>

          {/* Description */}
          <p className="mt-6 text-sm leading-7 text-[#546372]">{game.description}</p>

          {/* Challenge callout */}
          <div className="mt-6 border-l-3 border-[#3B5998] bg-[#3B5998]/5 px-5 py-4" style={{ borderLeftWidth: 3 }}>
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3B5998]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3B5998]">
                  Le défi
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1a2535]">{game.challenge}</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-8 space-y-4">
            {game.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-[11px] font-black text-white"
                  style={{ backgroundColor: game.accent }}
                >
                  {i + 1}
                </div>
                <span className="pt-1 text-sm leading-6 text-[#546372]">{step}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={game.action}
            className="group mt-8 inline-flex items-center gap-2 bg-[#3B5998] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#2a406e]"
          >
            {game.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ContestPage() {
  const navigate = useNavigate();
  const { activeMarket } = useHeroSearch("/contest");

  const games: GameItem[] = [
    {
      id: 1,
      title: "Le bien mystère avec Immogo",
      subtitle: "Scannez · Découvrez · Gagnez",
      reward: "500€",
      rewardText: "text-[#8a5b00]",
      description:
        "Immogo vous permet de scanner votre environnement avec la caméra et de voir apparaître les biens à vendre autour de vous en temps réel. Pointez, découvrez, et trouvez le bien mystère avant tout le monde.",
      challenge: "Le premier participant à trouver le bon bien remportera la récompense.",
      steps: [
        "Ouvrez Immogo depuis la page concours",
        "Scannez votre environnement pour repérer les biens",
        "Trouvez le bien mystère et validez votre participation",
      ],
      cta: "Accéder à Immogo",
      accent: "#3B5998",
      image: "/images/mockup.jpg",
      imageAlt: "Mockup Colar / Immogo",
      layout: "mockup",
      action: () => navigate("/search?mode=classic"),
    },
    {
      id: 2,
      title: "Le bien mystère en Off-market",
      subtitle: "Exclusif · Rare · Premium",
      reward: "500€",
      rewardText: "text-[#3B5998]",
      description:
        "La recherche Off-market vous donne accès à des biens non publiés et ultra qualifiés. Des propriétés souvent plus exclusives, négociées en direct, que vous ne trouverez nulle part ailleurs.",
      challenge: "Le premier participant à cliquer sur le bon bien remportera la récompense.",
      steps: [
        "Activez le mode Off-market dans la recherche",
        "Repérez le bien mystère grâce aux indices",
        "Cliquez dessus pour enregistrer votre participation",
      ],
      cta: "Recherche Off-market",
      accent: "#3B5998",
      image: "/images/luxembourg-hero-luxe.png",
      imageAlt: "Capture recherche Off-market",
      layout: "capture",
      action: () => navigate("/search?mode=offmarket"),
    },
    {
      id: 3,
      title: "Parrainage",
      subtitle: "Partagez · Invitez · Gagnez",
      reward: "1 mois PREMIUM",
      rewardText: "text-[#1E40AF]",
      description:
        "Invitez vos amis à rejoindre Colibi grâce à votre lien de parrainage unique. Plus vous partagez, plus vous débloquez de récompenses exclusives.",
      challenge: "Dès que 5 amis souscrivent à un abonnement, vous recevez 1 mois PREMIUM offert.",
      steps: [
        "Copiez votre lien de parrainage personnel",
        "Partagez-le avec vos amis et votre réseau",
        "Suivez l'avancement de vos filleuls en temps réel",
      ],
      cta: "Partager mon lien",
      accent: "#3B5998",
      image: "/images/paris-hero-luxe.png",
      imageAlt: "Capture landing page Colibi",
      layout: "browser",
      action: () => navigate("/login?redirect=/account/referrals"),
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#1f2933]">
      {/* ══════════════════════════════
          HEADER BAND
          ══════════════════════════════ */}
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
                <span className="border border-[#d6d0c6] bg-white/50 px-3 py-1">
                  Concours
                </span>
                <span className="border border-[#FBBF24]/40 bg-[#FBBF24]/15 px-3 py-1 text-[#8a5b00]">
                  Biens mystères
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-[0.08em] text-[#222c35] sm:text-5xl lg:text-6xl">
                Comment participer ?
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#546372] sm:text-base">
                Trouvez le bien mystère avec Immogo, découvrez-le en Off-market, ou invitez vos amis
                pour débloquer votre mois PREMIUM offert. Trois jeux, trois chances de gagner.
              </p>

              {/* Reward pills */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 border border-[#3B5998]/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3B5998] shadow-sm backdrop-blur-xl">
                  <Trophy className="h-3.5 w-3.5" />
                  2 × 500€ à gagner
                </div>
                <div className="inline-flex items-center gap-2 border border-[#3B5998]/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3B5998] shadow-sm backdrop-blur-xl">
                  <Crown className="h-3.5 w-3.5" />
                  1 mois PREMIUM offert
                </div>
                <div className="inline-flex items-center gap-2 border border-[#FBBF24]/30 bg-[#FBBF24]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a5b00] shadow-sm backdrop-blur-xl">
                  <Sparkles className="h-3.5 w-3.5" />
                  Offre de lancement
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ══════════════════════════════
          GAMES — SEAMLESS ALTERNATING
          ══════════════════════════════ */}
      <section className="divide-y divide-[#d6d0c6] border-b border-[#d6d0c6]">
        {games.map((game, index) => (
          <GameSection key={game.id} game={game} reverse={index % 2 !== 0} />
        ))}
      </section>

      {/* ══════════════════════════════
          BOTTOM CTA
          ══════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate("/contest")}
        className="group relative cursor-pointer overflow-hidden rounded-[20px] bg-[#3B5998] shadow-[0_20px_50px_rgba(59,89,152,0.25)] transition hover:shadow-[0_24px_60px_rgba(59,89,152,0.35)]"
      >
        {/* ── Background watermark text ── */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none whitespace-nowrap text-[120px] font-black uppercase leading-none tracking-tighter text-white/[0.05] sm:text-[160px]">
            CONCOURS · CONCOURS
          </span>
        </div>

        {/* Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FBBF24]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[#FBBF24]/10 blur-3xl" />

        {/* ── Layout: Mascot LEFT · Headline CENTER · Numbers + CTA RIGHT ── */}
        <div className="relative z-10 grid grid-cols-1 items-center gap-4 px-6 py-6 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:px-10 sm:py-7">
          {/* LEFT — Mascot */}
          <div className="hidden items-center sm:flex">
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              src="/images/mascot-loop.gif"
              alt="Mascotte Colibi"
              className="w-24 sm:w-28"
            />
          </div>

          {/* CENTER — Big headline */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBBF24] backdrop-blur-sm">
              <Gift className="h-3.5 w-3.5" />
              Colibi fête son lancement
            </div>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.06em] text-white sm:text-3xl">
              Prêt à tenter votre chance ?
            </h2>
            <p className="mt-2 text-sm text-blue-100/60">
              Commencez dès maintenant — le premier à trouver gagne.
            </p>
          </div>

          {/* RIGHT — Prize + CTA */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            {/* CTA */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="group inline-flex items-center gap-2 bg-[#FBBF24] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a2535] transition hover:bg-[#f59e0b]"
              >
                <MapPin className="h-4 w-4" />
                Retour à l'accueil
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Users className="h-4 w-4" />
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>

      <Footer market={activeMarket} />
    </main>
  );
}