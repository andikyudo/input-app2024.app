import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

const PulsingDot = () => (
	<div
		style={{
			position: "relative",
			width: "20px",
			height: "20px",
		}}
	>
		<div
			className='pulsing-dot'
			style={{
				position: "absolute",
				background: "rgba(255, 0, 0, 0.3)",
				top: 0,
				left: 0,
			}}
		></div>
		<div
			style={{
				position: "absolute",
				background: "rgb(255, 0, 0)",
				width: "10px",
				height: "10px",
				borderRadius: "50%",
				top: "5px",
				left: "5px",
			}}
		></div>
	</div>
);

export const pulsingDotIcon = new L.DivIcon({
	html: renderToStaticMarkup(<PulsingDot />),
	className: "leaflet-div-icon",
	iconSize: [20, 20],
	iconAnchor: [10, 10],
});
