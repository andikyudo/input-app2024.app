import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = ({
	waypoints,
}: {
	waypoints: L.LatLng[];
}) => {
	const instance = L.Routing.control({
		waypoints: waypoints,
		lineOptions: {
			styles: [{ color: "#6FA1EC", weight: 4 }],
		},
		show: false,
		addWaypoints: false,
		routeWhileDragging: true,
		draggableWaypoints: true,
		fitSelectedRoutes: true,
		showAlternatives: false,
	});

	return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
