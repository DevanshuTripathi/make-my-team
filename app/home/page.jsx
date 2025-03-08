"use client";
import React from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";

export default function Page(){
    const[teams, setTeams] = useState([]);

    const getTeams = async() => {
        const querySnapshot = await getDocs(collection(db, "teams"));
        const teamsList = [];
        querySnapshot.forEach((doc) => {
            teamsList.push(doc.data());
        });
        setTeams(teamsList);
    }
    return(
        <div>
            <h1>Home</h1>
            <div className="mt-10">
                <button onClick={getTeams}>Get Teams</button>
                <ul>
                    {teams.map((team, index) => (
                        <div key={index} >
                            <li>{team.name}</li>
                            <li>{team.description}</li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}