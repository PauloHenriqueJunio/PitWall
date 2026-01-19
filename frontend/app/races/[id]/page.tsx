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
}

export default function RacePage() {
  const params = useParams();
  const [drivers, setDrivers] = useState<Driver[]>([]);
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

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-10 font-sans">
      <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">
        ← Voltar para o Calendário
      </Link>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Grand Prix Details</h1>
        <p className="text-red-500 font-mono">ROUND {params.id}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {drivers.map((driver) => {
          const bestLap = getBestLap(driver.laps);
          return (
            <div key={driver.id} className="bg-neutral-900 border-l-4 border-red-600 rounded p-6">
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
