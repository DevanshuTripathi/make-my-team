"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaUsers, FaCalendarAlt, FaTasks, FaUserFriends } from "react-icons/fa";

// Dummy Data (Replace with API data)
const userData = {
  name: "Mayank",  // Replace with dynamic user data
  teamsJoined: 3,
  upcomingMeetings: 2,
  pendingTasks: 5,
  newMatches: 4,
};

export default function OverviewPanel() {
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
