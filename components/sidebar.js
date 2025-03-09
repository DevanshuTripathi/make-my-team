import { useState } from "react";
import { FaTachometerAlt, FaUsers } from "react-icons/fa"; // Importing icons

export default function Sidebar({ onSelectSection }) {
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section

  const handleSelect = (section) => {
    setActiveSection(section);
    onSelectSection(section);
  };

  return (
    <div className="p-6 space-y-4">
      <button
        className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "dashboard" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("dashboard")}
      >
        <FaTachometerAlt size={20} /> {/* Dashboard Icon */}
        Dashboard
      </button>

      <button
        className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "teams" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("teams")}
      >
        <FaUsers size={20} /> {/* Teams Icon */}
        My Teams
      </button>
      <button
  className={`block w-full text-left p-3 rounded-lg ${
    activeSection === "tasks" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
  }`}
  onClick={() => handleSelect("tasks")}
>
  Task Management
</button>
    </div>
  );
}
