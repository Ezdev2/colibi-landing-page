// src/shared/components/ContestBanner.tsx
import { motion } from "framer-motion";
import { ChevronRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ContestBanner() {
  const navigate = useNavigate();

  return (
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
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
              Offre de lancement
            </p>
            <h3 className="mt-0.5 text-3xl font-black uppercase leading-none tracking-tight text-[#FBBF24] sm:text-4xl">
              Concours
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white sm:text-sm">
              Biens mystères Colibi
            </p>
          </div>

          {/* RIGHT — Prize + CTA */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            {/* Prize block */}
            <div className="flex flex-col items-center sm:items-end">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                à gagner
              </p>
              <p className="text-3xl font-black leading-none text-white sm:text-4xl">
                500€
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FBBF24]">
                + 1 mois PREMIUM
              </p>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/contest");
              }}
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#1a2535] shadow-lg transition group-hover:bg-[#FBBF24] group-hover:shadow-xl"
            >
              <Trophy className="h-3.5 w-3.5" />
              Participer
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}