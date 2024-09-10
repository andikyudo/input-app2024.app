"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { tpsCoordinates } from "../../data/tpsCoordinates";

const MapWithNoSSR = dynamic(() => import("../../components/Map"), {
	ssr: false,
});

export default function CariTPSPage() {
	const [selectedTPS, setSelectedTPS] = useState("");

	const handleTPSChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTPS(event.target.value);
	};

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
		<div className='w-full'>
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
			<div className='mt-4'>
				{selectedTPS && (
					<button
						onClick={handleRouteToTPS}
						className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						Rute ke TPS
					</button>
				)}
			</div>
		</div>
	);
}
