"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { tpsCoordinates } from "../../data/tpsCoordinates";

const MapWithNoSSR = dynamic(() => import("../../components/Map"), {
	ssr: false,
});

export default function CariTPSPage() {
	const [selectedTPS, setSelectedTPS] = useState<string[]>([]);
	const [currentTPS, setCurrentTPS] = useState<string | null>(null);

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
		<div className='w-full'>
			<h1 className='text-2xl font-bold mb-4 text-black dark:text-white'>
				Cari Lokasi TPS
			</h1>
			<div className='mb-4'>
				<select
					id='tps'
					value={currentTPS || ""}
					onChange={handleTPSChange}
					className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-black dark:text-white'
				>
					<option value=''>Pilih TPS</option>
					{tpsCoordinates.map((tps) => (
						<option
							key={tps.id}
							value={tps.id.toString()}
							className={
								selectedTPS.includes(tps.id.toString())
									? "bg-yellow-200 dark:bg-yellow-700 font-bold"
									: ""
							}
						>
							{tps.name}
						</option>
					))}
				</select>
			</div>
			<div className='mt-4 relative z-0' style={{ height: "60vh" }}>
				<MapWithNoSSR
					selectedTPS={selectedTPS}
					currentTPS={currentTPS}
					onRemoveTPS={handleRemoveTPS}
					onSelectCurrentTPS={handleSelectCurrentTPS}
				/>
			</div>
		</div>
	);
}
