"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import OverviewPanel from "@/components/overview";
import { cosineSimilarity } from "@/utils/cosineSimilarity"; // Helper function for cosine similarity

export default function DashboardContent() {
  const [suggestedTeammates, setSuggestedTeammates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null); // For popup

  useEffect(() => {
    const fetchSuggestedTeammates = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("User not logged in");
          return;
        }

        // Fetch the 'users' document inside the 'dbs' collection
        const usersDocRef = doc(db, "dbs", "users");
        const usersDocSnap = await getDoc(usersDocRef);

        if (!usersDocSnap.exists()) {
          console.error("Users document not found.");
          return;
        }

        const allUsersData = usersDocSnap.data(); // Fetch all user data as fields
        const currentUserData = allUsersData[currentUser.uid]; // Get current user's data

        if (!currentUserData) {
          console.error("Current user profile not found.");
          return;
        }

        // Create a global list of unique skills and experience levels
        const allSkills = Array.from(
          new Set(
            Object.values(allUsersData).flatMap((user) => user.skills || [])
          )
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
        const teammates = Object.entries(allUsersData)
          .filter(([userId]) => userId !== currentUser.uid) // Exclude the current user
          .map(([userId, userData]) => {
            const teammateVector = createFeatureVector(
              userData.skills || [],
              userData.experience || "",
              allSkills,
              experienceLevels
            );

            return {
              id: userId,
              name: userData.name,
              bio: userData.bio,
              skills: userData.skills || [],
              experience: userData.experience || "",
              location: userData.location || "",
              interests: userData.interests || [],
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

  const handleViewDetails = (user) => {
    setSelectedUserDetails(user); // Open popup with selected user's details
  };

  const handleConnectRequest = async (receiverId) => {
    try {
      const senderId = auth.currentUser.uid;

      // Correct path for adding connection requests
      await addDoc(collection(db, "dbs", "connectionRequests", "requests"), {
        senderId: senderId,
        receiverId: receiverId,
        status: "pending",
        timestamp: new Date(),
      });

      alert("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Welcome Panel */}
      <OverviewPanel />

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
                  <p><strong>Skills:</strong> {teammate.skills.join(", ")}</p>
                  <p><strong>Experience:</strong> {teammate.experience}</p>
                  <p><strong>Match Score:</strong> {(teammate.matchScore * 100).toFixed(2)}%</p>
                </div>
                <div className="space-x-2">
                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(teammate)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  >
                    View Details
                  </button>

                  {/* Connect Request Button */}
                  <button
                    onClick={() => handleConnectRequest(teammate.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No suggested teammates found.</p>
        )}
      </div>

      {/* Popup for Viewing Details */}
      {selectedUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedUserDetails.name}</h2>
            <p><strong>Bio:</strong> {selectedUserDetails.bio}</p>
            <p><strong>Skills:</strong> {selectedUserDetails.skills.join(", ")}</p>
            <p><strong>Experience:</strong> {selectedUserDetails.experience}</p>
            <button
              onClick={() => setSelectedUserDetails(null)} // Close popup
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
