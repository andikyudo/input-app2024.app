"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

const gubernurCandidates = [
	"Ria Norsan - Krisantus K.",
	"Sutarmidji - Didi Haryono",
	"Muda M. - Jakius Sinyor",
];

const walikotaCandidates = ["Edi Rusdi K. - Bahasan", "Mulyadi - Harti"];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const kecamatanList = [
	"Pontianak Utara",
	"Pontianak Timur",
	"Pontianak Selatan",
	"Pontianak Tenggara",
	"Pontianak Barat",
	"Pontianak Kota",
];

const kelurahanList = {
	"Pontianak Utara": ["Kelurahan A", "Kelurahan B", "Kelurahan C"],
	"Pontianak Timur": ["Kelurahan D", "Kelurahan E", "Kelurahan F"],
	"Pontianak Selatan": ["Kelurahan G", "Kelurahan H", "Kelurahan I"],
	"Pontianak Tenggara": ["Kelurahan J", "Kelurahan K", "Kelurahan L"],
	"Pontianak Barat": ["Kelurahan M", "Kelurahan N", "Kelurahan O"],
	"Pontianak Kota": ["Kelurahan P", "Kelurahan Q", "Kelurahan R"],
};

const HasilPage = () => {
	const [allData, setAllData] = useState([]);
	const [view, setView] = useState("total");
	const [selectedKecamatan, setSelectedKecamatan] = useState("");
	const [selectedKelurahan, setSelectedKelurahan] = useState("");

	useEffect(() => {
		const savedData = localStorage.getItem("votingData");
		if (savedData) {
			setAllData(JSON.parse(savedData));
		}
	}, []);

	const calculateVotes = (
		candidateType,
		kecamatan = null,
		kelurahan = null
	) => {
		let filteredData = allData;
		if (kecamatan) {
			filteredData = filteredData.filter(
				(data) => data.kecamatan === kecamatan
			);
		}
		if (kelurahan) {
			filteredData = filteredData.filter(
				(data) => data.kelurahan === kelurahan
			);
		}

		const totalVotes = filteredData.reduce(
			(total, tps) =>
				total +
				tps[candidateType].reduce(
					(sum, votes) => sum + parseInt(votes || "0"),
					0
				),
			0
		);

		const candidates =
			candidateType === "gubernurCandidates"
				? gubernurCandidates
				: walikotaCandidates;

		return candidates
			.map((candidate, index) => {
				const votes = filteredData.reduce(
					(sum, tps) => sum + parseInt(tps[candidateType][index] || "0"),
					0
				);
				return {
					name: candidate,
					votes: votes,
					percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
				};
			})
			.sort((a, b) => b.votes - a.votes);
	};

	const renderChart = (data) => (
		<div className='w-full h-6 bg-gray-200 rounded-full mt-2 mb-4'>
			{data.map((item, index) => (
				<div
					key={index}
					style={{
						width: `${item.percentage}%`,
						backgroundColor: COLORS[index % COLORS.length],
						height: "100%",
						float: "left",
					}}
				/>
			))}
		</div>
	);

	const renderResultsForKecamatan = (kecamatan) => {
		const gubernurResults = calculateVotes("gubernurCandidates", kecamatan);
		const walikotaResults = calculateVotes("walikotaCandidates", kecamatan);

		return (
			<div
				key={kecamatan}
				className='mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'
			>
				<h2 className='text-xl font-bold p-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'>
					{kecamatan}
				</h2>
				<div className='p-4'>
					<h3 className='text-lg font-semibold mb-2 text-gray-800 dark:text-white'>
						Gubernur dan Wakil Gubernur
					</h3>
					{gubernurResults.map((candidate, index) => (
						<div key={index} className='mb-4'>
							<div className='flex justify-between items-center text-gray-800 dark:text-gray-200'>
								<span
									className={`${index === 0 ? "font-bold" : ""}`}
									style={{ color: COLORS[index] }}
								>
									{candidate.name}
								</span>
								<span>
									{candidate.votes} suara ({candidate.percentage.toFixed(2)}%)
								</span>
							</div>
							{renderChart([candidate])}
						</div>
					))}
					<h3 className='text-lg font-semibold mb-2 mt-4 text-gray-800 dark:text-white'>
						Walikota dan Wakil Walikota
					</h3>
					{walikotaResults.map((candidate, index) => (
						<div key={index} className='mb-4'>
							<div className='flex justify-between items-center text-gray-800 dark:text-gray-200'>
								<span
									className={`${index === 0 ? "font-bold" : ""}`}
									style={{ color: COLORS[index] }}
								>
									{candidate.name}
								</span>
								<span>
									{candidate.votes} suara ({candidate.percentage.toFixed(2)}%)
								</span>
							</div>
							{renderChart([candidate])}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
			<Header />
			<main className='container mx-auto px-4 pt-20 pb-10'>
				<h1 className='text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white'>
					Hasil Pemilihan
				</h1>

				<div className='flex justify-center mb-6 space-x-4'>
					<button
						onClick={() => setView("total")}
						className={`px-4 py-2 rounded ${
							view === "total"
								? "bg-blue-500 text-white"
								: "bg-blue-200 text-blue-800"
						}`}
					>
						Hasil Total
					</button>
					<button
						onClick={() => setView("perKecamatan")}
						className={`px-4 py-2 rounded ${
							view === "perKecamatan"
								? "bg-blue-500 text-white"
								: "bg-blue-200 text-blue-800"
						}`}
					>
						Hasil per Kecamatan
					</button>
				</div>

				{view === "total" && (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{kecamatanList.map((kecamatan) =>
							renderResultsForKecamatan(kecamatan)
						)}
					</div>
				)}

				{view === "perKecamatan" && (
					<div className='space-y-4'>
						<select
							value={selectedKecamatan}
							onChange={(e) => {
								setSelectedKecamatan(e.target.value);
								setSelectedKelurahan("");
							}}
							className='w-full p-2 border rounded bg-blue-100 text-blue-800'
						>
							<option value=''>Pilih Kecamatan</option>
							{kecamatanList.map((kecamatan) => (
								<option key={kecamatan} value={kecamatan}>
									{kecamatan}
								</option>
							))}
						</select>

						{selectedKecamatan && (
							<select
								value={selectedKelurahan}
								onChange={(e) => setSelectedKelurahan(e.target.value)}
								className='w-full p-2 border rounded bg-green-100 text-green-800'
							>
								<option value=''>Pilih Kelurahan</option>
								{kelurahanList[selectedKecamatan].map((kelurahan) => (
									<option key={kelurahan} value={kelurahan}>
										{kelurahan}
									</option>
								))}
							</select>
						)}

						{selectedKecamatan && renderResultsForKecamatan(selectedKecamatan)}
					</div>
				)}
			</main>
		</div>
	);
};

export default HasilPage;
