import { Button } from "@/components/ui/button";
import { Droplets, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// Static dot positions for background pattern (avoids array index key warning)
const BG_DOTS = [
  { w: 5, h: 6, l: 13, t: 8 },
  { w: 3, h: 4, l: 29, t: 21 },
  { w: 7, h: 5, l: 45, t: 35 },
  { w: 4, h: 7, l: 61, t: 48 },
  { w: 6, h: 3, l: 77, t: 62 },
  { w: 3, h: 5, l: 8, t: 74 },
  { w: 5, h: 4, l: 24, t: 88 },
  { w: 7, h: 6, l: 40, t: 15 },
  { w: 4, h: 3, l: 56, t: 29 },
  { w: 6, h: 7, l: 72, t: 43 },
  { w: 3, h: 5, l: 88, t: 57 },
  { w: 5, h: 4, l: 17, t: 71 },
  { w: 7, h: 3, l: 33, t: 85 },
  { w: 4, h: 6, l: 49, t: 6 },
  { w: 6, h: 5, l: 65, t: 20 },
  { w: 3, h: 7, l: 81, t: 33 },
  { w: 5, h: 4, l: 97, t: 47 },
  { w: 7, h: 6, l: 5, t: 61 },
  { w: 4, h: 3, l: 21, t: 75 },
  { w: 6, h: 5, l: 37, t: 90 },
];

export function AuthScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Top decorative section */}
      <div
        className="relative flex-shrink-0 flex flex-col items-center justify-center pt-16 pb-12 px-6"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.37 0.14 22) 0%, oklch(0.28 0.12 22) 100%)",
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {BG_DOTS.map((dot) => (
            <div
              key={`dot-${dot.l}-${dot.t}`}
              className="absolute rounded-full bg-white"
              style={{
                width: `${dot.w}px`,
                height: `${dot.h}px`,
                left: `${dot.l}%`,
                top: `${dot.t}%`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-5 shadow-lg">
            <Droplets size={40} className="text-white" />
          </div>

          <h1 className="font-display text-3xl text-white text-center leading-tight mb-2">
            Student Unity
          </h1>
          <h2 className="font-display text-xl text-white/80 text-center leading-tight mb-4">
            Blood Donation Council
          </h2>
          <p className="text-white/70 text-center text-sm max-w-[260px] font-body leading-relaxed">
            Connect donors. Save lives.
          </p>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="flex divide-x divide-border bg-card shadow-xs">
        {[
          { value: "2,400+", label: "Registered Donors" },
          { value: "800+", label: "Lives Saved" },
          { value: "120+", label: "Universities" },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 py-4 px-2 text-center">
            <div className="text-lg font-display font-bold text-primary">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground font-body">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-[320px] flex flex-col gap-4"
        >
          <div className="text-center mb-4">
            <h3 className="font-display text-xl text-foreground mb-2">
              Join the Network
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              Sign in securely to access the blood donor network and help save
              lives in your community.
            </p>
          </div>

          <Button
            data-ocid="auth.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-card"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...
              </>
            ) : (
              "Sign In Securely"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center font-body">
            Powered by Internet Identity — no password required
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="pb-8 px-6 text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
