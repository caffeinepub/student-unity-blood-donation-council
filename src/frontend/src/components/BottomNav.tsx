import { HeartPulse, Home, Search, User } from "lucide-react";

export type TabName = "home" | "search" | "profile" | "emergency";

interface BottomNavProps {
  activeTab: TabName;
  onChange: (tab: TabName) => void;
}

const tabs: {
  id: TabName;
  label: string;
  Icon: React.FC<{ size?: number; strokeWidth?: number }>;
}[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "search", label: "Search", Icon: Search },
  { id: "profile", label: "Profile", Icon: User },
  { id: "emergency", label: "Emergency", Icon: HeartPulse },
];

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="flex items-stretch">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.link`}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 transition-colors text-xs font-body ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`${isActive ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 bg-primary rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
