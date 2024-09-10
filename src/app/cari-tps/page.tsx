"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { tpsCoordinates } from "../../data/tpsCoordinates";

const MapWithNoSSR = dynamic(() => import("../../components/Map"), {
	ssr: false,
});

async function getAddress(lat: number, lon: number): Promise<string> {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
		);
		const data = await response.json();
		return data.display_name || "Alamat tidak ditemukan";
	} catch (error) {
		console.error("Error fetching address:", error);
		return "Gagal mendapatkan alamat";
	}
}

export default function CariTPSPage() {
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

	useEffect(() => {
		async function fetchAddress() {
			if (selectedTPS) {
				const tps = tpsCoordinates.find(
					(tps) => tps.id.toString() === selectedTPS
				);
				if (tps) {
					const address = await getAddress(tps.lat, tps.lng);
					setTpsLocation(address);
				}
			} else {
				setTpsLocation("");
			}
		}
		fetchAddress();
	}, [selectedTPS]);

	const handleRouteToTPS = () => {
		const selectedTPSData = tpsCoordinates.find(
			(tps) => tps.id.toString() === selectedTPS
		);
		if (selectedTPSData) {
			const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedTPSData.lat},${selectedTPSData.lng}`;
			window.open(url, "_blank");
		}
	};

	return (
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
				</div>
			)}
		</div>
	);
}
