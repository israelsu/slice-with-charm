import { ChevronRight, Droplets, Layers3, Printer, Settings, Shield, Thermometer, Wind, Wrench, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

type SettingsTab = "process" | "filament" | "printer";

const tabs: { id: SettingsTab; label: string; icon: typeof Layers3 }[] = [
  { id: "process", label: "Process", icon: Layers3 },
  { id: "filament", label: "Filament", icon: Droplets },
  { id: "printer", label: "Printer", icon: Printer },
];

const SettingRow = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="flex-1 min-w-0">
      <div className="text-xs text-foreground">{label}</div>
      {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
    </div>
    <div className="w-[140px] shrink-0">{children}</div>
  </div>
);

const Section = ({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: typeof Layers3;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-[var(--transition-smooth)] hover:bg-surface-raised hover:text-foreground"
      >
        <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        <Icon className="h-3.5 w-3.5" />
        <span>{title}</span>
      </button>
      {open && <div className="space-y-1 px-4 pb-3 pt-1">{children}</div>}
    </div>
  );
};

const NumberField = ({
  value,
  unit,
  onChange,
}: {
  value: string;
  unit?: string;
  onChange?: (v: string) => void;
}) => (
  <div className="relative">
    <Input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-7 bg-surface pr-8 text-right font-mono text-xs"
    />
    {unit && (
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
        {unit}
      </span>
    )}
  </div>
);

const Select = ({ value, options }: { value: string; options: string[] }) => (
  <div className="relative">
    <select
      defaultValue={value}
      className="h-7 w-full appearance-none rounded-md border border-input bg-surface px-2 pr-6 text-xs text-foreground outline-none transition-[var(--transition-smooth)] focus:ring-1 focus:ring-ring"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
    <ChevronRight className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-90 text-muted-foreground" />
  </div>
);

const SettingsPanel = () => {
  const [tab, setTab] = useState<SettingsTab>("process");
  const [layerHeight, setLayerHeight] = useState([0.2]);
  const [infill, setInfill] = useState([15]);

  return (
    <aside className="flex w-[340px] flex-col border-l border-border bg-panel shadow-panel">
      {/* Preset header */}
      <div className="border-b border-border p-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Active Preset</div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-accent" />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">0.20mm Standard @ Voron</div>
            <div className="text-[10px] text-muted-foreground">Modified · not saved</div>
          </div>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-raised hover:text-foreground">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-[var(--transition-smooth)]",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {active && <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full bg-primary shadow-glow" />}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {tab === "process" && (
          <>
            <Section icon={Layers3} title="Quality">
              <SettingRow label="Layer height" hint="Bottom layers auto-adjusted">
                <div className="flex items-center gap-2">
                  <Slider value={layerHeight} onValueChange={setLayerHeight} min={0.08} max={0.32} step={0.04} className="flex-1" />
                  <span className="w-10 text-right font-mono text-xs text-foreground">{layerHeight[0].toFixed(2)}</span>
                </div>
              </SettingRow>
              <SettingRow label="Line width"><NumberField value="0.42" unit="mm" /></SettingRow>
              <SettingRow label="Wall loops"><NumberField value="3" /></SettingRow>
              <SettingRow label="Top shells"><NumberField value="5" /></SettingRow>
              <SettingRow label="Bottom shells"><NumberField value="4" /></SettingRow>
              <SettingRow label="Seam position"><Select value="Aligned" options={["Aligned", "Nearest", "Random", "Back"]} /></SettingRow>
            </Section>

            <Section icon={Wrench} title="Strength">
              <SettingRow label="Sparse infill density">
                <div className="flex items-center gap-2">
                  <Slider value={infill} onValueChange={setInfill} min={0} max={100} step={5} className="flex-1" />
                  <span className="w-10 text-right font-mono text-xs text-foreground">{infill[0]}%</span>
                </div>
              </SettingRow>
              <SettingRow label="Infill pattern"><Select value="Gyroid" options={["Gyroid", "Grid", "Cubic", "Honeycomb", "Lightning"]} /></SettingRow>
              <SettingRow label="Ironing"><Switch /></SettingRow>
            </Section>

            <Section icon={Zap} title="Speed" defaultOpen={false}>
              <SettingRow label="Outer wall"><NumberField value="150" unit="mm/s" /></SettingRow>
              <SettingRow label="Inner wall"><NumberField value="280" unit="mm/s" /></SettingRow>
              <SettingRow label="Sparse infill"><NumberField value="350" unit="mm/s" /></SettingRow>
              <SettingRow label="Travel"><NumberField value="500" unit="mm/s" /></SettingRow>
            </Section>

            <Section icon={Shield} title="Supports" defaultOpen={false}>
              <SettingRow label="Enable supports"><Switch /></SettingRow>
              <SettingRow label="Threshold angle"><NumberField value="45" unit="°" /></SettingRow>
              <SettingRow label="Style"><Select value="Tree (organic)" options={["Normal", "Tree (organic)", "Snug"]} /></SettingRow>
            </Section>
          </>
        )}

        {tab === "filament" && (
          <>
            <Section icon={Droplets} title="Material">
              <SettingRow label="Type"><Select value="PLA" options={["PLA", "PETG", "ABS", "ASA", "TPU", "Nylon"]} /></SettingRow>
              <SettingRow label="Vendor"><Select value="Polymaker" options={["Generic", "Polymaker", "Prusament", "Bambu", "eSun"]} /></SettingRow>
              <SettingRow label="Color">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-gradient-accent ring-1 ring-border" />
                  <span className="text-xs text-muted-foreground">Ocean</span>
                </div>
              </SettingRow>
              <SettingRow label="Diameter"><NumberField value="1.75" unit="mm" /></SettingRow>
              <SettingRow label="Flow ratio"><NumberField value="0.98" /></SettingRow>
            </Section>

            <Section icon={Thermometer} title="Temperature">
              <SettingRow label="Nozzle · first layer"><NumberField value="215" unit="°C" /></SettingRow>
              <SettingRow label="Nozzle · other layers"><NumberField value="210" unit="°C" /></SettingRow>
              <SettingRow label="Bed · first layer"><NumberField value="60" unit="°C" /></SettingRow>
              <SettingRow label="Bed · other layers"><NumberField value="55" unit="°C" /></SettingRow>
            </Section>

            <Section icon={Wind} title="Cooling" defaultOpen={false}>
              <SettingRow label="Part fan"><NumberField value="100" unit="%" /></SettingRow>
              <SettingRow label="Minimum layer time"><NumberField value="8" unit="s" /></SettingRow>
            </Section>
          </>
        )}

        {tab === "printer" && (
          <>
            <Section icon={Printer} title="Machine">
              <SettingRow label="Printer"><Select value="Voron 2.4 350" options={["Voron 2.4 350", "Bambu X1C", "Prusa MK4", "Creality K1 Max"]} /></SettingRow>
              <SettingRow label="Nozzle"><Select value="0.4 mm Hardened" options={["0.2 mm", "0.4 mm Hardened", "0.6 mm", "0.8 mm"]} /></SettingRow>
              <SettingRow label="Build volume"><NumberField value="350 × 350 × 350" /></SettingRow>
            </Section>
            <Section icon={Zap} title="Motion">
              <SettingRow label="Max accel · print"><NumberField value="7000" unit="mm/s²" /></SettingRow>
              <SettingRow label="Max accel · travel"><NumberField value="10000" unit="mm/s²" /></SettingRow>
              <SettingRow label="Input shaper"><Switch /></SettingRow>
              <SettingRow label="Pressure advance"><NumberField value="0.042" /></SettingRow>
            </Section>
          </>
        )}
      </div>
    </aside>
  );
};

export default SettingsPanel;