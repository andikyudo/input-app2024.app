"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authenticateUser } from "../utils/authData";
import ToggleSwitch from "../components/ToggleSwitch";
import { Info, AlertCircle } from "lucide-react";

type NumericInputProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	label: string;
	onComplete: () => void;
	onBackspace: () => void;
	setFirstInputRef: (ref: HTMLInputElement | null) => void;
};

const NumericInput: React.FC<NumericInputProps> = ({
	value,
	onChange,
	placeholder,
	label,
	onComplete,
	onBackspace,
	setFirstInputRef,
}) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, 4);
	}, []);

	const handleChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const inputValue = e.target.value;
		if (/^[0-9]$/.test(inputValue) || inputValue === "") {
			const newValue = value.split("");
			newValue[index] = inputValue;
			onChange(newValue.join(""));

			if (inputValue && index < 3) {
				inputRefs.current[index + 1]?.focus();
			} else if (index === 3 && inputValue) {
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
		} else if (e.key === "Backspace" && index === 0 && !value[0]) {
			onBackspace();
		}
	};

	return (
		<div className='mb-6 w-full'>
			<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'>
				{label}
			</label>
			<div className='flex justify-center space-x-4'>
				{[0, 1, 2, 3].map((index) => (
					<div key={index} className='relative'>
						<input
							ref={(el) => {
								inputRefs.current[index] = el;
								if (index === 0) {
									setFirstInputRef(el);
								}
							}}
							type='text'
							maxLength={1}
							value={value[index] || ""}
							onChange={(e) => handleChange(index, e)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className='w-12 h-12 text-center bg-transparent border-b-2 border-gray-400 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-xl text-gray-900 dark:text-white'
						/>
						{!value[index] && (
							<span className='absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 pointer-events-none'>
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
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showTooltip, setShowTooltip] = useState(false);
	const [usernameFirstInput, setUsernameFirstInput] =
		useState<HTMLInputElement | null>(null);
	const [passwordFirstInput, setPasswordFirstInput] =
		useState<HTMLInputElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (username.length === 4 && password.length === 4) {
			if (authenticateUser(username, password)) {
				console.log("Login berhasil:", username);
				localStorage.setItem("user", JSON.stringify({ username }));
				window.dispatchEvent(new Event("storage"));
				void router.push("/input");
			} else {
				setError("Username atau password salah");
			}
		}
	}, [username, password, router]);

	useEffect(() => {
		if (error && (username.length < 4 || password.length < 4)) {
			setError("");
		}
	}, [username, password, error]);

	const handleUsernameComplete = () => {
		passwordFirstInput?.focus();
	};

	const handlePasswordBackspace = () => {
		usernameFirstInput?.focus();
	};

	return (
		<div className='flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative'>
			<div className='absolute top-4 right-4'>
				<ToggleSwitch />
			</div>
			<div className='w-full max-w-md px-4 sm:px-6 lg:px-8'>
				<h1 className='text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center'>
					Login Aplikasi Voting
				</h1>

				<div className='space-y-6 px-4 '>
					<div className='px-14'>
						<NumericInput
							value={username}
							onChange={setUsername}
							placeholder=''
							label='Username'
							onComplete={handleUsernameComplete}
							onBackspace={() => {}}
							setFirstInputRef={setUsernameFirstInput}
						/>
					</div>
					<div className='px-14 '>
						<NumericInput
							value={password}
							onChange={setPassword}
							placeholder='****'
							label='Password'
							onComplete={() => {}}
							onBackspace={handlePasswordBackspace}
							setFirstInputRef={setPasswordFirstInput}
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
											void window.open(
												"https://wa.me/+6281234567890",
												"_blank"
											);
										}}
										className='text-xs text-red-600 hover:text-red-800 underline ml-2'
									>
										Hubungi Admin
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className='mt-12 text-center'>
					<button
						onClick={() => setShowTooltip(!showTooltip)}
						className='text-blue-500 hover:text-blue-600 flex items-center justify-center mx-auto'
					>
						<Info size={20} className='mr-2' />
						Tips penggunaan
					</button>
				</div>
			</div>

			{showTooltip && (
				<div className='fixed bottom-4 left-4 right-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-sm mx-auto'>
					<p className='text-sm text-gray-600 dark:text-gray-300 text-center'>
						Untuk efisiensi gunakan browser Chrome di HP anda (download jika
						belum ada), kemudian klik tanda titik 3 di sudut kanan atas,
						kemudian pilih &quot;Tambahkan ke Layar Utama/Desktop&quot;,
						selanjutnya aplikasi akan berada di layar utama HP anda.
					</p>
				</div>
			)}
		</div>
	);
};

export default function Home() {
	return <LoginPage />;
}
