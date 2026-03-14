import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Droplets, MessageCircle, Phone, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { EmergencyRequest } from "../backend";
import { BloodGroupBadge } from "../components/BloodGroupBadge";
import { CreateRequestModal } from "../components/CreateRequestModal";
import { useActiveRequests } from "../hooks/useQueries";
import { timeAgo } from "../utils/helpers";

type SampleRequest = EmergencyRequest & { _id: number };

const SAMPLE_REQUESTS: SampleRequest[] = [
  {
    _id: 1,
    bloodGroup: "aPositive" as EmergencyRequest["bloodGroup"],
    hospital: "St. Mary's Medical Center",
    units: 2n,
    contactName: "Dr. Sarah Chen",
    contactPhone: "+1 555 010 2345",
    isActive: true,
    requester: { toString: () => "sample" } as any,
    timestamp: BigInt(Date.now() - 30 * 60 * 1000) * 1_000_000n,
  },
  {
    _id: 2,
    bloodGroup: "oNegative" as EmergencyRequest["bloodGroup"],
    hospital: "City General Hospital",
    units: 1n,
    contactName: "James Miller",
    contactPhone: "+1 555 020 3456",
    isActive: true,
    requester: { toString: () => "sample" } as any,
    timestamp: BigInt(Date.now() - 2 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    _id: 3,
    bloodGroup: "bPositive" as EmergencyRequest["bloodGroup"],
    hospital: "University Health Center",
    units: 3n,
    contactName: "Maria Santos",
    contactPhone: "+1 555 030 4567",
    isActive: true,
    requester: { toString: () => "sample" } as any,
    timestamp: BigInt(Date.now() - 5 * 60 * 60 * 1000) * 1_000_000n,
  },
];

export function HomeFeed() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: requests, isLoading } = useActiveRequests();

  const displayRequests: (EmergencyRequest | SampleRequest)[] =
    requests && requests.length > 0 ? requests : SAMPLE_REQUESTS;

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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Droplets size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl text-white leading-tight">
              Blood Requests
            </h1>
            <p className="text-white/70 text-xs font-body">
              {displayRequests.length} active request
              {displayRequests.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        {isLoading ? (
          <div data-ocid="feed.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : displayRequests.length === 0 ? (
          <div data-ocid="feed.empty_state" className="py-16 text-center">
            <Droplets
              size={40}
              className="text-muted-foreground mx-auto mb-3 opacity-40"
            />
            <h3 className="font-display text-lg text-foreground mb-1">
              No Active Requests
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              No emergency blood requests at the moment.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {displayRequests.map((req, idx) => {
              const sample = req as SampleRequest;
              const itemKey: string | number = sample._id ?? `req-${idx}`;
              return (
                <motion.div
                  key={itemKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  data-ocid={`feed.item.${idx + 1}`}
                  className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="h-1 bg-primary" />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <BloodGroupBadge
                          bloodGroup={req.bloodGroup}
                          size="lg"
                        />
                        <div>
                          <div className="font-semibold text-sm text-foreground leading-tight">
                            {req.hospital}
                          </div>
                          <div className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-0.5">
                            <Clock size={11} />
                            {timeAgo(req.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-muted-foreground font-body">
                          Units needed
                        </div>
                        <div className="text-xl font-display font-bold text-primary">
                          {req.units.toString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground font-body">
                        Contact:{" "}
                        <span className="text-foreground font-medium">
                          {req.contactName}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        data-ocid={`feed.primary_button.${idx + 1}`}
                        className="h-8 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                        onClick={() => {
                          if (req.contactPhone) {
                            window.open(`tel:${req.contactPhone}`);
                          }
                        }}
                      >
                        <Phone size={12} className="mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        data-ocid="feed.open_modal_button"
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-4 max-[430px]:right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 z-40"
        style={{ boxShadow: "0 4px 20px rgba(139,0,0,0.4)" }}
      >
        <Plus size={24} />
      </button>

      <CreateRequestModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Info banner */}
      <div className="mx-4 mb-4 p-3 rounded-xl bg-accent border border-border flex items-center gap-3">
        <MessageCircle size={16} className="text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground font-body">
          Tap <span className="font-semibold text-foreground">+</span> to post
          an emergency request. Matching donors nearby will be notified.
        </p>
      </div>
    </div>
  );
}
