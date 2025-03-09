import { useState } from "react";
import { FaTachometerAlt, FaUsers, FaTasks, FaUserCog, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";

export default function Sidebar({ onSelectSection }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { theme, setTheme } = useTheme();

  const handleSelect = (section) => {
    setActiveSection(section);
    onSelectSection(section); // ✅ Ensure it updates the main content
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6 space-y-4 fixed">
      <button
        className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("dashboard")}
      >
        <FaTachometerAlt size={20} />
        Dashboard
      </button>

      <button
        className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "teams" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("teams")}
      >
        <FaUsers size={20} />
        My Teams
      </button>

      <button
        className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "tasks" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("tasks")}
      >
        <FaTasks size={20} />
        Task Management
      </button>

      <button
        className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "settings" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("settings")}
      >
        <FaUserCog size={20} />
        User Settings
      </button>

      <button
        className="flex items-center w-full text-left p-3 rounded-lg gap-3 hover:bg-gray-700"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
