"use client";

import React, { useState, useEffect } from "react";

import ToggleSwitch from "../../components/ToggleSwitch";
import {
  TrashIcon,
  PencilIcon,
  PlusCircleIcon,
  CameraIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const gubernurCandidates = [
  "Sutarmidji - Didi Haryono",
  "Ria Norsan - Krisantus K.",
  "Muda M. - Jakius Sinyor",
];

const walikotaCandidates = [
  "Mulyadi - Harti Hartidjah",
  "Edi Rusdi Kamtono - Bahasan",
];

// atensi error
const RecapPage = () => {
  type VotingData = {
    tps: string;
    gubernurCandidates: string[];
    walikotaCandidates: string[];
    photo: string | null;
  };
  const [allData, setAllData] = useState<VotingData[]>([]);

  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem("votingData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAllData(parsedData);
    }
  }, []);

  const handleDelete = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const updatedData = allData.filter((_, i) => i !== index);
      setAllData(updatedData);
      localStorage.setItem("votingData", JSON.stringify(updatedData));
    }
  };

  const handleEdit = (index: number) => {
    router.push(`/input?edit=${index}`);
  };

  const handleAddNew = () => {
    const existingTPS = new Set(allData.map((item) => item.tps));
    localStorage.setItem(
      "existingTPS",
      JSON.stringify(Array.from(existingTPS)),
    );
    router.push("/input");
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const calculateTotal = (votes) => {
    return votes.reduce((sum, vote) => sum + parseInt(vote || 0), 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ToggleSwitch />
      </div>
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-20 pt-10 pb-20 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white text-center">
          Rekapitulasi Data TPS
        </h1>
        <div className="w-full max-w-4xl">
          {allData.map((data, index) => (
            <div
              key={index}
              className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  TPS {data.tps}
                </h2>
                <hr className="border-gray-200 dark:border-gray-700 mb-4" />
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Gubernur dan Wakil Gubernur
                  </h3>
                  {gubernurCandidates.map((candidate, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center mb-1"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {idx + 1}. {candidate}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 font-semibold">
                        {formatNumber(data.gubernurCandidates[idx])}
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-bold">
                      Total
                    </span>
                    <span className="float-right text-gray-600 dark:text-gray-400 font-bold">
                      {formatNumber(calculateTotal(data.gubernurCandidates))}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Walikota dan Wakil Walikota
                  </h3>
                  {walikotaCandidates.map((candidate, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center mb-1"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {idx + 1}. {candidate}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 font-semibold">
                        {formatNumber(data.walikotaCandidates[idx])}
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-bold">
                      Total
                    </span>
                    <span className="float-right text-gray-600 dark:text-gray-400 font-bold">
                      {formatNumber(calculateTotal(data.walikotaCandidates))}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {data.photo ? (
                    <div className="text-green-500 dark:text-green-400 flex items-center">
                      <CameraIcon className="h-5 w-5 mr-2" />
                      <span>✓ Foto dokumen telah diupload</span>
                    </div>
                  ) : (
                    <div className="text-yellow-500 dark:text-yellow-400 flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                      <span>
                        Anda belum upload dokumen untuk TPS {data.tps}, lakukan
                        di edit
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between">
                <button
                  onClick={() => handleEdit(index)}
                  className="flex-1 mr-2 flex items-center justify-center p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="flex-1 ml-2 flex items-center justify-center p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full max-w-4xl mt-8">
          <button
            onClick={handleAddNew}
            className="w-full flex items-center justify-center p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Tambah Data TPS Baru
          </button>
        </div>
      </main>
    </div>
  );
};

export default RecapPage;
