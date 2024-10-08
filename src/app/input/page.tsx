"use client";

import React, { useState, useRef, useEffect } from "react";
import ToggleSwitch from "../../components/ToggleSwitch";
import { useRouter, useSearchParams } from "next/navigation";

type NumericInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  label,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length <= 1) {
      const newValues = value.split("");
      newValues[index] = newValue;
      onChange(newValues.join(""));

      if (newValue && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-1/2 text-left">
          {label}
        </label>
        <div className="flex justify-start space-x-2 w-1/2">
          {[0, 1, 2, 3, 4].map((index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-8 h-10 text-center border-b-2 border-gray-400 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-xl text-gray-900 dark:text-white transition-colors duration-200 ${
                value[index] ? "bg-blue-300 dark:bg-blue-900" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type CandidateInputProps = {
  label: string;
  candidates: string[];
  onChange: (index: number, value: string) => void;
};

const CandidateInput: React.FC<CandidateInputProps> = ({
  label,
  candidates,
  onChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {label}
      </h3>
      {candidates.map((candidate, index) => (
        <NumericInput
          key={index}
          value={candidate}
          onChange={(value) => onChange(index, value)}
          label={`Pasangan ${index + 1}`}
        />
      ))}
    </div>
  );
};

type VotingData = {
  tps: string;
  gubernurCandidates: string[];
  walikotaCandidates: string[];
  photo: string | null;
  timestamp: string;
};

const InputPage: React.FC = () => {
  const [step, setStep] = useState<"selectTPS" | "inputData">("selectTPS");
  const [tps, setTps] = useState("");
  const [gubernurCandidates, setGubernurCandidates] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [walikotaCandidates, setWalikotaCandidates] = useState<string[]>([
    "",
    "",
  ]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [allData, setAllData] = useState<VotingData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [existingTPS, setExistingTPS] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const savedData = localStorage.getItem("votingData");
    if (savedData) {
      const parsedData: VotingData[] = JSON.parse(savedData);
      setAllData(parsedData);
      setExistingTPS(new Set(parsedData.map((item) => item.tps)));
    }

    const editParam = searchParams.get("edit");
    if (editParam) {
      const index = parseInt(editParam, 10);
      setEditIndex(index);
      const dataToEdit = JSON.parse(savedData || "[]")[index];
      setTps(dataToEdit.tps);
      setGubernurCandidates(dataToEdit.gubernurCandidates);
      setWalikotaCandidates(dataToEdit.walikotaCandidates);
      setPhoto(dataToEdit.photo ? new File([], dataToEdit.photo) : null);
      setStep("inputData");
    }
  }, [searchParams]);

  const handleTpsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTps(e.target.value);
  };

  const handleTpsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tps && !existingTPS.has(tps)) {
      setStep("inputData");
    } else if (existingTPS.has(tps)) {
      alert("TPS ini sudah ada dalam data. Silakan pilih TPS lain.");
    }
  };

  const handleGubernurChange = (index: number, value: string) => {
    const newCandidates = [...gubernurCandidates];
    newCandidates[index] = value;
    setGubernurCandidates(newCandidates);
  };

  const handleWalikotaChange = (index: number, value: string) => {
    const newCandidates = [...walikotaCandidates];
    newCandidates[index] = value;
    setWalikotaCandidates(newCandidates);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = () => {
    const newData: VotingData = {
      tps,
      gubernurCandidates,
      walikotaCandidates,
      photo: photo ? URL.createObjectURL(photo) : null,
      timestamp: new Date().toISOString(),
    };

    let updatedData: VotingData[];
    if (editIndex !== null) {
      updatedData = [...allData];
      updatedData[editIndex] = newData;
    } else {
      updatedData = [...allData, newData];
    }

    setAllData(updatedData);
    localStorage.setItem("votingData", JSON.stringify(updatedData));

    setExistingTPS(new Set(updatedData.map((item) => item.tps)));

    setTps("");
    setGubernurCandidates(["", "", ""]);
    setWalikotaCandidates(["", ""]);
    setPhoto(null);
    setEditIndex(null);
    router.push("/recap");
  };

  const handleViewRecap = () => {
    router.push("/recap");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ToggleSwitch />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-20 pt-10 pb-20 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          {editIndex !== null ? "Edit Data Pemilihan" : "Input Data Pemilihan"}
        </h1>
        <div className="w-full max-w-md">
          {step === "selectTPS" && editIndex === null && (
            <form onSubmit={handleTpsSubmit} className="mb-6">
              <label
                htmlFor="tps"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Pilih TPS (1-900)
              </label>
              <select
                id="tps"
                value={tps}
                onChange={handleTpsChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih TPS</option>
                {[...Array(900)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                    disabled={existingTPS.has((i + 1).toString())}
                  >
                    {i + 1}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Lanjut
              </button>
            </form>
          )}

          {(step === "inputData" || editIndex !== null) && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                TPS {tps}
              </h2>

              <CandidateInput
                label="Gubernur dan Wakil Gubernur"
                candidates={gubernurCandidates}
                onChange={handleGubernurChange}
              />

              <CandidateInput
                label="Walikota dan Wakil Walikota"
                candidates={walikotaCandidates}
                onChange={handleWalikotaChange}
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Foto Dokumen
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Pilih File
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Ambil Foto
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                />
                {photo && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Foto berhasil diupload
                  </p>
                )}
              </div>

              <button
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                onClick={handleSubmit}
              >
                {editIndex !== null ? "Update Data" : "Submit Data"}
              </button>
            </>
          )}

          <button
            className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            onClick={handleViewRecap}
          >
            {step === "selectTPS"
              ? "Lihat Rekapitulasi"
              : "Kembali ke Rekapitulasi"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default function Home() {
  return <InputPage />;
}
