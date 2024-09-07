"use client";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body className='min-h-screen'>
				<ThemeProvider attribute='class'>{children}</ThemeProvider>
			</body>
		</html>
	);
}
