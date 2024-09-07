"use client";

import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import ToggleSwitch from "../../components/ToggleSwitch";

const NumericInput = ({ value, onChange, label }) => {
	const inputRefs = useRef([]);

	const handleChange = (index, e) => {
		const newValue = e.target.value.replace(/[^0-9]/g, "");
		if (newValue.length <= 1) {
			const newValues = [...value];
			newValues[index] = newValue;
			onChange(newValues.join(""));

			if (newValue && index < 4) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	return (
		<div className='mb-6'>
			<div className='flex items-center mb-2'>
				<label className='text-sm font-medium text-gray-700 dark:text-gray-300 w-1/2 text-left'>
					{label}
				</label>
				<div className='flex justify-start space-x-2 w-1/2'>
					{[0, 1, 2, 3, 4].map((index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type='text'
							inputMode='numeric'
							pattern='[0-9]*'
							maxLength={1}
							value={value[index] || ""}
							onChange={(e) => handleChange(index, e)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className={`w-8 h-10 text-center bg-transparent border-b-2 border-gray-400 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-xl text-gray-900 dark:text-white ${
								value[index] ? "bg-blue-100 dark:bg-blue-900" : ""
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

const CandidateInput = ({ label, candidates, onChange }) => {
	return (
		<div className='mb-8'>
			<h3 className='text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200'>
				{label}
			</h3>
			{candidates.map((candidate, index) => (
				<NumericInput
					key={index}
					value={candidate}
					onChange={(value) => onChange(index, value)}
					label={`Pasangan ${index + 1}`}
				/>
			))}
		</div>
	);
};

const InputPage = () => {
	const [step, setStep] = useState("selectTPS");
	const [tps, setTps] = useState("");
	const [gubernurCandidates, setGubernurCandidates] = useState(["", "", ""]);
	const [walikotaCandidates, setWalikotaCandidates] = useState(["", ""]);
	const [photo, setPhoto] = useState(null);

	const fileInputRef = useRef(null);
	const cameraInputRef = useRef(null);

	const handleTpsChange = (e) => {
		setTps(e.target.value);
	};

	const handleTpsSubmit = (e) => {
		e.preventDefault();
		if (tps) {
			setStep("inputData");
		}
	};

	const handleGubernurChange = (index, value) => {
		const newCandidates = [...gubernurCandidates];
		newCandidates[index] = value;
		setGubernurCandidates(newCandidates);
	};

	const handleWalikotaChange = (index, value) => {
		const newCandidates = [...walikotaCandidates];
		newCandidates[index] = value;
		setWalikotaCandidates(newCandidates);
	};

	const handlePhotoUpload = (e) => {
		const file = e.target.files[0];
		setPhoto(file);
	};

	const handleCameraCapture = (e) => {
		const file = e.target.files[0];
		setPhoto(file);
	};

	const handleSubmit = () => {
		console.log("Submitting data:", {
			tps,
			gubernurCandidates,
			walikotaCandidates,
			photo,
		});
		// Here you would typically send the data to your backend
		// After successful submission, reset the form and go back to TPS selection
		setTps("");
		setGubernurCandidates(["", "", ""]);
		setWalikotaCandidates(["", ""]);
		setPhoto(null);
		setStep("selectTPS");
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			<div className='absolute top-4 right-4'>
				<ToggleSwitch />
			</div>
			<main className='flex-1 flex flex-col items-center justify-center px-4 sm:px-20 pt-10 pb-20 overflow-y-auto'>
				<h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
					Input Data Pemilihan
				</h1>
				<div className='w-full max-w-md'>
					{step === "selectTPS" && (
						<form onSubmit={handleTpsSubmit} className='mb-6'>
							<label
								htmlFor='tps'
								className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
							>
								Pilih TPS (1-900)
							</label>
							<select
								id='tps'
								value={tps}
								onChange={handleTpsChange}
								className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
							>
								<option value=''>Pilih TPS</option>
								{[...Array(900)].map((_, i) => (
									<option key={i + 1} value={i + 1}>
										{i + 1}
									</option>
								))}
							</select>
							<button
								type='submit'
								className='mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300'
							>
								Lanjut
							</button>
						</form>
					)}

					{step === "inputData" && (
						<>
							<h2 className='text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>
								TPS {tps}
							</h2>

							<CandidateInput
								label='Gubernur dan Wakil Gubernur'
								candidates={gubernurCandidates}
								onChange={handleGubernurChange}
							/>

							<CandidateInput
								label='Walikota dan Wakil Walikota'
								candidates={walikotaCandidates}
								onChange={handleWalikotaChange}
							/>

							<div className='mb-6'>
								<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									Upload Foto Dokumen
								</label>
								<div className='flex space-x-2'>
									<button
										onClick={() => fileInputRef.current.click()}
										className='flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300'
									>
										Pilih File
									</button>
									<button
										onClick={() => cameraInputRef.current.click()}
										className='flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300'
									>
										Ambil Foto
									</button>
								</div>
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handlePhotoUpload}
									className='hidden'
								/>
								<input
									ref={cameraInputRef}
									type='file'
									accept='image/*'
									capture='environment'
									onChange={handleCameraCapture}
									className='hidden'
								/>
								{photo && (
									<p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
										Foto berhasil diupload
									</p>
								)}
							</div>

							<button
								className='mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300'
								onClick={handleSubmit}
							>
								Submit dan Kembali ke Pemilihan TPS
							</button>
						</>
					)}
				</div>
			</main>
		</div>
	);
};

export default function Home() {
	return <InputPage />;
}
