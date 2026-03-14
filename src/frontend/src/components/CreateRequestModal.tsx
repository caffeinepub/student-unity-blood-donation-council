import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Principal } from "@icp-sdk/core/principal";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroup } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateRequest } from "../hooks/useQueries";
import { BLOOD_GROUP_LABELS, BLOOD_GROUP_OPTIONS } from "../utils/helpers";

interface CreateRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRequestModal({ open, onClose }: CreateRequestModalProps) {
  const { identity } = useInternetIdentity();
  const createRequest = useCreateRequest();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(
    BloodGroup.aPositive,
  );
  const [hospital, setHospital] = useState("");
  const [units, setUnits] = useState("1");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    try {
      await createRequest.mutateAsync({
        bloodGroup,
        hospital,
        units: BigInt(units || "1"),
        contactName,
        contactPhone,
        isActive: true,
        requester: identity.getPrincipal() as Principal,
        timestamp: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Emergency request posted!");
      onClose();
      setHospital("");
      setUnits("1");
      setContactName("");
      setContactPhone("");
    } catch {
      toast.error("Failed to post request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="request.dialog"
        className="max-w-[400px] mx-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary">
            Post Emergency Request
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Blood Group Needed
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUP_OPTIONS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                    bloodGroup === bg
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary hover:border-primary/40"
                  }`}
                >
                  {BLOOD_GROUP_LABELS[bg]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="hospital" className="text-sm font-medium">
              Hospital Name
            </Label>
            <Input
              id="hospital"
              data-ocid="request.input"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="e.g. City General Hospital"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="units" className="text-sm font-medium">
              Units Required
            </Label>
            <Input
              id="units"
              type="number"
              min="1"
              max="10"
              data-ocid="request.input"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactName" className="text-sm font-medium">
              Contact Person
            </Label>
            <Input
              id="contactName"
              data-ocid="request.input"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Full name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactPhone" className="text-sm font-medium">
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              data-ocid="request.input"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              required
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="request.cancel_button"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="request.submit_button"
              disabled={createRequest.isPending}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...
                </>
              ) : (
                "Post Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
