import { useState, useEffect } from "react";
import { FaTachometerAlt, FaUsers, FaTasks, FaUserCog, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { useTheme } from "next-themes";
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
if (typeof window !== "undefined" && !app) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

export default function Sidebar({ onSelectSection }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTeams(user.uid);
        fetchTasks(user.uid);
      } else {
        router.push("/auth/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTeams = (userId) => {
    const teamsCollection = collection(db, "teams");
    const unsubscribe = onSnapshot(teamsCollection, (snapshot) => {
      const userTeams = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(team => team.members.includes(userId));
      setTeams(userTeams);
    });
    return () => unsubscribe();
  };

  const fetchTasks = (userId) => {
    const tasksCollection = collection(db, "tasks");
    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const userTasks = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(task => task.assignedTo.includes(userId));
      setTasks(userTasks);
    });
    return () => unsubscribe();
  };

  const handleSelect = (section) => {
    setActiveSection(section);
    onSelectSection(section);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6 space-y-4 fixed mt-15">
      <button
        className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("dashboard")}
      >
        <FaTachometerAlt size={20} />
        Dashboard
      </button>

      {teams.map(team => (
        <button
          key={team.id}
          className={`flex items-center w-full text-left p-3 rounded-lg gap-3 ${
            activeSection === team.id ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
          onClick={() => handleSelect(team.id)}
        >
          <FaUsers size={20} />
          {team.name}
        </button>
      ))}

      <button
        className={` flex items-center w-full text-left p-3 rounded-lg gap-3 ${
          activeSection === "tasks" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        onClick={() => handleSelect("tasks")}
      >
        <FaTasks size={20} />
        Tasks 
        {/* ({tasks.length}) */}
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

      <button
        className="flex items-center w-full text-left p-3 rounded-lg gap-3 hover:bg-red-700 mt-10"
        onClick={handleLogout}
      >
        <FaSignOutAlt size={20} />
        Logout
      </button>
    </div>
  );
}
