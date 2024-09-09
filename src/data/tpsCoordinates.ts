interface TPSCoordinate {
	id: number;
	name: string;
	lat: number;
	lng: number;
}

export const tpsCoordinates: TPSCoordinate[] = [
	{ id: 1, name: "TPS 1", lat: -0.042854, lng: 109.324457 },
	{ id: 2, name: "TPS 2", lat: -0.039929, lng: 109.3293617 },
	{ id: 3, name: "TPS 3", lat: -6.211, lng: 106.845 },
	// ... tambahkan lebih banyak koordinat dummy sampai TPS 900
	{ id: 900, name: "TPS 900", lat: -6.3088, lng: 106.9456 },
];

export const getTPSCoordinate = (id: number): TPSCoordinate | undefined => {
	return tpsCoordinates.find((tps) => tps.id === id);
};
