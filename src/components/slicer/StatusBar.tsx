import { Clock, Ruler, Thermometer, Weight, Zap } from "lucide-react";

const Stat = ({ icon: Icon, label, value, accent }: { icon: typeof Clock; label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center gap-2">
    <Icon className={`h-3.5 w-3.5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
    <div className="flex flex-col leading-tight">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`font-mono text-xs ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  </div>
);

const StatusBar = () => {
  return (
    <footer className="flex h-12 items-center justify-between border-t border-border bg-panel px-4">
      <div className="flex items-center gap-6">
        <Stat icon={Clock} label="Est. print time" value="4h 28m" accent />
        <Stat icon={Weight} label="Filament" value="46.82 g" />
        <Stat icon={Ruler} label="Length" value="15.7 m" />
        <Stat icon={Thermometer} label="Cost" value="$1.24" />
        <Stat icon={Zap} label="Layers" value="148" />
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" /> Ready
        </span>
        <span>Units: mm</span>
        <span>FPS 60</span>
      </div>
    </footer>
  );
};

export default StatusBar;