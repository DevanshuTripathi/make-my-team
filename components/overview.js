"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {db} from "@/firebaseConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaUsers, FaCalendarAlt, FaTasks, FaUserFriends } from "react-icons/fa";

export default function OverviewPanel() {
  const [userData, setUserData] = useState({
    name: "",
    teamsJoined: 0,
    upcomingMeetings: 0,
    pendingTasks: 0,
    newMatches: 0,
  });

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const displayName = user.displayName || "User"; // Default to "User" if no name is provided
        const uid = user.uid;

        // Fetch additional user data from Firestore
        try {
          const userDocRef = doc(db, "users", uid); // Assuming each user's data is stored under their UID in Firestore
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userDetails = userDocSnap.data();
            setUserData({
              name: displayName,
              teamsJoined: userDetails.teamsJoined || 0,
              upcomingMeetings: userDetails.upcomingMeetings || 0,
              pendingTasks: userDetails.pendingTasks || 0,
              newMatches: userDetails.newMatches || 0,
            });
          } else {
            console.log("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching Firestore data:", error);
        }
      } else {
        // User is signed out
        setUserData({
          name: "",
          teamsJoined: 0,
          upcomingMeetings: 0,
          pendingTasks: 0,
          newMatches: 0,
        });
      }
    });
  }, []);

  return (
    <div className="p-6">
      {/* Welcome Message */}
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome, {userData.name}! 👋
      </h1>
      <p className="text-gray-600">Here's a quick summary of your dashboard.</p>

      {/* Quick Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Teams Joined */}
        <Card className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-4">
            <FaUsers className="text-blue-600 text-2xl" />
            <CardTitle className="text-lg">Teams Joined</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.teamsJoined}</p>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-4">
            <FaCalendarAlt className="text-green-600 text-2xl" />
            <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.upcomingMeetings}</p>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-4">
            <FaTasks className="text-yellow-600 text-2xl" />
            <CardTitle className="text-lg">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.pendingTasks}</p>
          </CardContent>
        </Card>

        {/* New Matches */}
        <Card className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-4">
            <FaUserFriends className="text-purple-600 text-2xl" />
            <CardTitle className="text-lg">New Match Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.newMatches}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
