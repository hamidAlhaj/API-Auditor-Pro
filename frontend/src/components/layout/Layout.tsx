import { useState } from "react";
import type { TabId } from "../../types";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Tabs from "./Tabs";
import RequestBuilder from "../request/RequestBuilder";
import CollectionsTab from "../collections/CollectionsTab";
import ScannerTab from "../scanner/ScannerTab";
import HistoryTab from "../history/HistoryTab";
import EnvironmentTab from "../environment/EnvironmentTab";

export default function Layout() {
  const [activeTab, setActiveTab] = useState<TabId>("builder");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="container">
      {/* طبقة سوداء شفافة تغلق القائمة عند الضغط عليها في الموبايل */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <div className="main">
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Tabs
          active={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false); // إغلاق القائمة عند اختيار تبويب
          }}
        />

        {activeTab === "builder" && <RequestBuilder />}
        {activeTab === "collections" && <CollectionsTab />}
        {activeTab === "scanner" && <ScannerTab />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "envs" && <EnvironmentTab />}
      </div>
    </div>
  );
}
