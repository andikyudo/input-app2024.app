import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getTPSCoordinate } from "../data/tpsCoordinates";
import { pulsingDotIcon } from "./PulsingDot";
import { MapPin } from "lucide-react";

interface MapProps {
	selectedTPS: string;
}

const ChangeView = ({ center }: { center: [number, number] }) => {
	const map = useMap();
	map.setView(center, 15);
	return null;
};

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

const Map: React.FC<MapProps> = ({ selectedTPS }) => {
	const tpsId = parseInt(selectedTPS);
	const tpsCoordinate = useMemo(() => getTPSCoordinate(tpsId), [tpsId]);
	const [address, setAddress] = useState<string>("");

	const position: [number, number] = tpsCoordinate
		? [tpsCoordinate.lat, tpsCoordinate.lng]
		: [-0.0422285, 109.3246004]; // Default position if no TPS selected

	useEffect(() => {
		if (tpsCoordinate) {
			getAddress(tpsCoordinate.lat, tpsCoordinate.lng).then(setAddress);
		}
	}, [tpsCoordinate]);

	const handleGetDirections = () => {
		if (tpsCoordinate) {
			const url = `https://www.google.com/maps/dir/?api=1&destination=${tpsCoordinate.lat},${tpsCoordinate.lng}`;
			window.open(url, "_blank");
		}
	};

	return (
		<div className='relative'>
			<div style={{ height: "400px", width: "100%", zIndex: 10 }}>
				<MapContainer
					center={position}
					zoom={15}
					scrollWheelZoom={false}
					style={{ height: "100%", width: "100%" }}
				>
					<ChangeView center={position} />
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					{tpsCoordinate && (
						<Marker position={position} icon={pulsingDotIcon}>
							<Popup>{tpsCoordinate.name}</Popup>
						</Marker>
					)}
				</MapContainer>
			</div>
			{tpsCoordinate && (
				<div className='mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
					<button
						onClick={handleGetDirections}
						className='w-full mb-4 bg-emerald-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center'
					>
						<MapPin className='mr-2' size={18} />
						Buka Petunjuk Arah
					</button>
					<div className='text-sm text-gray-600 dark:text-gray-300'>
						<h3 className='font-semibold mb-1'>Alamat TPS:</h3>
						<p>{address}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Map;
