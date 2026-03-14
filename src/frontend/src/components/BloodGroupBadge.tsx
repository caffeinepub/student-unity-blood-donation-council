import type { BloodGroup } from "../backend";
import { BLOOD_GROUP_COLORS, BLOOD_GROUP_LABELS } from "../utils/helpers";

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup;
  size?: "sm" | "md" | "lg";
}

export function BloodGroupBadge({
  bloodGroup,
  size = "md",
}: BloodGroupBadgeProps) {
  const label = BLOOD_GROUP_LABELS[bloodGroup];
  const colors = BLOOD_GROUP_COLORS[bloodGroup];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 font-semibold min-w-[32px]",
    md: "text-sm px-2.5 py-1 font-bold min-w-[40px]",
    lg: "text-base px-3 py-1.5 font-bold min-w-[48px]",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md ${sizeClasses[size]} text-center`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {label}
    </span>
  );
}
