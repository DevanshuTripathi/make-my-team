export default function DashboardContent() {
  // Sample suggested teammates (Replace with real AI-driven data later)
  const suggestedTeammates = [
    { id: 1, name: "John Doe", skills: ["React", "Node.js"], matchScore: 87 },
    { id: 2, name: "Jane Smith", skills: ["Python", "Machine Learning"], matchScore: 92 },
    { id: 3, name: "Mike Johnson", skills: ["Django", "FastAPI"], matchScore: 80 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Welcome Panel */}
      <h2 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h2>
      <p className="text-gray-600">Here you can manage your profile, team, and more.</p>

      {/* AI-Powered Team Matchmaking */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">AI-Powered Team Matchmaking</h3>
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
