"use client";

import { act, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

const TEAM_COLORS: Record<string, string> = {
  "Red Bull Racing": "#3671C6",
  Mercedes: "#27F4D2",
  Ferrari: "#E80020",
  McLaren: "#FF8000",
  "Aston Martin": "#229971",
  Alpine: "#00A1E8",
  Williams: "#1868DB",
  "Racing Bulls": "#6692FF",
  "Kick Sauber": "#52E252",
  "Haas F1 Team": "#B6BABD",
};

const getTeamColor = (teamName: string) => {
  return TEAM_COLORS[teamName] || "#FFFFFF";
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
  race: { id: number };
}

interface Race {
  id: number;
  name: string;
  round: number;
  date: string;
  year: number;
}

export default function RacePage() {
  const params = useParams();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [race, setRace] = useState<Race | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"RACE" | "QUALY">("RACE");
  const formatTime = (time: string | undefined) => {
    if (!time) return "No Time";
    return time.replace("00:", "").substring(0, 10);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [racesResponse, driversResponse] = await Promise.all([
          axios.get<Race[]>(`${API_URL}/races`),
          axios.get<Driver[]>(`${API_URL}/drivers`)
        ]);

        const currentRace = racesResponse.data.find(
          (r) => r.id === Number(params.id)
        );
        setRace(currentRace || null);

        setDrivers(driversResponse.data);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const getProcessedDrivers = () => {
    const processed = drivers.map((driver) => {
      const laps = driver.laps ?? [];
      const sessionLaps = laps.filter(
        (l) =>
          l.session_type === activeTab &&
          l.race &&
          l.race.id === Number(params.id),
      );

      const bestLap = [...sessionLaps].sort((a, b) =>
        a.time.localeCompare(b.time),
      )[0];
      const lastLap = [...sessionLaps].sort((a, b) => b.id - a.id)[0];
      const finalPosition =
        lastLap && lastLap.position > 0 ? lastLap.position : 999;

      return { ...driver, bestLap, finalPosition, sessionLaps } as Driver & {
        bestLap?: Lap;
        finalPosition: number;
        sessionLaps: Lap[];
      };
    });

    const maxLaps = Math.max(...processed.map((d) => d.sessionLaps.length));
    const dnfThreshold = Math.floor(maxLaps * 0.9);

    return processed
      .sort((a, b) => {
        if (activeTab === "RACE") {
          if (a.finalPosition !== b.finalPosition) {
            return a.finalPosition - b.finalPosition;
          }
          return b.sessionLaps.length - a.sessionLaps.length;
        } else {
          if (!a.bestLap) return +1;
          if (!b.bestLap) return -1;
          return a.bestLap.time.localeCompare(b.bestLap.time);
        }
      })
      .map((driver) => {
        const lapsCount = driver.sessionLaps.length;
        const isDNS = activeTab === "RACE" && lapsCount === 0;
        const isDNF =
          activeTab === "RACE" && lapsCount > 0 && lapsCount < dnfThreshold;

        return {
          ...driver,
          isDNS,
          isDNF,
        };
      });
  };
  if (isLoading || !race) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center gap-4">
        <div className="relative w-32 h-32">
            <Image 
              src="/bandeira.gif"
              alt="Carregando"
              fill
              unoptimized={true}
              className=""
            />
        </div>
        <p className="text-red-600 font-mono font-bold tracking-[0.2em] animate-pulse text-xl">
          Carregando o grid de largada, por favor aguarde...
        </p>
      </div>
    );
  }

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
          {race?.name || "Grand Prix Details"}
        </h1>
        <p className="text-red-500 font-mono">ROUND {race?.round || "..."}</p>
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
          <Link
            key={driver.id}
            href={`/races/${String(params.id)}/driver/${driver.id}`}
            className="group block"
          >
            <div
              className={`flex items-center bg-neutral-900 border-l-4 border-transparent p-4 rounded transition-all cursor-pointer hover:bg-neutral-800 ${
                driver.isDNS
                  ? "bg-neutral-950 border-gray-800 opacity-40 hover:opacity-100"
                  : driver.isDNF
                    ? "bg-neutral-900 border-red-900 opacity-75"
                    : "bg-neutral-900 border-transparent hover:border-red-800"
              }`}
              style={{
                borderLeftColor:
                  !driver.isDNS && !driver.isDNF
                    ? getTeamColor(driver.team)
                    : undefined,
              }}
            >
              <div
                className={`w-16 text-center text-3xl font-black text-gray-600 group-hover:text-white italic ${
                  driver.isDNF
                    ? "text-red-900"
                    : "text-gray-600 group-hover:text-white"
                }`}
              >
                {index + 1}
              </div>

              <div className="flex-1 pl-4 border-l border-gray-800">
                <div className="flex items-baseline gap-3">
                  <h2
                    className={`text-xl font-bold text-white group-hover:text-red-500 transition-colors ${
                      driver.isDNF
                        ? "text-gray-500"
                        : "text-white group-hover:text-red-500"
                    }`}
                  >
                    {driver.name}
                  </h2>
                  <span className="text-sm text-gray-500 font-mono">
                    #{driver.number}
                  </span>
                </div>
                <p
                  className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-1"
                  style={{
                    color:
                      !driver.isDNS && !driver.isDNF
                        ? getTeamColor(driver.team)
                        : "#9ca3af",
                  }}
                >
                  {driver.team}
                </p>
              </div>

              <div className="text-right px-4">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  {activeTab === "RACE" ? "LAPS COMPLETED" : "FASTEST LAP"}
                </p>
                <p className="text-xl font-mono font-bold text-white">
                  {activeTab === "RACE" ? (
                    <>
                      {driver.isDNS ? (
                        <span className="text-gray-600">DNS</span>
                      ) : (
                        <span
                          className={
                            driver.isDNF ? "text-red-600" : "text-yellow-500"
                          }
                        >
                          {driver.sessionLaps.length}
                          {driver.isDNF && (
                            <span className="text-xs ml-1 font-sans font-bold">
                              (DNF)
                            </span>
                          )}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-purple-400">
                      {formatTime(driver.bestLap?.time)}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-gray-600 group-hover:text-white pl-4">→</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
