import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getTPSCoordinate } from "../data/tpsCoordinates";

interface MapProps {
	selectedTPS: string;
}

const Map: React.FC<MapProps> = ({ selectedTPS }) => {
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);

	const defaultPosition: [number, number] = [-0.0263303, 109.3425039];
	const selectedTPSId = parseInt(selectedTPS, 10);
	const selectedTPSData = getTPSCoordinate(selectedTPSId);
	const position: [number, number] = selectedTPSData
		? [selectedTPSData.lat, selectedTPSData.lng]
		: defaultPosition;

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			mapContainerRef.current &&
			!mapRef.current
		) {
			mapRef.current = L.map(mapContainerRef.current).setView(position, 15);

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
		if (mapRef.current && selectedTPSData) {
			mapRef.current.setView([selectedTPSData.lat, selectedTPSData.lng], 15);

			const pulsingIcon = L.divIcon({
				className: "pulsing-dot",
				iconSize: [20, 20],
			});

			L.marker([selectedTPSData.lat, selectedTPSData.lng], {
				icon: pulsingIcon,
			})
				.addTo(mapRef.current)
				.bindPopup(`TPS ${selectedTPS}`);
		}
	}, [selectedTPS, selectedTPSData]);

	return (
		<div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />
	);
};

export default Map;
