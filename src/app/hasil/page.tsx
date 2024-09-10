"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

type Candidate = string;
type VotingData = {
  kecamatan: string;
  kelurahan: string;
  gubernurCandidates: string[];
  walikotaCandidates: string[];
};

const gubernurCandidates: Candidate[] = [
  "Ria Norsan - Krisantus K.",
  "Sutarmidji - Didi Haryono",
  "Muda M. - Jakius Sinyor",
];

const walikotaCandidates: Candidate[] = [
  "Edi Rusdi K. - Bahasan",
  "Mulyadi - Harti",
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const kecamatanList = [
  "Pontianak Utara",
  "Pontianak Timur",
  "Pontianak Selatan",
  "Pontianak Tenggara",
  "Pontianak Barat",
  "Pontianak Kota",
];

const kelurahanList: { [key: string]: string[] } = {
  "Pontianak Utara": ["Kelurahan A", "Kelurahan B", "Kelurahan C"],
  "Pontianak Timur": ["Kelurahan D", "Kelurahan E", "Kelurahan F"],
  "Pontianak Selatan": ["Kelurahan G", "Kelurahan H", "Kelurahan I"],
  "Pontianak Tenggara": ["Kelurahan J", "Kelurahan K", "Kelurahan L"],
  "Pontianak Barat": ["Kelurahan M", "Kelurahan N", "Kelurahan O"],
  "Pontianak Kota": ["Kelurahan P", "Kelurahan Q", "Kelurahan R"],
};

const HasilPage: React.FC = () => {
  const [allData, setAllData] = useState<VotingData[]>([]);
  const [view, setView] = useState<"total" | "perKecamatan">("total");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("votingData");
    if (savedData) {
      setAllData(JSON.parse(savedData));
    }
  }, []);

  const calculateVotes = (
    candidateType: "gubernurCandidates" | "walikotaCandidates",
    kecamatan: string | null = null,
    kelurahan: string | null = null,
  ) => {
    let filteredData = allData;
    if (kecamatan) {
      filteredData = filteredData.filter(
        (data) => data.kecamatan === kecamatan,
      );
    }
    if (kelurahan) {
      filteredData = filteredData.filter(
        (data) => data.kelurahan === kelurahan,
      );
    }

    const candidates =
      candidateType === "gubernurCandidates"
        ? gubernurCandidates
        : walikotaCandidates;

    const results = candidates.map((candidate, index) => {
      const votes = filteredData.reduce(
        (sum, tps) => sum + parseInt(tps[candidateType][index] || "0"),
        0,
      );
      return { name: candidate, votes };
    });

    const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);

    return {
      totalVotes,
      results: results
        .map((result) => ({
          ...result,
          percentage: totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0,
        }))
        .sort((a, b) => b.votes - a.votes),
    };
  };

  const renderMinimalistChart = (
    data: { name: string; votes: number; percentage: number }[],
  ) => (
    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            width: `${item.percentage}%`,
            backgroundColor: COLORS[index % COLORS.length],
          }}
          className="h-full relative"
        >
          {item.percentage > 5 && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {item.percentage.toFixed(1)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderResultsForKecamatan = (kecamatan: string) => {
    const gubernurData = calculateVotes("gubernurCandidates", kecamatan);
    const walikotaData = calculateVotes("walikotaCandidates", kecamatan);

    return (
      <div
        key={kecamatan}
        className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <h2 className="text-xl font-bold p-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
          {kecamatan}
        </h2>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Gubernur dan Wakil Gubernur (Total: {gubernurData.totalVotes} suara)
          </h3>
          {renderMinimalistChart(gubernurData.results)}
          <div className="mt-2 space-y-1">
            {gubernurData.results.map((candidate, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span
                  style={{ color: COLORS[index % COLORS.length] }}
                  className="font-medium"
                >
                  {candidate.name}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {candidate.votes} suara
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-6 text-gray-800 dark:text-white">
            Walikota dan Wakil Walikota (Total: {walikotaData.totalVotes} suara)
          </h3>
          {renderMinimalistChart(walikotaData.results)}
          <div className="mt-2 space-y-1">
            {walikotaData.results.map((candidate, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span
                  style={{ color: COLORS[index % COLORS.length] }}
                  className="font-medium"
                >
                  {candidate.name}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {candidate.votes} suara
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Hasil Pemilihan
        </h1>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setView("total")}
            className={`px-4 py-2 rounded ${
              view === "total"
                ? "bg-blue-500 text-white"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            Hasil Total
          </button>
          <button
            onClick={() => setView("perKecamatan")}
            className={`px-4 py-2 rounded ${
              view === "perKecamatan"
                ? "bg-blue-500 text-white"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            Hasil per Kecamatan
          </button>
        </div>

        {view === "total" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kecamatanList.map((kecamatan) =>
              renderResultsForKecamatan(kecamatan),
            )}
          </div>
        )}

        {view === "perKecamatan" && (
          <div className="space-y-4">
            <select
              value={selectedKecamatan}
              onChange={(e) => {
                setSelectedKecamatan(e.target.value);
                setSelectedKelurahan("");
              }}
              className="w-full p-2 border rounded bg-blue-100 text-blue-800"
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((kecamatan) => (
                <option key={kecamatan} value={kecamatan}>
                  {kecamatan}
                </option>
              ))}
            </select>

            {selectedKecamatan && (
              <select
                value={selectedKelurahan}
                onChange={(e) => setSelectedKelurahan(e.target.value)}
                className="w-full p-2 border rounded bg-green-100 text-green-800"
              >
                <option value="">Pilih Kelurahan</option>
                {kelurahanList[selectedKecamatan].map((kelurahan) => (
                  <option key={kelurahan} value={kelurahan}>
                    {kelurahan}
                  </option>
                ))}
              </select>
            )}

            {selectedKecamatan && renderResultsForKecamatan(selectedKecamatan)}
          </div>
        )}
      </main>
    </div>
  );
};

export default HasilPage;
