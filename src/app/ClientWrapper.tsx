"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";

const Header = dynamic(() => import("../components/Header"), { ssr: false });

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();

	useEffect(() => {
		const checkLoginStatus = () => {
			const user = localStorage.getItem("user");
			setIsLoggedIn(!!user);
			setIsLoading(false);
		};

		checkLoginStatus();
		window.addEventListener("storage", checkLoginStatus);

		return () => {
			window.removeEventListener("storage", checkLoginStatus);
		};
	}, []);

	if (isLoading) {
		return null; // or a loading spinner
	}

	return (
		<ThemeProvider attribute='class'>
			<div className='min-h-screen flex flex-col'>
				{isLoggedIn && pathname !== "/" && <Header />}
				<main className='flex-grow flex items-center justify-center overflow-auto'>
					<div className='w-full max-w-4xl px-4 py-8 bg-white dark:bg-black'>
						{children}
					</div>
				</main>
			</div>
		</ThemeProvider>
	);
};

export default ClientWrapper;
