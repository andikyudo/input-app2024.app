import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getTPSCoordinate } from "../data/tpsCoordinates";
import { pulsingDotIcon } from "./PulsingDot";
import { MapPin } from "lucide-react"; // Import ikon

interface MapProps {
	selectedTPS: string;
}

const ChangeView = ({ center }: { center: [number, number] }) => {
	const map = useMap();
	map.setView(center, 15);
	return null;
};

const Map: React.FC<MapProps> = ({ selectedTPS }) => {
	const tpsId = parseInt(selectedTPS);
	const tpsCoordinate = useMemo(() => getTPSCoordinate(tpsId), [tpsId]);

	const position: [number, number] = tpsCoordinate
		? [tpsCoordinate.lat, tpsCoordinate.lng]
		: [-6.2088, 106.8456]; // Default position if no TPS selected

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
				<button
					onClick={handleGetDirections}
					className='mt-4 bg-emerald-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded w-full flex items-center justify-center'
				>
					<MapPin className='mr-2' size={18} />
					Buka Petunjuk Arah
				</button>
			)}
		</div>
	);
};

export default Map;
