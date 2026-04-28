import { useState } from "react";
import TopBar from "@/components/slicer/TopBar";
import ToolRail, { type Tab } from "@/components/slicer/ToolRail";
import PlateViewer from "@/components/slicer/PlateViewer";
import SettingsPanel from "@/components/slicer/SettingsPanel";
import StatusBar from "@/components/slicer/StatusBar";

const Index = () => {
  const [tab, setTab] = useState<Tab>("prepare");
  const [stlFile, setStlFile] = useState<File | null>(null);

  const handleFile = (file: File | null) => {
    setStlFile(file);
    if (!file) setTab("prepare");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar fileName={stlFile?.name ?? null} onFileSelected={handleFile} />
      <div className="flex flex-1 overflow-hidden">
        <ToolRail activeTab={tab} onTabChange={setTab} previewEnabled={!!stlFile} />
        <main className="flex flex-1 flex-col overflow-hidden">
          <PlateViewer mode={tab} fileName={stlFile?.name ?? null} file={stlFile} onFileSelected={handleFile} />
        </main>
        <SettingsPanel />
      </div>
      <StatusBar />
    </div>
  );
};

export default Index;
