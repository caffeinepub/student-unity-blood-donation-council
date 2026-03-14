import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Clock,
  HeartPulse,
  Phone,
  Plus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { EmergencyRequest } from "../backend";
import { BloodGroupBadge } from "../components/BloodGroupBadge";
import { CreateRequestModal } from "../components/CreateRequestModal";
import {
  useActiveRequests,
  useDeactivateRequest,
  useIsAdmin,
} from "../hooks/useQueries";
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
    bloodGroup: "abNegative" as EmergencyRequest["bloodGroup"],
    hospital: "Downtown Trauma Center",
    units: 4n,
    contactName: "Dr. Ravi Patel",
    contactPhone: "+1 555 030 4567",
    isActive: true,
    requester: { toString: () => "sample" } as any,
    timestamp: BigInt(Date.now() - 4 * 60 * 60 * 1000) * 1_000_000n,
  },
  {
    _id: 4,
    bloodGroup: "bNegative" as EmergencyRequest["bloodGroup"],
    hospital: "Lakeside Children's Hospital",
    units: 2n,
    contactName: "Nurse Emma Walsh",
    contactPhone: "+1 555 040 5678",
    isActive: true,
    requester: { toString: () => "sample" } as any,
    timestamp: BigInt(Date.now() - 8 * 60 * 60 * 1000) * 1_000_000n,
  },
];

export function EmergencyRequests() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: requests, isLoading } = useActiveRequests();
  const deactivate = useDeactivateRequest();
  const { data: isAdmin } = useIsAdmin();

  const displayRequests: (EmergencyRequest | SampleRequest)[] =
    requests && requests.length > 0 ? requests : SAMPLE_REQUESTS;

  const handleResolve = async (id: bigint) => {
    try {
      await deactivate.mutateAsync(id);
      toast.success("Request marked as resolved");
    } catch {
      toast.error("Failed to resolve request");
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 relative"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.37 0.14 22) 0%, oklch(0.30 0.12 22) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <HeartPulse size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl text-white">
                Emergency Requests
              </h1>
              <p className="text-white/70 text-xs font-body">
                {displayRequests.length} active
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs font-body">
              All blood groups
            </div>
            <div className="text-white text-sm font-semibold">Urgent</div>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2.5">
        <Users size={15} className="text-primary flex-shrink-0" />
        <p className="text-xs text-red-800 font-body">
          If you can help, click <strong>I Can Help</strong> and contact the
          requester immediately.
        </p>
      </div>

      {/* List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div data-ocid="emergency.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : displayRequests.length === 0 ? (
          <div data-ocid="emergency.empty_state" className="py-16 text-center">
            <HeartPulse
              size={40}
              className="text-muted-foreground mx-auto mb-3 opacity-30"
            />
            <h3 className="font-display text-lg text-foreground mb-1">
              No Active Requests
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              All requests have been fulfilled.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {displayRequests.map((req, idx) => {
              const sample = req as SampleRequest;
              const reqId =
                sample._id !== undefined ? BigInt(sample._id) : null;
              const itemKey: string | number = sample._id ?? `req-${idx}`;
              return (
                <motion.div
                  key={itemKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.06 }}
                  data-ocid={`emergency.item.${idx + 1}`}
                  className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
                >
                  <div className="h-1 bg-primary" />
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <BloodGroupBadge bloodGroup={req.bloodGroup} size="lg" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-foreground">
                          {req.hospital}
                        </div>
                        <div className="text-xs text-muted-foreground font-body flex items-center gap-1">
                          <Clock size={11} /> {timeAgo(req.timestamp)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Units
                        </div>
                        <div className="text-xl font-display font-bold text-primary">
                          {req.units.toString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-muted-foreground font-body">
                        Contact:
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {req.contactName}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        data-ocid={`emergency.primary_button.${idx + 1}`}
                        className="flex-1 h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                        onClick={() => window.open(`tel:${req.contactPhone}`)}
                      >
                        <Phone size={13} className="mr-1" />I Can Help
                      </Button>

                      {isAdmin && reqId !== null && (
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`emergency.secondary_button.${idx + 1}`}
                          onClick={() => handleResolve(reqId)}
                          disabled={deactivate.isPending}
                          className="h-9 px-3 text-xs rounded-lg border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={13} className="mr-1" />
                          Resolved
                        </Button>
                      )}
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
        data-ocid="emergency.open_modal_button"
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 z-40"
        style={{ boxShadow: "0 4px 20px rgba(139,0,0,0.4)" }}
      >
        <Plus size={24} />
      </button>

      <CreateRequestModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
