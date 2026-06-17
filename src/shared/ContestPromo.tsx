// src/shared/components/ContestPromo.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronRight,
  PartyPopper,
  Trophy,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "colibi_contest_dismissed";

export function ContestPromo() {
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY);
    if (wasDismissed) {
      setShowBanner(true);
    } else {
      const timer = setTimeout(() => setShowPopup(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    setShowBanner(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  const goToContest = () => {
    setShowPopup(false);
    setShowBanner(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
    navigate("/contest");
  };

  const offers = [
    {
      icon: Trophy,
      title: "Trouvez la tanière de Colo !",
      reward: "1 AN D'ABONNEMENT PREMIUM",
      type: "Concours 1",
    },
    {
      icon: Search,
      title: "Quartier sens dessus dessous",
      reward: "1 AN D'ABONNEMENT AU 1ER COMMENTAIRE",
      type: "Concours 2",
    },
    {
      icon: Users,
      title: "Un ami pour Colo !",
      reward: "PROGRAMME DE PARRAINAGE",
      type: "Parrainage",
    },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════
          THIN TOP BANNER
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showBanner && !showPopup && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="left-0 right-0 top-0 z-[60] cursor-pointer"
            onClick={goToContest}
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B]">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              <div className="relative flex items-center justify-center gap-2 px-4 py-2">
                <PartyPopper className="h-3.5 w-3.5 text-[#92400E]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#78350F]">
                  Pour son lancement, Colibi vous comble de cadeaux - Gagnez jusqu'à 500€ + 1 mois PREMIUM
                </p>
                <ChevronRight className="h-3.5 w-3.5 text-[#92400E]" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBanner(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#92400E]/60 transition hover:bg-white/30 hover:text-[#78350F]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          PROMO POPUP — AD STYLE (300x250 inspired)
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
              onClick={dismissPopup}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed inset-0 z-[80] flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-[580px] overflow-hidden rounded-[24px] bg-[#3B5998] shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
                {/* ── BACKGROUND DECORATIONS ── */}
                {/* Giant faded text watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                  <span className="select-none text-[180px] font-black uppercase leading-none tracking-tighter text-white/[0.04]">
                    GAGNEZ
                  </span>
                </div>

                {/* Outlined text bottom */}
                <div className="pointer-events-none absolute bottom-2 left-0 right-0 overflow-hidden">
                  <span
                    className="block whitespace-nowrap text-center text-[44px] font-black uppercase leading-none tracking-tight"
                    style={{
                      WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                      color: "transparent",
                    }}
                  >
                    biens mystères · biens mystères
                  </span>
                </div>

                {/* Subtle radial glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FBBF24]/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[#FBBF24]/10 blur-3xl" />

                {/* ── CLOSE BUTTON ── */}
                <button
                  type="button"
                  onClick={dismissPopup}
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* ── MAIN CONTENT (2 columns like the ad) ── */}
                <div className="relative z-10 flex items-stretch px-6 py-7 sm:px-8 sm:py-8">
                  {/* LEFT — Mascot */}
                  <div className="relative flex w-[42%] items-center justify-center">
                    <div className="relative">
                      {/* Glow behind mascot */}
                      <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-[#FBBF24]/40 to-transparent blur-2xl" />
                      <motion.img
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        src="/images/mascot-loop.gif"
                        alt="Mascotte Colibi"
                        className="relative w-44 sm:w-48"
                      />
                    </div>
                  </div>

                  {/* RIGHT — Text */}
                  <div className="flex w-[58%] flex-col justify-center pl-4 text-right sm:pl-6">
                    {/* Big SALE-style headline */}
                    <h2 className="text-[42px] font-black uppercase leading-[0.95] tracking-tight text-[#FBBF24] sm:text-[52px]">
                      Concours
                    </h2>
                    <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.12em] text-white sm:text-sm">
                      Biens mystères
                    </p>

                    {/* "up to" */}
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      à gagner
                    </p>

                    {/* Big number */}
                    <p className="mt-0.5 text-[44px] font-black leading-none tracking-tight text-white sm:text-[52px]">
                      500€
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FBBF24]">
                      + 1 mois PREMIUM
                    </p>

                    {/* CTA Button — white like the reference */}
                    <button
                      type="button"
                      onClick={goToContest}
                      className="group mt-5 inline-flex items-center justify-center gap-2 self-end rounded-md bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#1a2535] shadow-lg transition hover:bg-[#FBBF24] hover:shadow-xl"
                    >
                      Participer
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>

                {/* ── BOTTOM FINE PRINT ── */}
                <div className="relative z-10 border-t border-white/10 px-6 py-2.5 text-center">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                    Offre de lancement · valable jusqu'au 31/08/2026
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* <AnimatePresence>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none text-[180px] font-black uppercase leading-none tracking-tighter text-white/[0.04]">
            GAGNEZ
          </span>
        </div>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md"
              onClick={dismissPopup}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
            >
              <div className="relative w-full max-w-[720px] overflow-hidden rounded-[28px] bg-[#3B5998] shadow-[0_32px_100px_rgba(0,0,0,0.5)] border border-white/10">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                  <span className="select-none text-[220px] font-black uppercase leading-none tracking-tighter text-white/[0.02]">
                    COLIBI
                  </span>
                </div>
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#FBBF24]/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#3B5998]/50 border border-[#FBBF24]/10 blur-2xl" />

                <button
                  type="button"
                  onClick={dismissPopup}
                  className="absolute right-5 top-5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30 hover:scale-105 active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 px-6 pb-8 pt-4 sm:px-8">
                  <div className="relative hidden md:block flex flex-col w-[42%] items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-[#FBBF24]/40 to-transparent blur-2xl" />
                      <motion.img
                        src="/images/mascot-loop.gif"
                        alt="Mascotte Colibi"
                        className="relative w-44 sm:w-64"
                      />
                    </div>
                    
                  </div>

                  <div className="flex flex-col justify-between gap-3 sm:w-[70%]">
                    <div className="relative z-10 pt-16 px-6 sm:px-8 text-center sm:text-right">
                      <h2 className="text-[36px] sm:text-[52px] font-black uppercase leading-[0.95] tracking-tight text-white">
                        Offres de <br />{" "}
                        <span className="text-[#FBBF24]">Lancement</span>
                      </h2>
                    </div>
                    <div className="space-y-2.5">
                      {offers.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={index}
                            className="group/card flex items-center gap-4 bg-white/10 rounded-2xl p-3.5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:translate-x-1"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBBF24] text-[#3B5998] shadow-md shadow-black/10">
                              <IconComponent className="h-5 w-5 stroke-[2.5]" />
                            </div>

                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-black tracking-widest text-[#FBBF24] uppercase opacity-80">
                                {item.type}
                              </span>
                              <h4 className="text-[14px] font-black text-white leading-snug truncate uppercase tracking-tight mt-0.5">
                                {item.title}
                              </h4>
                              <p className="text-[11px] font-bold text-white/70 tracking-wide mt-0.5">
                                À gagner :{" "}
                                <span className="text-[#FBBF24] decoration-2">
                                  {item.reward}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={goToContest}
                      className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[13px] font-black uppercase tracking-[0.2em] text-[#1a2535] shadow-xl transition-all duration-300 hover:bg-[#FBBF24] hover:shadow-2xl hover:scale-[1.01]"
                    >
                      Participer aux concours
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence> */}

      <AnimatePresence>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none text-[180px] font-black uppercase leading-none tracking-tighter text-white/[0.04]">
            GAGNEZ
          </span>
        </div>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-md"
              onClick={dismissPopup}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
            >
              <div className="relative w-full max-w-[840px] overflow-hidden rounded-[28px] bg-[#3B5998] shadow-[0_32px_100px_rgba(0,0,0,0.5)] border border-white/10">
                {/* Filigranes et Halos de fond */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                  <span className="select-none text-[220px] font-black uppercase leading-none tracking-tighter text-white/[0.02]">
                    COLIBI
                  </span>
                </div>
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#FBBF24]/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#3B5998]/50 border border-[#FBBF24]/10 blur-2xl" />

                {/* LA ROUTE EN PERSPECTIVE (Dessinée selon ton croquis sur edited-image.jpg) */}
                <div
                  className="absolute left-0 bottom-0 top-0 w-[60%] bg-gradient-to-b from-white/[0.08] to-white/[0.01] pointer-events-none z-0 border-r border-white/10 hidden md:block"
                  style={{
                    clipPath:
                      "polygon(0% 10%, 35% 35%, 55% 65%, 75% 100%, 0% 100%)",
                  }}
                >
                  {/* Lignes horizontales de perspective (Marquages bleus de ton croquis, gérés ici en blanc transparent premium) */}
                  <div className="absolute inset-0 flex flex-col justify-around opacity-45 pt-[30%] pb-[5%] px-4">
                    <div className="w-full border-b border-white/20 transform -rotate-1" />
                    <div className="w-full border-b border-white/20 transform -rotate-2 scale-x-110" />
                    <div className="w-full border-b border-white/25 transform -rotate-3 scale-x-125" />
                    <div className="w-full border-b border-white/30 transform -rotate-3 scale-x-150" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={dismissPopup}
                  className="absolute right-5 top-5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30 hover:scale-105 active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-6 pb-8 pt-4 sm:px-8">
                  {/* LEFT — MASCOT (Posée sur la route) */}
                  <div className="relative hidden md:flex flex-col items-center justify-center self-stretch min-h-[360px]">
                    <div className="relative flex flex-col items-center justify-center w-full">
                      {/* Petit halo sous le panda pour l'ancrer sur sa piste */}
                      <div className="absolute bottom-4 z-0 h-4 w-32 rounded-full bg-black/30 blur-md pointer-events-none" />

                      {/* Mascotte Colibi */}
                      <motion.img
                        src="/images/mascot-loop.gif"
                        alt="Mascotte Colibi"
                        className="relative z-10 w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
                      />
                    </div>
                  </div>

                  {/* RIGHT — CONTENT BLOCK */}
                  <div className="flex flex-col justify-between gap-3 sm:w-[70%]">
                    <div className="relative z-10 pt-16 px-6 sm:px-8 text-center sm:text-right">
                      <h2 className="text-[36px] sm:text-[52px] font-black uppercase leading-[0.95] tracking-tight text-white">
                        Offres de <br />{" "}
                        <span className="text-[#FBBF24]">Lancement</span>
                      </h2>
                    </div>
                    <div className="space-y-2.5">
                      {offers.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={index}
                            className="group/card flex items-center gap-4 bg-white/10 rounded-2xl p-3.5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:translate-x-1"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBBF24] text-[#3B5998] shadow-md shadow-black/10">
                              <IconComponent className="h-5 w-5 stroke-[2.5]" />
                            </div>

                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-black tracking-widest text-[#FBBF24] uppercase opacity-80">
                                {item.type}
                              </span>
                              <h4 className="text-[14px] font-black text-white leading-snug truncate uppercase tracking-tight mt-0.5">
                                {item.title}
                              </h4>
                              <p className="text-[11px] font-bold text-white/70 tracking-wide mt-0.5">
                                À gagner :{" "}
                                <span className="text-[#FBBF24] decoration-2">
                                  {item.reward}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={goToContest}
                      className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[13px] font-black uppercase tracking-[0.2em] text-[#1a2535] shadow-xl transition-all duration-300 hover:bg-[#FBBF24] hover:shadow-2xl hover:scale-[1.01]"
                    >
                      Participer aux concours
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
