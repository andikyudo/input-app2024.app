export interface TPSCoordinate {
	id: number;
	name: string;
	lat: number;
	lng: number;
}

export const tpsCoordinates: TPSCoordinate[] = [
	{ id: 1, name: "TPS 1", lat: -0.04164812873815405, lng: 109.3362177483 },
	{ id: 2, name: "TPS 2", lat: -0.0425493, lng: 109.323604 },
	{ id: 3, name: "TPS 3", lat: -0.0425486, lng: 109.3237471 },
	{ id: 4, name: "TPS 4", lat: -0.0426455, lng: 109.3240062 },
	{ id: 5, name: "TPS 5", lat: -0.0426, lng: 109.3243132 },
	{ id: 6, name: "TPS 6", lat: -0.0426374, lng: 109.3245205 },
	{ id: 7, name: "TPS 7", lat: -0.0426821, lng: 109.3247352 },
	{ id: 8, name: "TPS 8", lat: -0.0427183, lng: 109.3249604 },
	{ id: 9, name: "TPS 9", lat: -0.0427152, lng: 109.3251963 },
	{ id: 10, name: "TPS 10", lat: -0.0427114, lng: 109.3254308 },
	{ id: 11, name: "TPS 11", lat: -0.0427084, lng: 109.3256653 },
	{ id: 12, name: "TPS 12", lat: -0.0427047, lng: 109.3259072 },
	{ id: 13, name: "TPS 13", lat: -0.0427017, lng: 109.3261416 },
	{ id: 14, name: "TPS 14", lat: -0.0426979, lng: 109.3263761 },
	{ id: 15, name: "TPS 15", lat: -0.0426949, lng: 109.3266106 },
	{ id: 16, name: "TPS 16", lat: -0.0426919, lng: 109.326845 },
	{ id: 17, name: "TPS 17", lat: -0.0426881, lng: 109.3270795 },
	{ id: 18, name: "TPS 18", lat: -0.0426851, lng: 109.327314 },
	{ id: 19, name: "TPS 19", lat: -0.0426814, lng: 109.3275484 },
	{ id: 20, name: "TPS 20", lat: -0.0426784, lng: 109.3277829 },
	{ id: 21, name: "TPS 21", lat: -0.0426746, lng: 109.3280174 },
	{ id: 22, name: "TPS 22", lat: -0.0426716, lng: 109.3282518 },
	{ id: 23, name: "TPS 23", lat: -0.0426678, lng: 109.3284863 },
	{ id: 24, name: "TPS 24", lat: -0.0426648, lng: 109.3287208 },
	{ id: 25, name: "TPS 25", lat: -0.0426611, lng: 109.3289552 },
	{ id: 26, name: "TPS 26", lat: -0.0426581, lng: 109.3291897 },
	{ id: 27, name: "TPS 27", lat: -0.0426543, lng: 109.3294242 },
	{ id: 28, name: "TPS 28", lat: -0.0426513, lng: 109.3296586 },
	{ id: 29, name: "TPS 29", lat: -0.0426475, lng: 109.3298931 },
	{ id: 30, name: "TPS 30", lat: -0.0426445, lng: 109.3301276 },
	{ id: 31, name: "TPS 31", lat: -0.0426408, lng: 109.330362 },
	{ id: 32, name: "TPS 32", lat: -0.0426378, lng: 109.3305965 },
	{ id: 33, name: "TPS 33", lat: -0.042634, lng: 109.330831 },
	{ id: 34, name: "TPS 34", lat: -0.042631, lng: 109.3310654 },
	{ id: 35, name: "TPS 35", lat: -0.0426272, lng: 109.3312999 },
	{ id: 36, name: "TPS 36", lat: -0.0426242, lng: 109.3315344 },
	{ id: 37, name: "TPS 37", lat: -0.0426205, lng: 109.3317688 },
	{ id: 38, name: "TPS 38", lat: -0.0426175, lng: 109.3320033 },
	{ id: 39, name: "TPS 39", lat: -0.0426137, lng: 109.3322378 },
	{ id: 40, name: "TPS 40", lat: -0.0426107, lng: 109.3324722 },
	{ id: 41, name: "TPS 41", lat: -0.0426069, lng: 109.3327067 },
	{ id: 42, name: "TPS 42", lat: -0.0426039, lng: 109.3329412 },
	{ id: 43, name: "TPS 43", lat: -0.0426002, lng: 109.3331756 },
	{ id: 44, name: "TPS 44", lat: -0.0425972, lng: 109.3334101 },
	{ id: 45, name: "TPS 45", lat: -0.0425934, lng: 109.3336446 },
	{ id: 46, name: "TPS 46", lat: -0.0425904, lng: 109.333879 },
	{ id: 47, name: "TPS 47", lat: -0.0425866, lng: 109.3341135 },
	{ id: 48, name: "TPS 48", lat: -0.0425836, lng: 109.334348 },
	{ id: 49, name: "TPS 49", lat: -0.0425799, lng: 109.3345824 },
	{ id: 50, name: "TPS 50", lat: -0.0425769, lng: 109.3348169 },
	// ... tambahkan koordinat untuk TPS 51 sampai TPS 900 di sini
];

export const getTPSCoordinate = (id: number): TPSCoordinate | undefined => {
	return tpsCoordinates.find((tps) => tps.id === id);
};
