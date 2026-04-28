import { Grid3x3, Maximize2, Orbit, Ruler, Target, ZoomIn, ZoomOut, Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState, type DragEvent } from "react";
import StlMesh from "./StlMesh";

interface PlateViewerProps {
  mode: "prepare" | "preview" | "device";
  fileName?: string | null;
  file?: File | null;
  onFileSelected?: (file: File | null) => void;
}

const PlateViewer = ({ mode, fileName, file, onFileSelected }: PlateViewerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const pickFile = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!/\.stl$/i.test(file.name)) return;
    onFileSelected?.(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files);
  };

  return (
    <div
      className="relative flex-1 overflow-hidden bg-gradient-plate"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".stl,model/stl,application/vnd.ms-pki.stl"
        className="hidden"
        onChange={(e) => {
          pickFile(e.target.files);
          e.target.value = "";
        }}
      />
      {/* Real STL viewer */}
      {file && (
        <div className="absolute inset-0">
          <StlMesh file={file} mode={mode} />
        </div>
      )}

      {/* Grid floor (decorative — only when no file) */}
      {!file && (
      <>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Plate mock */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ perspective: "1200px" }}>
          <div
            className="relative h-[360px] w-[520px] rounded-sm border border-primary/30 bg-surface/60 shadow-[0_40px_80px_-30px_hsl(var(--primary)/0.35)]"
            style={{ transform: "rotateX(58deg) rotateZ(-18deg)" }}
          >
            {/* Build plate grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--primary) / 0.18) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.18) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
            {/* Plate label */}
            <div className="absolute -top-6 left-0 text-[10px] uppercase tracking-[0.2em] text-primary/80">
              Plate 1 · 256 × 256 mm
            </div>

            {/* Fake model: layered cylinder */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-40 w-40">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute left-1/2 top-1/2 rounded-full border",
                      mode === "preview"
                        ? "border-accent/60 bg-accent/10"
                        : "border-primary/50 bg-primary/10"
                    )}
                    style={{
                      width: `${120 - i * 2}px`,
                      height: `${120 - i * 2}px`,
                      transform: `translate(-50%, -50%) translateZ(${i * 6}px)`,
                      boxShadow: "0 0 12px hsl(var(--primary) / 0.25)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Preview scan line */}
            {mode === "preview" && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scan-line bg-accent shadow-[0_0_12px_hsl(var(--accent))]" />
            )}
          </div>
        </div>
      </div>
      </>
      )}

      {/* Axis gizmo */}
      <div className="absolute bottom-4 left-4 flex h-20 w-20 items-center justify-center rounded-md border border-border bg-panel/80 backdrop-blur">
        <div className="relative h-12 w-12">
          <div className="absolute left-1/2 top-1/2 h-[2px] w-10 origin-left bg-destructive" style={{ transform: "translate(0,-50%) rotate(-20deg)" }} />
          <div className="absolute left-1/2 top-1/2 h-[2px] w-10 origin-left bg-primary" style={{ transform: "translate(0,-50%) rotate(200deg)" }} />
          <div className="absolute left-1/2 top-1/2 h-10 w-[2px] origin-top bg-accent" style={{ transform: "translate(-50%, 0) rotate(-5deg)" }} />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
        </div>
      </div>

      {/* Viewport controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-1 rounded-md border border-border bg-panel/80 p-1 backdrop-blur">
        {[Orbit, ZoomIn, ZoomOut, Maximize2, Grid3x3, Ruler, Target].map((Icon, i) => (
          <Button key={i} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Empty-state upload overlay */}
      {!fileName && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => inputRef.current?.click()}
            className={cn(
              "pointer-events-auto flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-panel/70 px-10 py-8 text-center backdrop-blur transition-[var(--transition-smooth)]",
              dragOver
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border hover:border-primary/60 hover:bg-panel/90"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Upload className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">Drop an STL here</span>
              <span className="text-xs text-muted-foreground">or click to browse · .stl files only</span>
            </div>
          </button>
        </div>
      )}

      {/* Loaded-file chip */}
      {fileName && (
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-border bg-panel/80 px-3 py-1.5 text-xs backdrop-blur">
          <FileUp className="h-3.5 w-3.5 text-primary" />
          <span className="max-w-[280px] truncate text-foreground" title={fileName}>
            {fileName}
          </span>
        </div>
      )}

      {/* Bottom info strip */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-md border border-border bg-panel/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
        <span>
          <span className="text-foreground font-medium">1</span> object
        </span>
        <span className="h-3 w-px bg-border" />
        <span>
          Triangles <span className="text-foreground font-medium">42,168</span>
        </span>
        <span className="h-3 w-px bg-border" />
        <span>
          Volume <span className="text-foreground font-medium">38.4 cm³</span>
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary shadow-glow" />
          GPU · OK
        </span>
      </div>
    </div>
  );
};

export default PlateViewer;