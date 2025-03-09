"use client";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

export default function UserProfileSettings() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: "",
    interests: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center p-8 gap-8">
      {/* Profile Customization */}
      <Card className="max-w-3xl w-full shadow-lg rounded-xl border border-gray-300 dark:border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Profile Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input name="name" placeholder="Enter your name" value={profile.name} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <Textarea name="bio" placeholder="Write a short bio..." value={profile.bio} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <Input name="skills" placeholder="Skills (e.g., JavaScript, Python)" value={profile.skills} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <Input name="interests" placeholder="Interests (e.g., AI, Web Dev)" value={profile.interests} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg">Save Profile</Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="max-w-3xl w-full shadow-lg rounded-xl border border-gray-300 dark:border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-4">
          <span className="text-lg">Dark Mode</span>
          <Switch checked={theme === "dark"} onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")} className="scale-125" />
        </CardContent>
      </Card>
    </div>
  );
}
