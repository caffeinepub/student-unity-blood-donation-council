import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BedDouble, Phone, Search, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BloodGroup, type UserProfile } from "../backend";
import { BloodGroupBadge } from "../components/BloodGroupBadge";
import { useSearchDonors } from "../hooks/useQueries";
import {
  BLOOD_GROUP_LABELS,
  BLOOD_GROUP_OPTIONS,
  getDonationEligibility,
  getInitials,
} from "../utils/helpers";

const SAMPLE_DONORS: UserProfile[] = [
  {
    fullName: "Aditya Kumar",
    bloodGroup: BloodGroup.aPositive,
    city: "New York, NY",
    isVerified: true,
    isMobilePublic: true,
    mobileNumber: "+1 555 001 2345",
    role: "donor" as UserProfile["role"],
    universityId: "NYU-2023-0102",
    donationCount: 5n,
    lastDonation: BigInt(Date.now() - 200 * 24 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    fullName: "Priya Sharma",
    bloodGroup: BloodGroup.oNegative,
    city: "Brooklyn, NY",
    isVerified: true,
    isMobilePublic: false,
    mobileNumber: "+1 555 002 3456",
    role: "both" as UserProfile["role"],
    universityId: "CUNY-2022-0045",
    donationCount: 8n,
    lastDonation: BigInt(Date.now() - 50 * 24 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    fullName: "Marcus Johnson",
    bloodGroup: BloodGroup.bPositive,
    city: "Manhattan, NY",
    isVerified: false,
    isMobilePublic: true,
    mobileNumber: "+1 555 003 4567",
    role: "donor" as UserProfile["role"],
    universityId: "COL-2024-0033",
    donationCount: 2n,
    lastDonation: undefined,
  },
  {
    fullName: "Fatima Al-Hassan",
    bloodGroup: BloodGroup.abPositive,
    city: "Queens, NY",
    isVerified: true,
    isMobilePublic: false,
    mobileNumber: "+1 555 004 5678",
    role: "donor" as UserProfile["role"],
    universityId: "QC-2023-0078",
    donationCount: 12n,
    lastDonation: BigInt(Date.now() - 130 * 24 * 60 * 60 * 1000) * 1_000_000n,
  },
];

export function SearchDonors() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<
    BloodGroup | "all"
  >("all");
  const [cityInput, setCityInput] = useState("");
  const [searchCity, setSearchCity] = useState<string | null>(null);
  const [searchBg, setSearchBg] = useState<BloodGroup | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: donors, isLoading } = useSearchDonors(
    searchBg,
    searchCity,
    hasSearched,
  );

  const displayDonors = hasSearched ? (donors ?? []) : SAMPLE_DONORS;

  const handleSearch = () => {
    setSearchBg(selectedBloodGroup === "all" ? null : selectedBloodGroup);
    setSearchCity(cityInput.trim() || null);
    setHasSearched(true);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.37 0.14 22) 0%, oklch(0.30 0.12 22) 100%)",
        }}
      >
        <h1 className="font-display text-xl text-white mb-1">Find Donors</h1>
        <p className="text-white/70 text-xs font-body">
          Search by blood group and location
        </p>

        {/* Search filters */}
        <div className="mt-4 space-y-2">
          <Select
            value={selectedBloodGroup}
            onValueChange={(v) =>
              setSelectedBloodGroup(v as BloodGroup | "all")
            }
          >
            <SelectTrigger
              data-ocid="search.select"
              className="bg-white/10 border-white/20 text-white h-10 rounded-xl [&>svg]:text-white/70"
            >
              <SelectValue placeholder="All Blood Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {BLOOD_GROUP_OPTIONS.map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {BLOOD_GROUP_LABELS[bg]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              data-ocid="search.search_input"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="City or area"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10 rounded-xl"
            />
            <Button
              data-ocid="search.primary_button"
              onClick={handleSearch}
              disabled={isLoading}
              className="h-10 px-5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90"
            >
              <Search size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-5 space-y-3">
        {!hasSearched && (
          <p className="text-xs text-muted-foreground font-body text-center pb-1">
            Showing sample donors — search to find real donors near you
          </p>
        )}

        {isLoading ? (
          <div data-ocid="search.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : displayDonors.length === 0 ? (
          <div data-ocid="search.empty_state" className="py-16 text-center">
            <Search
              size={36}
              className="text-muted-foreground mx-auto mb-3 opacity-30"
            />
            <h3 className="font-display text-lg text-foreground mb-1">
              No Donors Found
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              Try a different blood group or location.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {displayDonors.map((donor, idx) => (
              <DonorCard
                key={`${donor.universityId}-${donor.fullName}`}
                donor={donor}
                index={idx}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function DonorCard({ donor, index }: { donor: UserProfile; index: number }) {
  const eligibility = getDonationEligibility(donor.lastDonation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      data-ocid={`search.item.${index + 1}`}
      className="bg-card rounded-2xl border border-border shadow-card p-4"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0"
          style={{ background: "oklch(0.37 0.14 22)" }}
        >
          {getInitials(donor.fullName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm text-foreground truncate">
              {donor.fullName}
            </span>
            {donor.isVerified && (
              <ShieldCheck
                size={14}
                className="text-primary flex-shrink-0"
                aria-label="Verified Student"
              />
            )}
          </div>
          <div className="text-xs text-muted-foreground font-body">
            {donor.city}
          </div>
        </div>

        <BloodGroupBadge bloodGroup={donor.bloodGroup} size="md" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {eligibility.isEligible ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
              <BedDouble size={11} />
              Resting · {eligibility.daysLeft}d left
            </span>
          )}
        </div>

        {donor.isMobilePublic ? (
          <Button
            size="sm"
            data-ocid={`search.secondary_button.${index + 1}`}
            variant="outline"
            className="h-8 text-xs rounded-lg border-primary text-primary hover:bg-accent"
            onClick={() => window.open(`tel:${donor.mobileNumber}`)}
          >
            <Phone size={12} className="mr-1" />
            {donor.mobileNumber}
          </Button>
        ) : (
          <Button
            size="sm"
            data-ocid={`search.secondary_button.${index + 1}`}
            className="h-8 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Request Contact
          </Button>
        )}
      </div>
    </motion.div>
  );
}
