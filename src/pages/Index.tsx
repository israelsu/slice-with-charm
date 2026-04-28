import { useState } from "react";
import TopBar from "@/components/slicer/TopBar";
import ToolRail, { type Tab } from "@/components/slicer/ToolRail";
import PlateViewer from "@/components/slicer/PlateViewer";
import SettingsPanel from "@/components/slicer/SettingsPanel";
import StatusBar from "@/components/slicer/StatusBar";

const Index = () => {
  const [tab, setTab] = useState<Tab>("prepare");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ToolRail activeTab={tab} onTabChange={setTab} />
        <main className="flex flex-1 flex-col overflow-hidden">
          <PlateViewer mode={tab} />
        </main>
        <SettingsPanel />
      </div>
      <StatusBar />
    </div>
  );
};

export default Index;
