// components/Header.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ToggleSwitch from "./ToggleSwitch";
import { LogOut } from "lucide-react"; // Menggunakan ikon dari lucide-react

const Header = () => {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem("user");
		window.dispatchEvent(new Event("storage"));
		router.push("/");
	};

	return (
		<header className='fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50'>
			<div className='container mx-auto px-4 py-3 flex justify-between items-center'>
				<nav>
					<ul className='flex space-x-4'>
						<li>
							<Link
								href='/input'
								className='text-gray-700 dark:text-gray-200 hover:text-blue-500'
							>
								Input Data
							</Link>
						</li>
						<li>
							<Link
								href='/recap'
								className='text-gray-700 dark:text-gray-200 hover:text-blue-500'
							>
								Rekapitulasi
							</Link>
						</li>
					</ul>
				</nav>
				<div className='flex items-center space-x-4'>
					<ToggleSwitch />
					<button
						onClick={handleLogout}
						className='flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300'
					>
						<LogOut className='mr-2 h-4 w-4' />
						Logout
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
