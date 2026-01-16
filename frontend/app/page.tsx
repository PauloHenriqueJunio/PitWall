"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Driver {
  id: number;
  name: string;
  team: string;
  number: number;
  country: string;
}

export default function Home() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

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
    <main className="min-h-screen bg-neutral-900 text-white p-10 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black text-red-600 tracking-ligther uppercase italic">
          PitWall <span className="text-white not-italic">2025</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Live Telemetry Dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="group relative bg-neutral-800 border-l-4 border-red-600 rounded-r-xl p-6 overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-900/20"
          >
            <span className="abosolute -rigth-4 -bottom-8 text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors select-none">
              {driver.number}
            </span>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-neutral-700 text-xs font-bold px-2 py-1 rounded text-gray-300 uppercase">
                  {driver.country}
                </span>
                <span className="text-2xl font-bold text-red-500 italic">
                  #{driver.number}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-1 truncate">
                {driver.name}
              </h2>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">
                {driver.team}
              </p>
            </div>
          </div>
        ))}
      </div>
      {drivers.length === 0 && (
        <div className="text-center mt-20 text-gray-500 animate-pulse">
          Carregando dados do paddock...
        </div>
      )}
    </main>
  );
}
