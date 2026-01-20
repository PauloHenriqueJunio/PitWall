"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  session_type: string;
}

export default function RacePage() {
  const params = useParams();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [activeTab, setActiveTab] = useState<"RACE" | "QUALY">("RACE");
  const formatTime = (time: string) => {
    if (!time) return "No Time";
    return time.replace("00:", "").substring(0, 10);
  };

  const getBestLap = (laps: Lap[]) => {
    if (!laps || laps.length === 0) return null;
    return [...laps].sort((a, b) => a.time.localeCompare(b.time))[0].time;
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

  const getProcessedDrivers = () => {
    return drivers
      .map((driver) => {
        const sessionLaps = driver.laps.filter(
          (l) => l.session_type === activeTab,
        );
        const bestLap = [...sessionLaps].sort((a, b) =>
          a.time.localeCompare(b.time),
        )[0];
        const lastLap = [...sessionLaps].sort((a, b) => b.id - a.id)[0];
        const finalPosition = lastLap ? lastLap.position : 99;

        return { ...driver, bestLap, finalPosition, sessionLaps };
      })
      .filter((d) => d.sessionLaps.length > 0)
      .sort((a, b) => {
        if (activeTab === "RACE") {
          return a.finalPosition - b.finalPosition;
        } else {
          if (!a.bestLap) return +1;
          if (!b.bestLap) return -1;
          return a.bestLap.time.localeCompare(b.bestLap.time);
        }
      });
  };

  const sortedDrivers = getProcessedDrivers();

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-10 font-sans">
      <Link
        href="/"
        className="text-gray-400 hover:text-white mb-8 inline-block"
      >
        ← Voltar para o Calendário
      </Link>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Grand Prix Details
        </h1>
        <p className="text-red-500 font-mono">ROUND {params.id}</p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("RACE")}
            className={`px-8 py-2 rounded-full font-bold uppercase trackin-wider transition-all border 
            ${
              activeTab === "RACE"
                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/50"
                : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            Race
          </button>
          <button
            onClick={() => setActiveTab("QUALY")}
            className={`px-8 py-2 rounded-full font-bold uppercase trackin-wider transition-all border 
            ${
              activeTab === "QUALY"
                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/50"
                : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            Qualifying
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {sortedDrivers.map((driver, index) => (
          <Link key={driver.id} href={`/races/${params.id}/drivers/${driver.id}`} className="group block">
            <div className="flex items-center bg-neutral-900 border-l-4 border-transparent hover:border-red-600 p-4 rounded transition-all cursor pointer hover:bg-neutral-800">

            </div>
          </Link>
        )
          const bestLap = getBestLap(driver.laps);
          return (
            <div
              key={driver.id}
              className="bg-neutral-900 border-l-4 border-red-600 rounded p-6"
            >
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">{driver.name}</h2>
                <span className="text-2xl text-white/20">#{driver.number}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{driver.team}</p>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-400">BEST LAP</span>
                <span className="font-mono text-yellow-400 font-bold">
                  {bestLap ? formatTime(bestLap) : "--:--.---"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
