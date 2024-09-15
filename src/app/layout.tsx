import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "../styles/PulsingDot.css";
import ClientWrapper from "./ClientWrapper";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<head>
				<link rel='manifest' href='/manifest.json' />
				<meta name='theme-color' content='#fff' />
				<link rel='apple-touch-icon' href='/icon-192x192.png' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta name='apple-mobile-web-app-status-bar-style' content='default' />
				<meta name='apple-mobile-web-app-title' content='Aplikasi Voting' />
			</head>
			<body>
				<ClientWrapper>{children}</ClientWrapper>
			</body>
		</html>
	);
}
