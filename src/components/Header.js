"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ToggleSwitch from "./ToggleSwitch";
import { Menu, X, User } from "lucide-react";
import { logout } from "../utils/authData";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [userName, setUserName] = useState("");
	const router = useRouter();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user") || "{}");
		setUserName(user.nama || "");
	}, []);

	const handleLogout = async () => {
		const user = JSON.parse(localStorage.getItem("user") || "{}");
		if (user.id) {
			const result = await logout(user.id);
			if (result.success) {
				localStorage.removeItem("user");
				window.dispatchEvent(new Event("storage"));
				router.push("/");
			} else {
				console.error("Logout failed:", result.message);
			}
		}
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<header className='bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-[9999]'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link
							href='/'
							className='text-gray-800 dark:text-white text-lg font-semibold'
							onClick={closeMenu}
						>
							Logo
						</Link>
					</div>
					{userName && (
						<div className='flex items-center bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full'>
							<User
								size={20}
								className='text-blue-500 dark:text-blue-300 mr-2'
							/>
							<span className='text-sm font-medium text-blue-700 dark:text-blue-200'>
								Selamat datang, {userName}
							</span>
						</div>
					)}
					<div className='hidden sm:flex items-center space-x-4'>
						<nav className='flex items-center space-x-4'>
							<Link
								href='/input'
								className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium'
								onClick={closeMenu}
							>
								Input Data
							</Link>
							<Link
								href='/recap'
								className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium'
								onClick={closeMenu}
							>
								Rekapitulasi
							</Link>
							<Link
								href='/hasil'
								className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium'
								onClick={closeMenu}
							>
								Hasil
							</Link>
							<Link
								href='/cari-tps'
								className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium'
								onClick={closeMenu}
							>
								Cari TPS
							</Link>
						</nav>
						<ToggleSwitch />
						<button
							onClick={handleLogout}
							className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300'
						>
							Logout
						</button>
					</div>
					<div className='sm:hidden'>
						<button
							onClick={toggleMenu}
							className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
						>
							<span className='sr-only'>Open main menu</span>
							{isMenuOpen ? (
								<X className='block h-6 w-6' aria-hidden='true' />
							) : (
								<Menu className='block h-6 w-6' aria-hidden='true' />
							)}
						</button>
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div className='sm:hidden'>
					<div className='px-2 pt-2 pb-3 space-y-1'>
						<Link
							href='/input'
							className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium'
							onClick={closeMenu}
						>
							Input Data
						</Link>
						<Link
							href='/recap'
							className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium'
							onClick={closeMenu}
						>
							Rekapitulasi
						</Link>
						<Link
							href='/hasil'
							className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium'
							onClick={closeMenu}
						>
							Hasil
						</Link>
						<Link
							href='/cari-tps'
							className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-sm font-medium'
							onClick={closeMenu}
						>
							Cari TPS
						</Link>
					</div>
					<div className='pt-4 pb-3 border-t border-gray-700'>
						<div className='flex items-center px-5 justify-between'>
							<ToggleSwitch />
							<button
								onClick={() => {
									handleLogout();
									closeMenu();
								}}
								className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300'
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
