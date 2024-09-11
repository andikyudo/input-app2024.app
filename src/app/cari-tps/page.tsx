"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { tpsCoordinates } from "../../data/tpsCoordinates";

const MapWithNoSSR = dynamic(() => import("../../components/Map"), {
	ssr: false,
});

export default function CariTPSPage() {
<<<<<<< HEAD
	const [selectedTPS, setSelectedTPS] = useState("");
	const [tpsLocation, setTpsLocation] = useState("");

	useEffect(() => {
		const savedTPS = localStorage.getItem("selectedTPS");
		if (savedTPS) {
			setSelectedTPS(savedTPS);
		}
	}, []);

	const handleTPSChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newSelectedTPS = event.target.value;
		setSelectedTPS(newSelectedTPS);
		localStorage.setItem("selectedTPS", newSelectedTPS);
	};

	const handleClearSelection = () => {
		setSelectedTPS("");
		setTpsLocation("");
		localStorage.removeItem("selectedTPS");
	};
=======
	const [selectedTPS, setSelectedTPS] = useState<string[]>([]);
	const [currentTPS, setCurrentTPS] = useState<string | null>(null);
>>>>>>> feature/search-tps

	useEffect(() => {
		const savedTPS = localStorage.getItem("selectedTPS");
		if (savedTPS) {
			try {
				const parsedTPS = JSON.parse(savedTPS);
				setSelectedTPS(Array.isArray(parsedTPS) ? parsedTPS : []);
				setCurrentTPS(
					Array.isArray(parsedTPS) && parsedTPS.length > 0 ? parsedTPS[0] : null
				);
			} catch {
				setSelectedTPS([]);
				setCurrentTPS(null);
			}
		}
	}, []);

	const handleTPSChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		if (value) {
			setSelectedTPS((prev) => {
				const newSelected = Array.isArray(prev) ? [...prev] : [];
				if (!newSelected.includes(value)) {
					newSelected.push(value);
				}
				localStorage.setItem("selectedTPS", JSON.stringify(newSelected));
				return newSelected;
			});
			setCurrentTPS(value);
		}
	};

	const handleRemoveTPS = (tps: string) => {
		setSelectedTPS((prev) => {
			const newSelected = Array.isArray(prev)
				? prev.filter((id) => id !== tps)
				: [];
			localStorage.setItem("selectedTPS", JSON.stringify(newSelected));
			return newSelected;
		});
		setCurrentTPS((prev) => (prev === tps ? null : prev));
	};

	const handleSelectCurrentTPS = (tps: string) => {
		setCurrentTPS(tps);
	};

	return (
<<<<<<< HEAD
		<div className='w-full max-w-4xl mx-auto p-4 mt-16'>
			{" "}
			{/* Tambahkan margin-top di sini */}
			<h1 className='text-2xl font-bold mb-4 text-black dark:text-white'>
				Cari Lokasi TPS
			</h1>
			<div className='mb-4'>
				<select
					id='tps'
					value={selectedTPS}
					onChange={handleTPSChange}
					className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700 dark:bg-gray-700 text-white dark:text-white'
				>
					<option value=''>Pilih TPS</option>
					{tpsCoordinates.map((tps) => (
						<option key={tps.id} value={tps.id.toString()}>
							{tps.name}
						</option>
					))}
				</select>
			</div>
			<div className='mt-4 relative' style={{ height: "400px" }}>
				<MapWithNoSSR selectedTPS={selectedTPS} />
			</div>
			{selectedTPS && (
				<div className='mt-4 space-y-2'>
					<button
						onClick={handleRouteToTPS}
						className='w-full bg-emerald-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						Rute ke TPS {selectedTPS}
					</button>
					<div className='w-full p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700'>
						<h3 className='font-semibold text-lg mb-2 text-black dark:text-white'>
							Lokasi TPS {selectedTPS}
						</h3>
						<p className='text-gray-700 dark:text-gray-300 mb-2'>
							{tpsLocation || "Memuat alamat..."}
						</p>
						<button
							onClick={handleClearSelection}
							className='text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
						>
							Hapus Pilihan TPS ini
						</button>
					</div>
=======
		<div className='w-full flex flex-col min-h-screen'>
			<div className='flex-grow overflow-y-auto'>
				<h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
					Cari Lokasi TPS
				</h1>
				<div className='mb-4'>
					<select
						id='tps'
						value={currentTPS || ""}
						onChange={handleTPSChange}
						className='mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
					>
						<option value=''>Pilih TPS</option>
						{tpsCoordinates.map((tps) => (
							<option
								key={tps.id}
								value={tps.id.toString()}
								className='flex items-center'
							>
								<span className='mr-2'>
									{selectedTPS.includes(tps.id.toString()) ? "✓ " : ""}
								</span>
								{tps.name}
							</option>
						))}
					</select>
>>>>>>> feature/search-tps
				</div>
				<div className='flex-grow' style={{ minHeight: "60vh" }}>
					<MapWithNoSSR
						selectedTPS={selectedTPS}
						currentTPS={currentTPS}
						onRemoveTPS={handleRemoveTPS}
						onSelectCurrentTPS={handleSelectCurrentTPS}
					/>
				</div>
			</div>
		</div>
	);
}
