import { Toaster } from "@/components/ui/sonner";
import { Droplets, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { UserProfile } from "./backend";
import { BottomNav, type TabName } from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile } from "./hooks/useQueries";
import { AuthScreen } from "./pages/AuthScreen";
import { EmergencyRequests } from "./pages/EmergencyRequests";
import { HomeFeed } from "./pages/HomeFeed";
import { MyProfile } from "./pages/MyProfile";
import { ProfileSetup } from "./pages/ProfileSetup";
import { SearchDonors } from "./pages/SearchDonors";

function LoadingScreen() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "oklch(0.37 0.14 22)" }}
      >
        <Droplets size={32} className="text-white pulse-red" />
      </div>
      <Loader2 size={20} className="animate-spin text-primary" />
      <p className="text-sm text-muted-foreground font-body">Loading...</p>
    </div>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabName>("home");

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "home" && <HomeFeed />}
          {activeTab === "search" && <SearchDonors />}
          {activeTab === "profile" && <MyProfile />}
          {activeTab === "emergency" && <EmergencyRequests />}
        </motion.div>
      </AnimatePresence>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function AuthenticatedApp() {
  const { data: profile, isLoading } = useCallerProfile();
  const [completedProfile, setCompletedProfile] = useState<UserProfile | null>(
    null,
  );

  if (isLoading) return <LoadingScreen />;

  const hasProfile = !!profile || !!completedProfile;

  if (!hasProfile) {
    return (
      <div className="app-shell">
        <ProfileSetup onComplete={(p) => setCompletedProfile(p)} />
      </div>
    );
  }

  return <MainApp />;
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) return <LoadingScreen />;

  if (!identity) {
    return (
      <div className="app-shell">
        <AuthScreen />
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <AuthenticatedApp />
      <Toaster />
    </>
  );
}
