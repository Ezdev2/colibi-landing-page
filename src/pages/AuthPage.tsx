import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type FormMode = "login" | "register";

const socialProviders = [
  {
    name: "Google",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    bg: "bg-white",
    hover: "hover:bg-gray-50",
    border: "border-gray-200",
  },
  {
    name: "Facebook",
    icon: (
      <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    bg: "bg-white",
    hover: "hover:bg-gray-50",
    border: "border-gray-200",
  },
];

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08 + 0.2, duration: 0.4, ease: "easeOut" },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.45, duration: 0.4, ease: "easeOut" },
  },
};

export default function AuthPage() {
  const [mode, setMode] = useState<FormMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsLoading(false);
    navigate(redirect);
  };

  const tabs = [
    { id: "login" as FormMode, label: "Connexion" },
    { id: "register" as FormMode, label: "Créer un compte" },
  ];

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="relative min-h-screen overflow-hidden bg-[#f6f3ed]"
    >
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#3B5998]/5 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#3B5998]/8 blur-[100px]" />
        <div className="absolute left-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-blue-100/30 blur-[80px]" />
      </div>

      {/* ── BACK LINK ── */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute left-6 top-6 z-30"
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3d4e5c] backdrop-blur-xl transition hover:border-[#3B5998]/40 hover:text-[#3B5998]"
        >
          <ChevronLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          Accueil
        </Link>
      </motion.div>

      {/* ── MAIN GRID ── */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/40 shadow-[0_24px_64px_rgba(20,28,40,0.10)] backdrop-blur-2xl lg:flex-row lg:min-h-[640px]">

          {/* ═══════════════════════════════════════
              LEFT PANEL — Branding / Mascot
              ═══════════════════════════════════════ */}
          <div className="relative hidden lg:flex lg:w-[440px] lg:flex-col lg:justify-between lg:overflow-hidden lg:rounded-l-[28px] lg:px-10 lg:py-12">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B5998] to-[#1e3a6e]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_30%,rgba(255,255,255,0.12),transparent)]" />

            {/* Decorative dots */}
            <div className="absolute right-8 top-16 grid grid-cols-3 gap-3 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-white"
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Logo area */}
              <div className="mb-10 flex items-center gap-3">
                <img src="/images/logo-white.png" alt="Logo colibi" className="w-40" />
              </div>

              <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
                Votre prochaine
                <br />
                <span className="text-blue-200">adresse commence</span>
                <br />
                ici.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-blue-100/70">
                Accédez à des milliers de biens d'exception en France et en
                Belgique. Recherche classique, IA ou off-market; tout est à
                portée de main.
              </p>
            </div>

            {/* Mascot + trust badges */}
            <div className="relative z-10">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute" />
                  <img
                    src="/images/mascot-loop.gif"
                    alt="Mascotte Colibi"
                    className="relative w-44"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-blue-100/50">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Données sécurisées
                </div>
                <div className="h-3 w-px bg-blue-100/20" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  FR & BE
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              RIGHT PANEL — Form
              ═══════════════════════════════════════ */}
          <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B5998]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#1a2535]">
                COLAR
              </span>
            </div>

            {/* Header text */}
            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={mode + "-title"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-2xl font-black tracking-tight text-[#1a2535] sm:text-3xl"
                >
                  {mode === "login" ? "Bon retour parmi nous" : "Rejoignez la communauté"}
                </motion.h1>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={mode + "-sub"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="mt-2 text-sm text-[#617182]"
                >
                  {mode === "login"
                    ? "Connectez-vous pour accéder à vos favoris et recherches."
                    : "Créez votre compte et commencez à chercher votre bien idéal."}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* ── TAB SWITCHER ── */}
            {/* <div className="mb-7 inline-flex rounded-full border border-white/60 bg-white/50 p-1 shadow-sm backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  className={`relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    mode === tab.id ? "text-white" : "text-[#617182] hover:text-[#3d4e5c]"
                  }`}
                >
                  <AnimatePresence>
                    {mode === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-[#3B5998] shadow-[0_4px_14px_rgba(59,89,152,0.3)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div> */}

            {/* ── SOCIAL LOGIN ── */}
            <div className="mb-7 flex gap-3">
              {socialProviders.map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border ${provider.border} ${provider.bg} px-4 py-3 text-sm font-semibold text-[#283340] transition ${provider.hover} hover:shadow-md`}
                >
                  {provider.icon}
                  <span className="hidden sm:inline">{provider.name}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="mb-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#cad2de] to-transparent" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a8795]">
                ou par e-mail
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#cad2de] to-transparent" />
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    key="register-fields"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <AnimatedInput
                        index={0}
                        icon={User}
                        placeholder="Prénom"
                        value={form.firstName}
                        onChange={(v) => setForm((c) => ({ ...c, firstName: v }))}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        type="text"
                      />
                      <AnimatedInput
                        index={1}
                        icon={User}
                        placeholder="Nom"
                        value={form.lastName}
                        onChange={(v) => setForm((c) => ({ ...c, lastName: v }))}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => setFocusedField(null)}
                        type="text"
                      />
                    </div>
                    <AnimatedInput
                      index={2}
                      icon={Phone}
                      placeholder="Téléphone"
                      value={form.phone}
                      onChange={(v) => setForm((c) => ({ ...c, phone: v }))}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      type="tel"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatedInput
                index={mode === "register" ? 3 : 0}
                icon={Mail}
                placeholder="Adresse e-mail"
                value={form.email}
                onChange={(v) => setForm((c) => ({ ...c, email: v }))}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                type="email"
              />

              <AnimatedInput
                index={mode === "register" ? 4 : 1}
                icon={Lock}
                placeholder="Mot de passe"
                value={form.password}
                onChange={(v) => setForm((c) => ({ ...c, password: v }))}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                type={showPassword ? "text" : "password"}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#7a8795] transition hover:text-[#3B5998]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />

              {mode === "register" && (
                <AnimatePresence>
                  <motion.div
                    key="confirm-password"
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={5}
                  >
                    <AnimatedInput
                      index={5}
                      icon={Lock}
                      placeholder="Confirmer le mot de passe"
                      value={form.confirmPassword}
                      onChange={(v) => setForm((c) => ({ ...c, confirmPassword: v }))}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      type={showPassword ? "text" : "password"}
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Remember / Forgot (login only) */}
              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#cad2de] text-[#3B5998] focus:ring-[#3B5998]/30 accent-[#3B5998]"
                    />
                    <span className="text-xs font-medium text-[#617182]">
                      Se souvenir de moi
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#3B5998] transition hover:text-[#1e3a6e]"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {/* Terms (register only) */}
              {mode === "register" && (
                <p className="text-[10px] leading-relaxed text-[#7a8795]">
                  En créant un compte, vous acceptez nos{" "}
                  <button type="button" className="font-semibold text-[#3B5998] underline underline-offset-2">
                    Conditions d'utilisation
                  </button>{" "}
                  et notre{" "}
                  <button type="button" className="font-semibold text-[#3B5998] underline underline-offset-2">
                    Politique de confidentialité
                  </button>
                  .
                </p>
              )}

              {/* ── SUBMIT BUTTON ── */}
              <motion.button
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-2xl bg-[#3B5998] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(59,89,152,0.28)] transition hover:brightness-110 disabled:opacity-70"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform group-hover:translate-x-full duration-700" />

                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span>
                        {mode === "login" ? "Se connecter" : "Créer mon compte"}
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* ── FOOTER TEXT ── */}
            <p className="mt-8 text-center text-xs text-[#7a8795]">
              {mode === "login" ? (
                <>
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-[#3B5998] transition hover:text-[#1e3a6e]"
                  >
                    Créer un compte
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-[#3B5998] transition hover:text-[#1e3a6e]"
                  >
                    Se connecter
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ANIMATED INPUT COMPONENT ── */
function AnimatedInput({
  index,
  icon: Icon,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  type = "text",
  rightIcon,
}: {
  index: number;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  type?: string;
  rightIcon?: React.ReactNode;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      variants={inputVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      custom={index}
    >
      <div
        className={`group relative overflow-hidden rounded-2xl border bg-white/60 px-4 py-3.5 backdrop-blur-sm transition-all duration-300 ${
          isFocused
            ? "border-[#3B5998] shadow-[0_0_0_3px_rgba(59,89,152,0.1)]"
            : "border-white/70 shadow-sm hover:border-[#cad2de]"
        }`}
      >
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isFocused ? "text-[#3B5998]" : "text-[#7a8795]"}`} />

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          className="w-full bg-transparent pl-10 pr-10 text-sm font-semibold text-[#283340] outline-none placeholder:text-[#7a8795]"
          autoComplete={type === "email" ? "email" : type === "password" ? "current-password" : "off"}
        />

        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}

        {/* Focus line animation */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              layoutId={`focusLine-${index}`}
              className="absolute bottom-0 left-0 h-0.5 bg-[#3B5998]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}