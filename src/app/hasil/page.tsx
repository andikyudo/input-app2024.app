"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "../../components/Header";
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy } from "lucide-react";

const gubernurCandidates = [
	"Sutarmidji - Didi Haryono",
	"Ria Norsan - Krisantus K.",
	"Muda M. - Jakius Sinyor",
];

const walikotaCandidates = [
	"Mulyadi - Harti Hartidjah",
	"Edi Rusdi Kamtono - Bahasan",
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const kecamatanList = [
	"Pontianak Utara",
	"Pontianak Timur",
	"Pontianak Selatan",
	"Pontianak Tenggara",
	"Pontianak Barat",
	"Pontianak Kota",
];

interface VotingData {
	tps: string;
	gubernurCandidates: string[];
	walikotaCandidates: string[];
	kecamatan?: string;
	kelurahan?: string;
}

interface ChartData {
	name: string;
	votes: number;
	percentage: number;
}

const HasilPage: React.FC = () => {
	const [allData, setAllData] = useState<VotingData[]>([]);
	const { theme } = useTheme();
	const [selectedKecamatan, setSelectedKecamatan] = useState("");
	const [selectedKelurahan, setSelectedKelurahan] = useState("");
	const [kelurahanList, setKelurahanList] = useState<string[]>([]);

	useEffect(() => {
		const savedData = localStorage.getItem("votingData");
		if (savedData) {
			const parsedData: VotingData[] = JSON.parse(savedData);
			setAllData(parsedData);
		}
	}, []);

	useEffect(() => {
		if (selectedKecamatan) {
			setKelurahanList(["Kelurahan A", "Kelurahan B", "Kelurahan C"]);
		} else {
			setKelurahanList([]);
		}
	}, [selectedKecamatan]);

	const formatNumber = (num: number): string => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};

	const calculateTotalVotes = (
		candidateType: "gubernurCandidates" | "walikotaCandidates"
	): number => {
		return allData.reduce((total, tps) => {
			return (
				total +
				tps[candidateType].reduce(
					(sum, votes) => sum + parseInt(votes || "0"),
					0
				)
			);
		}, 0);
	};

	const calculateCandidateVotes = (
		candidateType: "gubernurCandidates" | "walikotaCandidates",
		candidateIndex: number
	): number => {
		return allData.reduce((total, tps) => {
			return total + parseInt(tps[candidateType][candidateIndex] || "0");
		}, 0);
	};

	const generateChartData = (
		candidates: string[],
		candidateType: "gubernurCandidates" | "walikotaCandidates"
	): ChartData[] => {
		const totalVotes = calculateTotalVotes(candidateType);
		return candidates
			.map((candidate, index) => {
				const votes = calculateCandidateVotes(candidateType, index);
				return {
					name: candidate,
					votes: votes,
					percentage: (votes / totalVotes) * 100,
				};
			})
			.sort((a, b) => b.percentage - a.percentage);
	};

	const gubernurChartData = generateChartData(
		gubernurCandidates,
		"gubernurCandidates"
	);
	const walikotaChartData = generateChartData(
		walikotaCandidates,
		"walikotaCandidates"
	);

	const CandidateBar: React.FC<{ data: ChartData; color: string }> = ({
		data,
		color,
	}) => (
		<div className='flex flex-col sm:flex-row items-start sm:items-center mb-4'>
			<div className='w-full sm:w-40 truncate mr-2 mb-2 sm:mb-0 text-gray-800 dark:text-white'>
				{data.name}
			</div>
			<div className='flex-grow w-full sm:w-auto'>
				<div className='relative h-6 bg-gray-200 dark:bg-gray-700 rounded'>
					<div
						className='absolute top-0 left-0 h-full rounded'
						style={{
							width: `${data.percentage}%`,
							backgroundColor: color,
						}}
					></div>
					<span className='absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold text-gray-800 dark:text-white'>
						{data.percentage.toFixed(2)}%
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
			<Header />
			<main className='flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-20 pb-10 overflow-y-auto'>
				<h1 className='text-2xl sm:text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center'>
					Hasil Pemilihan
				</h1>

				<div className='w-full max-w-md mb-6'>
					<div className='flex flex-col gap-4'>
						<select
							value={selectedKecamatan}
							onChange={(e) => setSelectedKecamatan(e.target.value)}
							className='p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full'
						>
							<option value=''>Pilih Kecamatan</option>
							{kecamatanList.map((kecamatan) => (
								<option key={kecamatan} value={kecamatan}>
									{kecamatan}
								</option>
							))}
						</select>
						<select
							value={selectedKelurahan}
							onChange={(e) => setSelectedKelurahan(e.target.value)}
							className='p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full'
							disabled={!selectedKecamatan}
						>
							<option value=''>Pilih Kelurahan</option>
							{kelurahanList.map((kelurahan) => (
								<option key={kelurahan} value={kelurahan}>
									{kelurahan}
								</option>
							))}
						</select>
					</div>
				</div>

				{(selectedKecamatan || selectedKelurahan) && (
					<div className='w-full max-w-4xl space-y-6'>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
							<div className='p-4'>
								<h2 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
									Gubernur dan Wakil Gubernur
								</h2>
								{gubernurChartData.map((data, idx) => (
									<CandidateBar
										key={idx}
										data={data}
										color={COLORS[idx % COLORS.length]}
									/>
								))}
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
							<div className='p-4'>
								<h2 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
									Walikota dan Wakil Walikota
								</h2>
								{walikotaChartData.map((data, idx) => (
									<CandidateBar
										key={idx}
										data={data}
										color={COLORS[idx % COLORS.length]}
									/>
								))}
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
							<div className='p-4'>
								<h2 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200'>
									Rekapitulasi TPS
								</h2>
								<div className='overflow-x-auto'>
									<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
										<thead className='bg-gray-50 dark:bg-gray-700'>
											<tr>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
													TPS
												</th>
												{gubernurCandidates.map((_, idx) => (
													<th
														key={idx}
														className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider'
													>
														Gubernur {idx + 1}
													</th>
												))}
												{walikotaCandidates.map((_, idx) => (
													<th
														key={idx}
														className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														Walikota {idx + 1}
													</th>
												))}
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
											{allData.map((tps, idx) => (
												<tr
													key={idx}
													className={
														idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
													}
												>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
														{tps.tps}
													</td>
													{tps.gubernurCandidates.map((votes, idx) => (
														<td
															key={idx}
															className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white'
														>
															{votes}
														</td>
													))}
													{tps.walikotaCandidates.map((votes, idx) => (
														<td
															key={idx}
															className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'
														>
															{votes}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default HasilPage;
