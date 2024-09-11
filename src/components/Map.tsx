import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getTPSCoordinate } from "../data/tpsCoordinates";

interface MapProps {
	selectedTPS: string[];
	currentTPS: string | null;
	onRemoveTPS: (tps: string) => void;
	onSelectCurrentTPS: (tps: string) => void;
}

const Map: React.FC<MapProps> = ({
	selectedTPS,
	currentTPS,
	onRemoveTPS,
	onSelectCurrentTPS,
}) => {
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [address, setAddress] = useState<string>("");

	const defaultPosition: [number, number] = [-0.0263303, 109.3425039];

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			mapContainerRef.current &&
			!mapRef.current
		) {
			mapRef.current = L.map(mapContainerRef.current).setView(
				defaultPosition,
				15
			);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(mapRef.current);
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (mapRef.current) {
			mapRef.current.eachLayer((layer) => {
				if (layer instanceof L.Marker) {
					mapRef.current?.removeLayer(layer);
				}
			});

			selectedTPS.forEach((tpsId) => {
				const tpsData = getTPSCoordinate(parseInt(tpsId));
				if (tpsData) {
					const pulsingIcon = L.divIcon({
						className: "pulsing-dot",
						iconSize: [20, 20],
					});

					L.marker([tpsData.lat, tpsData.lng], { icon: pulsingIcon })
						.addTo(mapRef.current!)
						.bindPopup(`TPS ${tpsId}`)
						.on("click", () => onSelectCurrentTPS(tpsId));
				}
			});

			if (currentTPS) {
				const currentTPSData = getTPSCoordinate(parseInt(currentTPS));
				if (currentTPSData) {
					mapRef.current.setView([currentTPSData.lat, currentTPSData.lng], 15);
					getAddress(currentTPSData.lat, currentTPSData.lng).then(setAddress);
				}
			}
		}
	}, [selectedTPS, currentTPS, onSelectCurrentTPS]);

	const getAddress = async (lat: number, lng: number): Promise<string> => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
			);
			const data = await response.json();
			return data.display_name || "Alamat tidak ditemukan";
		} catch (error) {
			console.error("Error fetching address:", error);
			return "Gagal mendapatkan alamat";
		}
	};

	const handleGetDirections = () => {
		if (currentTPS) {
			const tpsData = getTPSCoordinate(parseInt(currentTPS));
			if (tpsData) {
				const url = `https://www.google.com/maps/dir/?api=1&destination=${tpsData.lat},${tpsData.lng}`;
				window.open(url, "_blank");
			}
		}
	};

	return (
		<div className='relative'>
			<div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />
			{currentTPS && (
				<div className='mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
					<h3 className='font-semibold mb-2'>TPS {currentTPS}</h3>
					<button
						onClick={handleGetDirections}
						className='w-full mb-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='mr-2'
						>
							<circle cx='12' cy='12' r='10'></circle>
							<circle cx='12' cy='12' r='3'></circle>
						</svg>
						Rute ke TPS
					</button>
					<div className='text-sm text-gray-600 dark:text-gray-300'>
						<h4 className='font-semibold mb-1'>Alamat TPS:</h4>
						<p>{address || "Memuat alamat..."}</p>
					</div>
					<button
						onClick={() => onRemoveTPS(currentTPS)}
						className='mt-2 text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 rounded px-2 py-1 text-sm'
					>
						Hapus TPS ini
					</button>
				</div>
			)}
		</div>
	);
};

export default Map;
