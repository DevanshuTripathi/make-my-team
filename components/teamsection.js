"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";



const teamsData = [
  {
    id: 1,
    name: "AI Research Team",
    members: ["Alice", "Bob", "Charlie"],
  },
  {
    id: 2,
    name: "Full-Stack Developers",
    members: ["David", "Eve", "Frank"],
  },
];

export default function TeamsSection() {
  const [teams, setTeams] = useState(teamsData);

  return (
    <div className="mt-6">
      <Card className="p-4 shadow-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Your Teams</h2>
        </CardHeader>
        <CardContent>
          {teams.length > 0 ? (
            <ul className="space-y-4">
              {teams.map((team) => (
                <li key={team.id} className="border p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  <p className="text-gray-600">Members: {team.members.join(", ")}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have not joined any teams yet.</p>
          )}

          {/* Create New Team Button */}
          <div className="mt-4">
            <Button className="w-full bg-blue-600">Create New Team</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
