import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  Droplets,
  Edit2,
  Heart,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type BloodGroup, type UserProfile, UserRole } from "../backend";
import { BloodGroupBadge } from "../components/BloodGroupBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useSaveProfile } from "../hooks/useQueries";
import {
  BLOOD_GROUP_LABELS,
  BLOOD_GROUP_OPTIONS,
  dateToNanoseconds,
  getDonationEligibility,
  getInitials,
  nanosecondsToDateStr,
} from "../utils/helpers";

export function MyProfile() {
  const { clear } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();
  const saveProfile = useSaveProfile();
  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  const startEdit = () => {
    if (!profile) return;
    setEditForm({
      fullName: profile.fullName,
      mobileNumber: profile.mobileNumber,
      city: profile.city,
      universityId: profile.universityId,
      bloodGroup: profile.bloodGroup,
      role: profile.role,
      isMobilePublic: profile.isMobilePublic,
      lastDonation: profile.lastDonation,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!profile) return;
    const updated: UserProfile = { ...profile, ...editForm };
    try {
      await saveProfile.mutateAsync(updated);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="profile.loading_state"
        className="page-content px-4 pt-12 space-y-4"
      >
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!profile) return null;

  const eligibility = getDonationEligibility(profile.lastDonation);
  const isDonor =
    profile.role === UserRole.donor || profile.role === UserRole.both;

  return (
    <div className="page-content">
      {/* Hero section */}
      <div
        className="px-5 pt-12 pb-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.37 0.14 22) 0%, oklch(0.28 0.12 22) 100%)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {getInitials(profile.fullName)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl text-white leading-tight">
                  {profile.fullName}
                </h1>
                {profile.isVerified && (
                  <ShieldCheck size={16} className="text-white/80" />
                )}
              </div>
              {profile.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mt-1">
                  <ShieldCheck size={10} /> Verified Student
                </span>
              )}
            </div>
          </div>
          <BloodGroupBadge bloodGroup={profile.bloodGroup} size="lg" />
        </div>

        <div className="flex items-center gap-2 text-white/70 text-xs font-body">
          <span>{profile.city}</span>
          <span>·</span>
          <span className="capitalize">
            {profile.role === UserRole.both
              ? "Donor & Recipient"
              : profile.role}
          </span>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Impact tracker */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-card p-5 flex items-center gap-5"
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.37 0.14 22 / 0.1)" }}
          >
            <Heart size={24} className="text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-body mb-0.5">
              Lives Saved
            </div>
            <div className="font-display text-3xl font-bold text-primary">
              {profile.donationCount.toString()}
            </div>
            <div className="text-xs text-muted-foreground font-body">
              confirmed donations
            </div>
          </div>
        </motion.div>

        {/* Eligibility */}
        {isDonor && (
          <div className="bg-card rounded-2xl border border-border shadow-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={15} className="text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Donation Eligibility
              </span>
            </div>
            {eligibility.isEligible ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Eligible to Donate!
                </span>
                <span className="text-xs text-muted-foreground font-body">
                  {profile.lastDonation
                    ? "120+ days since last donation"
                    : "No previous donation recorded"}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-body">
                    Next eligible donation
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {eligibility.daysLeft} days
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.round(((120 - eligibility.daysLeft) / 120) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Eligible on{" "}
                  {eligibility.nextEligibleDate?.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Profile info */}
        {!editing ? (
          <div className="bg-card rounded-2xl border border-border shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-foreground">
                Profile Details
              </span>
              <Button
                size="sm"
                variant="ghost"
                data-ocid="profile.edit_button"
                onClick={startEdit}
                className="h-8 text-primary hover:bg-accent"
              >
                <Edit2 size={14} className="mr-1" /> Edit
              </Button>
            </div>

            {[
              { label: "University ID", value: profile.universityId },
              { label: "City", value: profile.city },
              {
                label: "Phone",
                value: profile.isMobilePublic
                  ? profile.mobileNumber
                  : "Hidden (private)",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
              >
                <span className="text-xs text-muted-foreground font-body">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-muted-foreground font-body">
                Show phone number
              </span>
              <Switch
                data-ocid="profile.switch"
                checked={profile.isMobilePublic}
                onCheckedChange={async (val) => {
                  try {
                    await saveProfile.mutateAsync({
                      ...profile,
                      isMobilePublic: val,
                    });
                    toast.success(
                      val
                        ? "Phone number is now visible"
                        : "Phone number is now hidden",
                    );
                  } catch {
                    toast.error("Failed to update privacy setting");
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-card p-4 space-y-3">
            <h3 className="font-semibold text-sm text-foreground mb-2">
              Edit Profile
            </h3>

            <div>
              <Label className="text-xs text-muted-foreground">Full Name</Label>
              <Input
                data-ocid="profile.input"
                value={editForm.fullName ?? ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, fullName: e.target.value }))
                }
                className="mt-1 h-10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input
                data-ocid="profile.input"
                value={editForm.city ?? ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, city: e.target.value }))
                }
                className="mt-1 h-10"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Blood Group
              </Label>
              <Select
                value={editForm.bloodGroup}
                onValueChange={(v) =>
                  setEditForm((f) => ({ ...f, bloodGroup: v as BloodGroup }))
                }
              >
                <SelectTrigger data-ocid="profile.select" className="mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUP_OPTIONS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {BLOOD_GROUP_LABELS[bg]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isDonor && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  Last Donation Date
                </Label>
                <Input
                  type="date"
                  data-ocid="profile.input"
                  value={
                    editForm.lastDonation
                      ? nanosecondsToDateStr(editForm.lastDonation)
                      : ""
                  }
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      lastDonation: e.target.value
                        ? dateToNanoseconds(e.target.value)
                        : undefined,
                    }))
                  }
                  className="mt-1 h-10"
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground font-body">
                Show phone number
              </span>
              <Switch
                data-ocid="profile.switch"
                checked={editForm.isMobilePublic ?? true}
                onCheckedChange={(val) =>
                  setEditForm((f) => ({ ...f, isMobilePublic: val }))
                }
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                data-ocid="profile.cancel_button"
                onClick={() => setEditing(false)}
                className="flex-1 h-10"
              >
                Cancel
              </Button>
              <Button
                data-ocid="profile.save_button"
                onClick={handleSave}
                disabled={saveProfile.isPending}
                className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saveProfile.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Sign out */}
        <Button
          variant="ghost"
          data-ocid="profile.secondary_button"
          onClick={() => {
            clear();
            toast.success("Signed out successfully");
          }}
          className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>

      {/* Footer */}
      <footer className="pb-6 px-6 text-center">
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
