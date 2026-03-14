import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Droplets, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroup, type UserProfile, UserRole } from "../backend";
import { useSaveProfile } from "../hooks/useQueries";
import {
  BLOOD_GROUP_LABELS,
  BLOOD_GROUP_OPTIONS,
  dateToNanoseconds,
} from "../utils/helpers";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(
    BloodGroup.aPositive,
  );
  const [role, setRole] = useState<UserRole>(UserRole.donor);
  const [city, setCity] = useState("");
  const [lastDonationDate, setLastDonationDate] = useState("");
  const [isMobilePublic, setIsMobilePublic] = useState(true);

  const saveProfile = useSaveProfile();

  const isDonor = role === UserRole.donor || role === UserRole.both;

  const canProceedStep1 =
    fullName.trim() && mobileNumber.trim() && universityId.trim();
  const canProceedStep3 = city.trim();

  const handleSubmit = async () => {
    const profile: UserProfile = {
      fullName,
      mobileNumber,
      universityId,
      bloodGroup,
      role,
      city,
      isMobilePublic,
      isVerified: false,
      donationCount: 0n,
      lastDonation:
        isDonor && lastDonationDate
          ? dateToNanoseconds(lastDonationDate)
          : undefined,
    };
    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Profile created! Welcome to the network.");
      onComplete(profile);
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const roleOptions = [
    {
      value: UserRole.donor,
      label: "Donor",
      desc: "I want to donate blood",
      emoji: "🩸",
    },
    {
      value: UserRole.recipient,
      label: "Recipient",
      desc: "I need blood for myself or others",
      emoji: "🏥",
    },
    {
      value: UserRole.both,
      label: "Both",
      desc: "I donate and may need blood",
      emoji: "❤️",
    },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <div
        className="px-6 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.37 0.14 22) 0%, oklch(0.28 0.12 22) 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Droplets size={16} className="text-white" />
          </div>
          <span className="font-display text-white text-lg">
            Complete Your Profile
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  s <= step
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
        <p className="text-white/70 text-xs mt-2 font-body">Step {step} of 4</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl text-foreground">
                Your Details
              </h2>
              <p className="text-muted-foreground text-sm font-body">
                Tell us about yourself
              </p>

              <div className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="fullName" className="font-medium text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    data-ocid="profile.input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="mt-1.5 h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile" className="font-medium text-sm">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    data-ocid="profile.input"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="mt-1.5 h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="universityId" className="font-medium text-sm">
                    University / Org ID
                  </Label>
                  <Input
                    id="universityId"
                    data-ocid="profile.input"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    placeholder="e.g. STU-2024-0042"
                    className="mt-1.5 h-11"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl text-foreground">
                Blood Group
              </h2>
              <p className="text-muted-foreground text-sm font-body">
                Select your blood type
              </p>

              <div className="grid grid-cols-4 gap-3 mt-6">
                {BLOOD_GROUP_OPTIONS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    data-ocid="profile.toggle"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-4 rounded-xl text-sm font-bold border-2 transition-all ${
                      bloodGroup === bg
                        ? "border-primary bg-primary text-primary-foreground shadow-card"
                        : "border-border bg-card hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {BLOOD_GROUP_LABELS[bg]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl text-foreground">
                Your Role
              </h2>
              <p className="text-muted-foreground text-sm font-body">
                How do you want to participate?
              </p>

              <div className="space-y-3 mt-6">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    data-ocid="profile.toggle"
                    onClick={() => setRole(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      role === opt.value
                        ? "border-primary bg-accent shadow-card"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <div>
                      <div
                        className={`font-semibold text-sm ${
                          role === opt.value
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {opt.label}
                      </div>
                      <div className="text-xs text-muted-foreground font-body">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl text-foreground">
                Location & Privacy
              </h2>
              <p className="text-muted-foreground text-sm font-body">
                Help donors and recipients find you
              </p>

              <div className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="city" className="font-medium text-sm">
                    City / Area
                  </Label>
                  <Input
                    id="city"
                    data-ocid="profile.input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York, NY"
                    className="mt-1.5 h-11"
                  />
                </div>

                {isDonor && (
                  <div>
                    <Label
                      htmlFor="lastDonation"
                      className="font-medium text-sm"
                    >
                      Last Donation Date{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="lastDonation"
                      type="date"
                      data-ocid="profile.input"
                      value={lastDonationDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="mt-1.5 h-11"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      Show phone number
                    </div>
                    <div className="text-xs text-muted-foreground font-body">
                      Others can see your number directly
                    </div>
                  </div>
                  <Switch
                    data-ocid="profile.switch"
                    checked={isMobilePublic}
                    onCheckedChange={setIsMobilePublic}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="px-6 pb-10 flex gap-3">
        {step > 1 && (
          <Button
            variant="outline"
            data-ocid="profile.secondary_button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 h-12 rounded-xl"
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </Button>
        )}

        {step < 4 ? (
          <Button
            data-ocid="profile.primary_button"
            disabled={step === 1 && !canProceedStep1}
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue <ChevronRight size={18} className="ml-1" />
          </Button>
        ) : (
          <Button
            data-ocid="profile.submit_button"
            disabled={!canProceedStep3 || saveProfile.isPending}
            onClick={handleSubmit}
            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
