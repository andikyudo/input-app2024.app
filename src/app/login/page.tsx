"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Di sini Anda akan menambahkan logika autentikasi
		console.log("Login attempt:", username, password);
		// Untuk sementara, kita akan langsung redirect ke halaman utama
		router.push("/");
	};

	return (
		<div className='flex min-h-screen flex-col items-center justify-center py-2'>
			<main className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
				<h1 className='text-6xl font-bold'>
					Login ke{" "}
					<a className='text-blue-600' href='/'>
						Aplikasi Voting
					</a>
				</h1>

				<p className='mt-3 text-2xl'>
					Masukkan kredensial Anda untuk mengakses sistem.
				</p>

				<form
					onSubmit={handleSubmit}
					className='mt-6 flex w-full max-w-xs flex-col'
				>
					<input
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder='Username'
						className='mb-4 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none'
						required
					/>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Password'
						className='mb-4 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none'
						required
					/>
					<button
						type='submit'
						className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5'
					>
						Login
					</button>
				</form>
			</main>

			<footer className='flex h-24 w-full items-center justify-center border-t'></footer>
		</div>
	);
}
