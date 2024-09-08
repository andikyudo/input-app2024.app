"use client";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import Header from "../components/Header";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";

	return (
		<html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<ThemeProvider attribute='class'>
				<body className='min-h-screen'>
					{!isLoginPage && <Header />}
					<main className={`${!isLoginPage ? "pt-16" : ""}`}>{children}</main>
				</body>
			</ThemeProvider>
		</html>
	);
}
