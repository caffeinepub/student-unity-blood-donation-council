import { BloodGroup } from "../backend";

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  [BloodGroup.aPositive]: "A+",
  [BloodGroup.aNegative]: "A-",
  [BloodGroup.bPositive]: "B+",
  [BloodGroup.bNegative]: "B-",
  [BloodGroup.abPositive]: "AB+",
  [BloodGroup.abNegative]: "AB-",
  [BloodGroup.oPositive]: "O+",
  [BloodGroup.oNegative]: "O-",
};

export const BLOOD_GROUP_COLORS: Record<
  BloodGroup,
  { bg: string; text: string; border: string }
> = {
  [BloodGroup.aPositive]: { bg: "#FEECEC", text: "#8B0000", border: "#F5BABA" },
  [BloodGroup.aNegative]: { bg: "#F9E0E0", text: "#6B0000", border: "#EFA5A5" },
  [BloodGroup.bPositive]: { bg: "#EAF0FB", text: "#1A4FA0", border: "#AECAF5" },
  [BloodGroup.bNegative]: { bg: "#DDE8F8", text: "#0F3580", border: "#92B9F0" },
  [BloodGroup.abPositive]: {
    bg: "#F3EDFB",
    text: "#5B1A9A",
    border: "#CEAFF0",
  },
  [BloodGroup.abNegative]: {
    bg: "#EBE2F8",
    text: "#3D0F7A",
    border: "#B895E8",
  },
  [BloodGroup.oPositive]: { bg: "#E8F6EE", text: "#155A30", border: "#9DD4B3" },
  [BloodGroup.oNegative]: { bg: "#DCEEE5", text: "#0A3D1F", border: "#7EC49C" },
};

export const BLOOD_GROUP_OPTIONS: BloodGroup[] = [
  BloodGroup.aPositive,
  BloodGroup.aNegative,
  BloodGroup.bPositive,
  BloodGroup.bNegative,
  BloodGroup.abPositive,
  BloodGroup.abNegative,
  BloodGroup.oPositive,
  BloodGroup.oNegative,
];

export const DAYS_120_MS = 120 * 24 * 60 * 60 * 1000;

export function nanosToMs(ns: bigint): number {
  return Number(ns) / 1_000_000;
}

export function getDonationEligibility(lastDonation?: bigint): {
  isEligible: boolean;
  daysLeft: number;
  nextEligibleDate: Date | null;
} {
  if (!lastDonation) {
    return { isEligible: true, daysLeft: 0, nextEligibleDate: null };
  }
  const lastMs = nanosToMs(lastDonation);
  const nextMs = lastMs + DAYS_120_MS;
  const now = Date.now();
  const daysLeft = Math.ceil((nextMs - now) / 86_400_000);
  return {
    isEligible: now >= nextMs,
    daysLeft: Math.max(0, daysLeft),
    nextEligibleDate: new Date(nextMs),
  };
}

export function timeAgo(ns: bigint): string {
  const ms = nanosToMs(ns);
  const diffMs = Date.now() - ms;
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function dateToNanoseconds(dateStr: string): bigint {
  const ms = new Date(dateStr).getTime();
  return BigInt(ms) * 1_000_000n;
}

export function nanosecondsToDateStr(ns: bigint): string {
  const ms = nanosToMs(ns);
  const d = new Date(ms);
  return d.toISOString().split("T")[0];
}
