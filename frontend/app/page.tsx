"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Driver {
  id: number;
  name: string;
  team: string;
  number: number;
  country: string;
  laps: Lap[];
}

interface Lap {
  id: number;
  time: string;
  position: number;
}

export default function Home() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const formatTime = (time: string) => {
    if (!time) return "No Time";
    return time.replace("00:", "").substring(0, 10);
  };

  const getBestLap = (laps: Lap[]) => {
    if (!laps || laps.length === 0) return null;
    const sortedLaps = [...laps].sort((a, b) => a.time.localeCompare(b.time));
    return sortedLaps[0].time;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/drivers")
      .then((response) => {
        setDrivers(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar pilotos", error);
      });
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-10 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black text-red-600 tracking-ligther uppercase italic">
          PitWall <span className="text-white not-italic">2025</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Qualifying Session Data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {drivers.map((driver) => {
          const bestLap = getBestLap(driver.laps);

          return (
            <div
              key={driver.id}
              className="relative bg-neutral-900 border-t-4 border-red-600 rounded-lg p-6 hover:bg-neutral-800 transition-colors shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {driver.name}
                  </h2>
                  <p className="text-sm text-gray-500 uppercase font-semibold">
                    {driver.team}
                  </p>
                </div>
                <span className="text-4xl font-black text-white/10 italic">
                  {driver.number}
                </span>
              </div>

              <div className="bg-neutral-950/50 rounded p-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Voltas</p>
                  <p className="font-mono text-lg">{driver.laps.length}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-purple-400 uppercase font-bold">
                    Melhor Volta
                  </p>
                  <p className="font-mono text-xl font-bold text-white">
                    {bestLap ? formatTime(bestLap) : "--:--.---"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
