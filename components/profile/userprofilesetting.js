"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

// Predefined options for skills and experience
const skillOptions = [
  "JavaScript",
  "React",
  "Python",
  "SQL",
  "Java",
  "AWS",
  "Data Analysis",
  "Machine Learning",
  "UI/UX Design",
];

const experienceOptions = [
  "Beginner (0-1 years)",
  "Intermediate (1-3 years)",
  "Advanced (3-5 years)",
  "Expert (5+ years)",
];

export default function UserProfileSettings() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: [],
    interests: "",
    experience: "",
    location: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth?.currentUser) {
        const docRef = doc(db, "dbs", "users");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data()[auth.currentUser.uid];
          if (userData) {
            setProfile({
              name: userData.name || "",
              bio: userData.bio || "",
              skills: userData.skills || [],
              interests: Array.isArray(userData.interests) ? userData.interests.join(", ") : userData.interests || "",
              experience: userData.experience || "",
              location: userData.location || "",
            });
          }
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions).map((option) => option.value);
    setProfile({ ...profile, skills: selectedSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be logged in to update your profile.");
      return;
    }

    try {
      const usersDocRef = doc(db, "dbs", "users");

      // Update or create the user's data inside the "users" document
      await setDoc(
        usersDocRef,
        {
          [auth.currentUser.uid]: {
            name: profile.name,
            bio: profile.bio,
            skills: profile.skills,
            interests: typeof profile.interests === "string" ? profile.interests.split(",").map((interest) => interest.trim().toLowerCase()) : [],
            experience: profile.experience,
            location: profile.location,
          },
        },
        { merge: true }
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>User Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <Input
              name="name"
              placeholder="Full Name"
              value={profile.name}
              onChange={handleChange}
              required
              className="mb-2"
            />

            {/* Bio */}
            <Textarea
              name="bio"
              placeholder="Short Bio"
              value={profile.bio}
              onChange={handleChange}
              className="mb-2"
            />

            {/* Skills Dropdown */}
            <label className="block mb-1 font-medium">Skills</label>
            <select
              multiple
              value={profile.skills}
              onChange={handleSkillChange}
              className="border p-2 rounded w-full mb-2"
            >
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            {/* Interests */}
            <Input
              name="interests"
              placeholder="Interests (comma-separated)"
              value={profile.interests}
              onChange={handleChange}
              className="mb-2"
            />

            {/* Experience Dropdown */}
            <label className="block mb-1 font-medium">Experience</label>
            <select
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select Experience Level</option>
              {experienceOptions.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>

            {/* Location */}
            <Input
              name="location"
              placeholder="Location (City/Country)"
              value={profile.location}
              onChange={handleChange}
              className="mb-4"
            />

            {/* Submit Button */}
            <Button type="submit" className="mt-4 w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
