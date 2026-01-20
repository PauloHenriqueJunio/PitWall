"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Lap {
  id: number;
  lap_number: number;
  time: string;
  position: number;
  session_type: string;
  race: { id: number };
}

interface Driver {
  id: number;
  name: string;
  team: string;
  number: number;
  country: string;
  laps: Lap[];
}

export default function DriverPage() {
  const { id, driverId } = useParams();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [activeTab, setActiveTab] = useState<"RACE" | "QUALY">("RACE");

  const formatTime = (time?: string) => {
    if (!time) return "No Time";
    return time.replace("00:", "").substring(0, 10);
  };

  useEffect(() => {
    axios.get<Driver[]>("http://localhost:3000/drivers").then((response) => {
      const allDrivers = response.data;
      const found = allDrivers.find(
        (d: Driver) => Number(d.id) === Number(driverId)
      );
      setDriver(found || null);
    });
  }, [driverId]);
  const sessionLaps = (driver?.laps ?? []).filter((l) => {
    return l.session_type === activeTab && l.race && l.race.id === Number(id);
  });
  const bestLap = [...sessionLaps].sort((a, b) =>
    a.time.localeCompare(b.time)
  )[0];
  const lastLap = [...sessionLaps].sort((a, b) => b.id - a.id)[0];

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-10 font-sans">
      <Link
        href={`/races/${String(id)}`}
        className="text-gray-400 hover:text-white mb-8 inline-block"
      >
        ← Voltar para a corrida
      </Link>

      {!driver ? (
        <p className="text-gray-400">Carregando piloto...</p>
      ) : (
        <>
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              {driver.name}
            </h1>
            <p className="text-red-500 font-mono uppercase">
              {driver.team} · #{driver.number}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setActiveTab("RACE")}
                className={`px-8 py-2 rounded-full font-bold uppercase tracking-wider transition-all border 
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
                className={`px-8 py-2 rounded-full font-bold uppercase tracking-wider transition-all border 
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

          <section className="max-w-4xl mx-auto bg-neutral-900 rounded p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  {activeTab === "RACE" ? "LAPS COMPLETED" : "FASTEST LAP"}
                </p>
                <p className="text-xl font-mono font-bold text-white">
                  {activeTab === "RACE" ? (
                    <span className="text-yellow-500">
                      {sessionLaps.length}
                    </span>
                  ) : (
                    <span className="text-purple-400">
                      {formatTime(bestLap?.time)}
                    </span>
                  )}
                </p>
              </div>
              {lastLap && (
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    LAST LAP POSITION
                  </p>
                  <p className="text-2xl font-black">{lastLap.position}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                LAPS
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sessionLaps.map((lap) => (
                  <div
                    key={lap.id}
                    className="flex justify-between bg-neutral-800 p-3 rounded"
                  >
                    <span className="text-gray-400">Lap {lap.lap_number}</span>
                    <span className="font-mono">{formatTime(lap.time)}</span>
                    <span className="text-gray-500">P{lap.position}</span>
                  </div>
                ))}
                {sessionLaps.length === 0 && (
                  <p className="text-gray-500">Sem voltas para esta sessão.</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
