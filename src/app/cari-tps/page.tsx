"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { tpsCoordinates } from "../../data/tpsCoordinates";

const MapWithNoSSR = dynamic(() => import("../../components/Map"), {
	ssr: false,
});

export default function CariTPSPage() {
	const [selectedTPS, setSelectedTPS] = useState("");
	const [showMap, setShowMap] = useState(false);

	const handleTPSChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTPS(event.target.value);
		setShowMap(true);
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-4'>Cari Lokasi TPS</h1>

			<div className='mb-4'>
				<label
					htmlFor='tps'
					className='block text-sm font-medium text-gray-700 dark:text-gray-300'
				>
					Pilih TPS
				</label>
				<select
					id='tps'
					value={selectedTPS}
					onChange={handleTPSChange}
					className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
				>
					<option value=''>Pilih TPS</option>
					{tpsCoordinates.map((tps) => (
						<option key={tps.id} value={tps.id}>
							{tps.name}
						</option>
					))}
				</select>
			</div>

			{showMap && (
				<div className='mt-4' style={{ height: "400px" }}>
					<MapWithNoSSR selectedTPS={selectedTPS} />
				</div>
			)}
		</div>
	);
}
