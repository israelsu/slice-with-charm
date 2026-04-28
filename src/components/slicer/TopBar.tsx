import { ChevronDown, Cpu, FileUp, Layers, Play, Save, Settings2, Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopBar = () => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-panel px-4 shadow-panel">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary shadow-glow">
          <Layers className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight text-foreground">OrcaForge</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Slicer Studio · v2.1.0</span>
        </div>

        <div className="mx-4 h-6 w-px bg-border" />

        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {["File", "Edit", "View", "Object", "Help"].map((item) => (
            <button
              key={item}
              className="rounded-md px-2.5 py-1 transition-[var(--transition-smooth)] hover:bg-surface-raised hover:text-foreground"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="mx-2 h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2">
          <FileUp className="h-4 w-4" /> Import STL
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Save className="h-4 w-4" /> Save Project
        </Button>
        <div className="mx-2 h-6 w-px bg-border" />
        <Button size="sm" className="gap-2 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
          <Play className="h-4 w-4 fill-current" /> Slice Plate
        </Button>
        <Button variant="outline" size="sm" className="gap-2 border-border bg-surface-raised">
          <Cpu className="h-4 w-4" /> Export G-code
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;