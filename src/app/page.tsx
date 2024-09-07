"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { authenticateUser } from "../utils/authData";
import ToggleSwitch from "../components/ToggleSwitch";

const NumericInput = ({ value, onChange, placeholder, label }) => {
	const inputRefs = useRef([]);

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, 4);
	}, []);

	const handleChange = (index, e) => {
		const newValue = [...value];
		newValue[index] = e.target.value;
		onChange(newValue.join(""));

		if (e.target.value && index < 3) {
			inputRefs.current[index + 1].focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	return (
		<div className='mb-6'>
			<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
				{label}
			</label>
			<div className='flex justify-center space-x-4 px-4'>
				{[0, 1, 2, 3].map((index) => (
					<div key={index} className='relative'>
						<input
							ref={(el) => (inputRefs.current[index] = el)}
							type='text'
							maxLength={1}
							value={value[index] || ""}
							onChange={(e) => handleChange(index, e)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className='w-10 h-12 text-center bg-transparent border-b-2 border-gray-400 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-xl text-gray-900 dark:text-white'
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

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (username.length === 4 && password.length === 4) {
			if (authenticateUser(username, password)) {
				console.log("Login berhasil:", username);
				router.push("/input"); // Arahkan ke halaman input setelah login berhasil
			} else {
				setError("Username atau password salah");
				setTimeout(() => setError(""), 3000);
			}
		}
	}, [username, password, router]);

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	return (
		<div className='flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			<div className='absolute top-4 right-4'>
				<ToggleSwitch />
			</div>
			<main className='flex w-full flex-1 flex-col items-center justify-center px-4 sm:px-20 text-center'>
				<h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
					Login ke Aplikasi Voting
				</h1>

				<div className='w-full max-w-xs'>
					<NumericInput
						value={username}
						onChange={setUsername}
						placeholder='0000'
						label='Username'
					/>
					<NumericInput
						value={password}
						onChange={setPassword}
						placeholder='****'
						label='Password'
					/>
					<div className='relative h-12 mt-6'>
						{error && (
							<div
								className='absolute w-full transform transition-all duration-300 ease-in-out'
								style={{
									top: error ? "0" : "-100%",
									opacity: error ? "1" : "0",
								}}
							>
								<div className='bg-red-500 text-white py-3 px-4 rounded-md'>
									{error}
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

export default function Home() {
	return (
		<ThemeProvider attribute='class'>
			<LoginPage />
		</ThemeProvider>
	);
}
