import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import {db} from "@/firebaseConfig";
import OverviewPanel from "@/components/overview";

export default function DashboardContent() {
  const [suggestedTeammates, setSuggestedTeammates] = useState([]);

  useEffect(() => {
    const fetchSuggestedTeammates = async () => {
      try {
        const userDocRef = doc(db, "dbs", "user");
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setSuggestedTeammates(data.suggestedTeammates || []);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching teammates:", error);
      }
    };

    fetchSuggestedTeammates();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <OverviewPanel />

      <div className="mt-8">
        <h1 className="text-xl font-semibold mb-4">AI-Powered Team Matchmaking</h1>
        <p className="text-gray-600 mb-4">
          Based on your interests and skills, here are some suggested teammates:
        </p>

        <div className="space-y-4">
          {suggestedTeammates.map((teammate) => (
            <div key={teammate.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50">
              <div>
                <h4 className="text-lg font-medium">{teammate.name}</h4>
                <p className="text-gray-500">Skills: {teammate.skills.join(", ")}</p>
                <p className="text-gray-700 font-semibold">
                  Match Score: {teammate.matchScore}%
                </p>
              </div>
              <div className="space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Connect</button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
