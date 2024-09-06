import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
	title: "Aplikasi Voting",
	description: "Sistem Voting Online",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body className='min-h-screen overflow-hidden'>{children}</body>
		</html>
	);
}
