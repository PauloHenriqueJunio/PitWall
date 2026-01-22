"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Race {
  id: number;
  name: string;
  round: number;
  location: string;
  date: string;
}

export default function HomePage() {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/races")
      .then((response) => setRaces(response.data))
      .catch((error) => console.error("Error fetching races:", error));
  }, []);

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8 md:p-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 border-b border-gray-800 pb-8">
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">
            <span className="text-red-600">F1</span> Schedule{" "}
            <span className="text-stroke text-transparent stroke-white">
              2025
            </span>
          </h1>
        </header>
        <div className="grid gap-4">
          {races.map((race) => (
            <Link key={race.id} href={`/races/${race.id}`} className="group">
              <div className="flex items-center bg-neutral-900 hover:bg-neutral-800 border-l-4 border-transparent hover:border-red-600 transition-all duration-300 p-6 rounded-r-lg">
                <div className="w-24 text-center border-r border-gray-800 pr-6 mr-6">
                  <span className="block text-sm text-gray-500 uppercase font-bold">
                    Round
                  </span>
                  <span className="block text-3xl font-black text-white">
                    {race.round}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
                    {race.date}
                  </p>
                  <h2 className="text-2xl font-bold text-white group-hover:text-red-500 transition colors">
                    {race.name}
                  </h2>
                  <p className="text-gray-400 text-sm uppercase">
                    {race.location}
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
