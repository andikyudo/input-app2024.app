"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToggleSwitch from "../components/ToggleSwitch";
import { Info, AlertCircle } from "lucide-react";
import { login, saveUserLocation } from "../utils/authData";

type NumericInputProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	label: string;
	maxLength: number;
	onComplete: () => void;
};

const NumericInput: React.FC<NumericInputProps> = ({
	value,
	onChange,
	placeholder,
	label,
	maxLength,
	onComplete,
}) => {
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, maxLength);
	}, [maxLength]);

	const handleChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const newValue = e.target.value.replace(/[^0-9]/g, "");
		if (newValue.length <= 1) {
			const newValues = value.split("");
			newValues[index] = newValue;
			const updatedValue = newValues.join("");
			onChange(updatedValue);

			if (newValue && index < maxLength - 1) {
				inputRefs.current[index + 1]?.focus();
			} else if (updatedValue.length === maxLength) {
				onComplete();
			}
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	return (
		<div className='mb-4 w-full'>
			<label className='block text-sm font-medium text-gray-300 mb-1'>
				{label}
			</label>
			<div className='flex justify-start space-x-1'>
				{[...Array(maxLength)].map((_, index) => (
					<div key={index} className='relative'>
						<input
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type='text'
							maxLength={1}
							value={value[index] || ""}
							onChange={(e) => handleChange(index, e)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className='w-6 h-8 text-center bg-transparent border-b border-gray-600 focus:border-blue-500 focus:outline-none text-sm text-white'
						/>
						{!value[index] && (
							<span className='absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none text-xs'>
								{placeholder[index]}
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const LoginPage: React.FC = () => {
	const [nrp, setNrp] = useState("");
	const [noHandphone, setNoHandphone] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const [locationStatus, setLocationStatus] = useState<
		"idle" | "requesting" | "success" | "error"
	>("idle");
	const router = useRouter();

	const handleLogin = async () => {
		if (nrp.length === 8 && noHandphone.length === 12) {
			setLoading(true);
			setError("");

			try {
				const result = await login(nrp, noHandphone);

				if (result.success && result.user) {
					localStorage.setItem("user", JSON.stringify(result.user));
					window.dispatchEvent(new Event("storage"));

					// Request location after successful login
					setLocationStatus("requesting");
					console.log("Memulai proses pengambilan lokasi...");
					const locationSaved = await saveUserLocation(result.user.id);
					setLocationStatus(locationSaved ? "success" : "error");
					console.log(
						"Status penyimpanan lokasi:",
						locationSaved ? "berhasil" : "gagal"
					);

					// Navigate to input page regardless of location status
					void router.push("/input");
				} else {
					setError(result.message || "Terjadi kesalahan saat login");
				}
			} catch (error) {
				console.error("Error saat proses login:", error);
				setError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
			} finally {
				setLoading(false);
			}
		} else {
			setError("Panjang NRP atau No. Handphone tidak sesuai");
		}
	};

	return (
		<div className='flex flex-col min-h-screen items-center justify-center bg-gray-900 transition-colors duration-300 relative p-4'>
			<div className='absolute top-4 right-4'>
				<ToggleSwitch />
			</div>
			<div className='w-full max-w-md'>
				<h1 className='text-2xl font-bold mb-6 text-white text-center'>
					Login Aplikasi Voting
				</h1>

				<div className='space-y-4'>
					<NumericInput
						value={nrp}
						onChange={setNrp}
						placeholder='________'
						label='NRP'
						maxLength={8}
						onComplete={() => {}}
					/>
					<NumericInput
						value={noHandphone}
						onChange={setNoHandphone}
						placeholder='____________'
						label='No. Handphone'
						maxLength={12}
						onComplete={() => {}}
					/>
					{error && (
						<div className='bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center'>
									<AlertCircle className='h-4 w-4 mr-2 flex-shrink-0' />
									<p className='text-xs'>{error}</p>
								</div>
								<button
									onClick={() => {
										void window.open("https://wa.me/+6281234567890", "_blank");
									}}
									className='text-xs text-red-600 hover:text-red-800 underline ml-2'
								>
									Hubungi Admin
								</button>
							</div>
						</div>
					)}
					<button
						onClick={handleLogin}
						disabled={loading}
						className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm'
					>
						{loading ? "Sedang Login..." : "Login"}
					</button>
				</div>

				{locationStatus === "requesting" && (
					<div className='mt-4 text-yellow-500'>Meminta akses lokasi...</div>
				)}

				{locationStatus === "success" && (
					<div className='mt-4 text-green-500'>Lokasi berhasil disimpan</div>
				)}

				{locationStatus === "error" && (
					<div className='mt-4 text-red-500'>
						Gagal menyimpan lokasi. Aplikasi akan tetap berfungsi.
					</div>
				)}

				<div className='mt-8 text-center'>
					<button
						onClick={() => setShowTooltip(!showTooltip)}
						className='text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto text-sm'
					>
						<Info size={16} className='mr-1' />
						Tips penggunaan
					</button>
				</div>
			</div>

			{showTooltip && (
				<div className='fixed bottom-4 left-4 right-4 p-3 bg-gray-800 shadow-lg rounded-lg max-w-sm mx-auto'>
					<p className='text-xs text-gray-300 text-center'>
						Untuk efisiensi gunakan browser Chrome di HP anda (download jika
						belum ada), kemudian klik tanda titik 3 di sudut kanan atas,
						kemudian pilih "Tambahkan ke Layar Utama/Desktop", selanjutnya
						aplikasi akan berada di layar utama HP anda.
					</p>
				</div>
			)}
		</div>
	);
};

export default LoginPage;
