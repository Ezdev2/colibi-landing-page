// // src/shared/components/ContestPromo.tsx
// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   X,
//   Gift,
//   Trophy,
//   ArrowRight,
//   Sparkles,
//   ChevronRight,
//   PartyPopper,
//   Star,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const STORAGE_KEY = "colibi_contest_dismissed";

// export function ContestPromo() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [showBanner, setShowBanner] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const wasDismissed = sessionStorage.getItem(STORAGE_KEY);
//     if (wasDismissed) {
//       setShowBanner(true);
//     } else {
//       // Small delay so the page loads first
//       const timer = setTimeout(() => setShowPopup(true), 1200);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const dismissPopup = () => {
//     setShowPopup(false);
//     setShowBanner(true);
//     sessionStorage.setItem(STORAGE_KEY, "true");
//   };

//   const goToContest = () => {
//     setShowPopup(false);
//     setShowBanner(true);
//     sessionStorage.setItem(STORAGE_KEY, "true");
//     navigate("/contest");
//   };

//   return (
//     <>
//       {/* ═══════════════════════════════════════════════
//           THIN TOP BANNER (visible after popup dismissed)
//           ═══════════════════════════════════════════════ */}
//       <AnimatePresence>
//         {showBanner && !showPopup && (
//           <motion.div
//             initial={{ y: -40, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -40, opacity: 0 }}
//             transition={{ duration: 0.35, ease: "easeOut" }}
//             className="left-0 right-0 top-0 z-[60] cursor-pointer"
//             onClick={goToContest}
//           >
//             <div className="relative overflow-hidden bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B]">
//               {/* Animated shimmer */}
//               <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

//               <div className="relative flex items-center justify-center gap-2 px-4 py-2">
//                 <PartyPopper className="h-3.5 w-3.5 text-[#92400E]" />
//                 <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#78350F]">
//                   Concours Colibi - Gagnez 500€ + 1 mois PREMIUM
//                 </p>
//                 <ChevronRight className="h-3.5 w-3.5 text-[#92400E]" />
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowBanner(false);
//                   }}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#92400E]/60 transition hover:bg-white/30 hover:text-[#78350F]"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ═══════════════════════════════════════════════
//           PROMO POPUP (on first visit)
//           ═══════════════════════════════════════════════ */}
//       <AnimatePresence>
//         {showPopup && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
//               onClick={dismissPopup}
//             />

//             {/* Modal */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.85, y: 30 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{
//                 duration: 0.45,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="fixed inset-0 z-[80] flex items-center justify-center px-4"
//             >
//               <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-yellow-200/50 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.18)]">
//                 {/* ── TOP GOLD BANNER ── */}
//                 <div className="relative overflow-hidden bg-gradient-to-br from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] px-6 py-5 text-center">
//                   {/* Confetti-like dots */}
//                   <div className="pointer-events-none absolute inset-0">
//                     {[...Array(12)].map((_, i) => (
//                       <motion.div
//                         key={i}
//                         className="absolute rounded-full"
//                         style={{
//                           width: Math.random() * 6 + 4,
//                           height: Math.random() * 6 + 4,
//                           left: `${Math.random() * 100}%`,
//                           top: `${Math.random() * 100}%`,
//                           backgroundColor:
//                             i % 3 === 0
//                               ? "#fff"
//                               : i % 3 === 1
//                               ? "#3B5998"
//                               : "#FDE68A",
//                           opacity: 0.4,
//                         }}
//                         animate={{
//                           y: [0, -8, 0],
//                           opacity: [0.3, 0.6, 0.3],
//                         }}
//                         transition={{
//                           duration: 2 + Math.random() * 2,
//                           repeat: Infinity,
//                           delay: Math.random() * 2,
//                         }}
//                       />
//                     ))}
//                   </div>

//                   {/* Animated shimmer */}
//                   <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

//                   <div className="relative">
//                     <div className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#78350F] backdrop-blur-sm">
//                       <Star className="h-3 w-3" />
//                       Offre de lancement
//                       <Star className="h-3 w-3" />
//                     </div>
//                     <h2 className="mt-2 text-2xl font-black tracking-tight text-[#78350F] sm:text-3xl">
//                       Colibi fête son lancement !
//                     </h2>
//                   </div>
//                 </div>

//                 {/* ── CLOSE BUTTON ── */}
//                 <button
//                   type="button"
//                   onClick={dismissPopup}
//                   className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-[#78350F] backdrop-blur-sm transition hover:bg-white/60"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>

//                 {/* ── BODY ── */}
//                 <div className="px-6 pb-6 pt-5">
//                   {/* Mascot + Message */}
//                   <div className="flex items-center gap-6">
//                     {/* Mascot */}
//                     <div className="relative flex-shrink-0">
//                       <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#FBBF24]/40 to-[#3B5998]/20 blur-lg" />
//                       <img
//                         src="/images/mascot-loop.gif"
//                         alt="Mascotte Colibi"
//                         className="relative w-28 rounded-2xl object-cover"
//                       />
//                       {/* Badge */}
//                       <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#3B5998] text-white shadow-lg">
//                         <Gift className="h-3.5 w-3.5" />
//                       </div>
//                     </div>

//                     {/* Text */}
//                     <div className="flex-1 pt-1">
//                       <p className="text-sm leading-relaxed text-[#4B5563]">
//                         Retrouvez le{" "}
//                         <strong className="text-[#1a2535]">bien mystère</strong> ou
//                         invitez vos amis pour tenter de gagner des{" "}
//                         <strong className="text-[#1a2535]">récompenses exclusives</strong>.
//                       </p>

//                       {/* Rewards */}
//                       <div className="mt-4 flex flex-wrap gap-2">
//                         <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] px-3 py-1.5 text-[11px] font-bold text-[#92400E] shadow-sm">
//                           <Trophy className="h-3.5 w-3.5" />
//                           500€ à gagner
//                         </div>
//                         <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] px-3 py-1.5 text-[11px] font-bold text-[#1E40AF] shadow-sm">
//                           <Sparkles className="h-3.5 w-3.5" />
//                           1 mois PREMIUM
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* CTA */}
//                   <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
//                     <button
//                       type="button"
//                       onClick={goToContest}
//                       className="group flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_24px_rgba(245,158,11,0.35)] transition hover:shadow-[0_14px_32px_rgba(245,158,11,0.45)] hover:brightness-105"
//                     >
//                       <Trophy className="h-4 w-4" />
//                       Participer au concours
//                       <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//                     </button>
//                     <button
//                       type="button"
//                       onClick={dismissPopup}
//                       className="rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-xs font-semibold text-[#6B7280] transition hover:border-[#3B5998]/30 hover:text-[#3B5998]"
//                     >
//                       Plus tard
//                     </button>
//                   </div>

//                   {/* Fine print */}
//                   <p className="mt-4 text-center text-[10px] text-[#9CA3AF]">
//                     Concours valable jusqu'au 31 août 2026 · Voir{" "}
//                     <button
//                       type="button"
//                       onClick={goToContest}
//                       className="underline underline-offset-2 hover:text-[#3B5998]"
//                     >
//                       les règles complètes
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


// src/shared/components/ContestPromo.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronRight,
  PartyPopper,
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
                  Concours Colibi - Gagnez 500€ + 1 mois PREMIUM
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
              onClick={dismissPopup}
            />

            {/* Modal */}
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
    </>
  );
}