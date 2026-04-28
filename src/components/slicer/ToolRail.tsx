import { Box, Eye, HardDrive, Move3d, RotateCcw, Scale, Scissors, Magnet, Wand2, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Tab = "prepare" | "preview" | "device";

const mainTabs: { id: Tab; label: string; icon: typeof Box }[] = [
  { id: "prepare", label: "Prepare", icon: Box },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "device", label: "Device", icon: HardDrive },
];

const tools = [
  { icon: Move3d, label: "Move" },
  { icon: RotateCcw, label: "Rotate" },
  { icon: Scale, label: "Scale" },
  { icon: Scissors, label: "Cut" },
  { icon: Magnet, label: "Auto-arrange" },
  { icon: Wand2, label: "Auto-orient" },
  { icon: PenTool, label: "Support paint" },
];

interface ToolRailProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  previewEnabled?: boolean;
}

const ToolRail = ({ activeTab, onTabChange, previewEnabled = true }: ToolRailProps) => {
  const [activeTool, setActiveTool] = useState<string>("Move");

  return (
    <aside className="flex w-16 flex-col items-center gap-1 border-r border-border bg-panel py-3">
      {mainTabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        const disabled = tab.id === "preview" && !previewEnabled;
        return (
          <button
            key={tab.id}
            onClick={() => !disabled && onTabChange(tab.id)}
            disabled={disabled}
            title={disabled ? "Import an STL file to enable Preview" : tab.label}
            className={cn(
              "group flex w-full flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium uppercase tracking-wider transition-[var(--transition-smooth)]",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              disabled && "cursor-not-allowed opacity-40 hover:text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-md transition-[var(--transition-smooth)]",
                active ? "bg-primary/10 shadow-glow" : "group-hover:bg-surface-raised"
              )}
            >
              <Icon className="h-4 w-4" />
              {active && (
                <span className="absolute -left-[7px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
              )}
            </span>
            {tab.label}
          </button>
        );
      })}

      <div className="my-2 h-px w-8 bg-border" />

      {tools.map((tool) => {
        const Icon = tool.icon;
        const active = activeTool === tool.label;
        return (
          <button
            key={tool.label}
            onClick={() => setActiveTool(tool.label)}
            title={tool.label}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-[var(--transition-smooth)]",
              active
                ? "bg-surface-raised text-foreground ring-1 ring-primary/40"
                : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        );
      })}
    </aside>
  );
};

export default ToolRail;
export type { Tab };