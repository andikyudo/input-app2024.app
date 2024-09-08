// components/Header.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ToggleSwitch from "./ToggleSwitch";

const Header = () => {
	const router = useRouter();

	const handleLogout = () => {
		// Implement logout logic here (e.g., clear local storage, reset auth state)
		localStorage.removeItem("user"); // Assuming you store user info in localStorage
		router.push("/login");
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
						{/* Add more navigation items as needed */}
					</ul>
				</nav>
				<div className='flex items-center space-x-4'>
					<ToggleSwitch />
					<button
						onClick={handleLogout}
						className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300'
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
