"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import DashboardContent from "@/components/dashboardcontent";
import TeamsSection from "@/components/teamsection";
import TaskManagement from "@/components/TaskManagement"; // Import
import UserProfileSettings from "@/components/profile/userprofilesetting";


export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50">
        <Sidebar onSelectSection={setSelectedSection} />
      </div>
      

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64 p-6">
   
        {selectedSection === "dashboard" && <DashboardContent />}
       
        {selectedSection === "teams" && <TeamsSection />}
        {selectedSection === "tasks" && <TaskManagement />} {/* Show task manager */}
        {selectedSection === "settings" && <UserProfileSettings />}
      </div>
    </div>
  );
}
