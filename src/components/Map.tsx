/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngTuple } from "leaflet";
import { tpsCoordinates, getTPSCoordinate } from "../data/tpsCoordinates";

interface MapProps {
	selectedTPS: string;
}

const Map: React.FC<MapProps> = ({ selectedTPS }) => {
	const defaultPosition: LatLngTuple = [-0.0263303, 109.3425039]; // Koordinat default Pontianak
	const selectedTPSId = parseInt(selectedTPS, 10);
	const selectedTPSData = getTPSCoordinate(selectedTPSId);
	const position: LatLngTuple = selectedTPSData
		? [selectedTPSData.lat, selectedTPSData.lng]
		: defaultPosition;

	const customIcon = new Icon({
		iconUrl: "/marker-icon.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
	});

	return (
		<div style={{ height: "400px", width: "100%", zIndex: 10 }}>
			<MapContainer
				center={position}
				zoom={15}
				scrollWheelZoom={false}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{selectedTPS && (
					<Marker position={position} icon={customIcon}>
						<Popup>TPS {selectedTPS}</Popup>
					</Marker>
				)}
			</MapContainer>
		</div>
	);
};

export default Map;
