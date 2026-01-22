"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function DriverPage() {
  const { id, driverId } = useParams();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [activeTab, setActiveTab] = useState<"RACE" | "QUALY">("RACE");

  const formatTime = (time?: string) => {
    if (!time) return "No Time";
    return time.replace("00:", "").substring(0, 10);
  };

  useEffect(() => {
    axios.get<Driver[]>(`${API_URL}/drivers`).then((response) => {
      const allDrivers = response.data;
      const found = allDrivers.find(
        (d: Driver) => Number(d.id) === Number(driverId),
      );
      setDriver(found || null);
    });
  }, [driverId]);
  const sessionLapsRaw = (driver?.laps ?? []).filter((l) => {
    return l.session_type === activeTab && l.race && l.race.id === Number(id);
  });

  const sessionLaps = sessionLapsRaw.filter((l) => {
    const noTime =
      !l.time || l.time.startsWith("00.000") || l.time.startsWith("00.000");
    const noPos = !l.position || Number(l.position) === 0;
    if (noTime || noPos) return false;
    return true;
  });
  const orderedLaps = [...sessionLaps].sort(
    (a, b) => a.lap_number - b.lap_number,
  );

  const bestLap = [...orderedLaps].sort((a, b) =>
    a.time.localeCompare(b.time),
  )[0];
  const lastLap = [...orderedLaps].sort(
    (a, b) => b.lap_number - a.lap_number,
  )[0];

  const rawChartData = sessionLaps
    .map((lap) => {
      const parts = lap.time.split(":");
      const hours = parseFloat(parts[0] || "0");
      const minutes = parseFloat(parts[1] || "0");
      const seconds = parseFloat(parts[2] || "0");
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      return {
        lap: lap.lap_number,
        time: totalSeconds,
        displayTime: formatTime(lap.time),
      };
    })
    .sort((a, b) => a.lap - b.lap);

  const times = rawChartData.map((d) => d.time);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeDifference = maxTime - minTime;
  const margin = Math.max(timeDifference * 0.1, 2);
  const yMin = Math.floor(minTime - margin);
  const yMax = Math.ceil(maxTime + margin);
  const finalDomain = [yMin, yMax === yMin ? yMax + 5 : yMax];

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

          {rawChartData.length > 0 && (
            <div className="max-w-4xl mx-auto bg-neutral-900 rounded-xl p-6 border border-gray-800 mb-8 shadow-2xl">
              <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-4">
                Telemetry Analysis (Lap Time Evolution)
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rawChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#333"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="lap"
                      stroke="#666"
                      tick={{ fill: "#666", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={20}
                    />
                    <YAxis
                      type="number"
                      domain={finalDomain}
                      width={60}
                      stroke="#666"
                      tick={{ fill: "#666", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        borderColor: "#333",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#fff", fontWeight: "bold" }}
                      formatter={(value, name, props) => [
                        props.payload.displayTime,
                        "Tempo",
                      ]}
                      labelFormatter={(label) => `Volta ${label}`}
                      cursor={{ stroke: "#666", strokeWidth: 1 }}
                    ></Tooltip>
                    <Line
                      type="linear"
                      dataKey="time"
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: "#fff", stroke: "#dc2626" }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

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
              <div className="flex flex-col gap-3">
                {orderedLaps.map((lap) => (
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
