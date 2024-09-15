// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	register: true,
	skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Tambahkan konfigurasi lain yang mungkin Anda perlukan di sini
};

module.exports = withPWA(nextConfig);
