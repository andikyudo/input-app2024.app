import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { getTPSCoordinate } from "../data/tpsCoordinates";
import { pulsingDotIcon } from "./PulsingDot";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
	iconUrl: markerIcon.src,
	shadowUrl: markerShadow.src,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
	selectedTPS: string;
}

const Map: React.FC<MapProps> = ({ selectedTPS }) => {
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);

	const defaultPosition: LatLngTuple = [-0.0263303, 109.3425039];
	const selectedTPSId = parseInt(selectedTPS, 10);
	const selectedTPSData = getTPSCoordinate(selectedTPSId);
	const position: LatLngTuple = selectedTPSData
		? [selectedTPSData.lat, selectedTPSData.lng]
		: defaultPosition;

	useEffect(() => {
		if (mapContainerRef.current && !mapRef.current) {
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

			L.marker([selectedTPSData.lat, selectedTPSData.lng], {
				icon: pulsingDotIcon,
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
