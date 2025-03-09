"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import OverviewPanel from "@/components/overview";
import { cosineSimilarity } from "@/utils/cosineSimilarity"; // Helper function for cosine similarity

export default function DashboardContent() {
  const [suggestedTeammates, setSuggestedTeammates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedTeammates = async () => {
      try {
        // Ensure the user is logged in
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("User not logged in");
          return;
        }

        // Fetch all user profiles from Firestore
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);

        // Get the current user's profile
        const currentUserDoc = querySnapshot.docs.find(
          (doc) => doc.id === currentUser.uid
        );
        if (!currentUserDoc) {
          console.error("Current user profile not found");
          return;
        }

        const currentUserData = currentUserDoc.data();

        // Create a global list of unique skills and experience levels
        const allSkills = Array.from(
          new Set(querySnapshot.docs.flatMap((doc) => doc.data().skills || []))
        );
        const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

        // Convert current user's data to a feature vector
        const currentUserVector = createFeatureVector(
          currentUserData.skills || [],
          currentUserData.experience || "",
          allSkills,
          experienceLevels
        );

        // Calculate similarity scores for other users
        const teammates = querySnapshot.docs
          .filter((doc) => doc.id !== currentUser.uid) // Exclude the current user
          .map((doc) => {
            const data = doc.data();
            const teammateVector = createFeatureVector(
              data.skills || [],
              data.experience || "",
              allSkills,
              experienceLevels
            );

            return {
              id: doc.id,
              name: data.name,
              skills: data.skills || [],
              experience: data.experience || "",
              matchScore: cosineSimilarity(currentUserVector, teammateVector),
            };
          })
          .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score

        setSuggestedTeammates(teammates);
      } catch (error) {
        console.error("Error fetching suggested teammates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedTeammates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Welcome Panel */}
      <OverviewPanel />

      {/* AI-Powered Team Matchmaking */}
      <div className="mt-8">
        <h1 className="text-xl font-semibold mb-4">AI-Powered Team Matchmaking</h1>
        <p className="text-gray-600 mb-4">
          Based on your interests and skills, here are some suggested teammates:
        </p>

        {suggestedTeammates.length > 0 ? (
          <div className="space-y-4">
            {suggestedTeammates.map((teammate) => (
              <div
                key={teammate.id}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <div>
                  <h4 className="text-lg font-medium">{teammate.name}</h4>
                  <p className="text-gray-500">
                    Skills: {teammate.skills.join(", ")}
                  </p>
                  <p className="text-gray-500">
                    Experience: {teammate.experience}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Match Score: {(teammate.matchScore * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                    Connect
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No suggested teammates found.</p>
        )}
      </div>
    </div>
  );
}

// Helper function to create a feature vector for a user
function createFeatureVector(skills, experience, allSkills, experienceLevels) {
  const skillVector = allSkills.map((skill) => (skills.includes(skill) ? 1 : 0));
  const experienceVector = experienceLevels.map((level) =>
    level === experience ? 1 : 0
  );
  return [...skillVector, ...experienceVector];
}
