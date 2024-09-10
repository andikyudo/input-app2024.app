import L from "leaflet";

const PulsingDot = L.Icon.extend({
	options: {
		iconSize: [20, 20],
		iconAnchor: [10, 10],
		className: "leaflet-pulsing-icon",
	},

	createIcon: function () {
		const div = document.createElement("div");
		div.className = "pulsing-dot";
		return div;
	},
});

export const pulsingDotIcon = new PulsingDot();
