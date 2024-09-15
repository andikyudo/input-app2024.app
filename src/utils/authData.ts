import { supabase } from "../utils/supabase";

export interface User {
	id: string;
	nrp: string;
	nama: string;
	no_handphone: string;
}

export const login = async (
	nrp: string,
	noHandphone: string
): Promise<{ success: boolean; user?: User; message?: string }> => {
	try {
		console.log(
			`Attempting login with NRP: ${nrp} and No. Handphone: ${noHandphone}`
		);

		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("*")
			.eq("nrp", nrp)
			.eq("no_handphone", noHandphone)
			.single();

		if (userError) {
			console.error("User query error:", userError);
			return { success: false, message: "NRP atau No. Handphone tidak valid" };
		}

		if (userData) {
			console.log("User found:", userData);

			const sessionUpdate = {
				user_id: userData.id,
				status: "logged_in",
				last_login: new Date().toISOString(),
				user_nrp: userData.nrp,
				user_nama: userData.nama,
			};

			const { error: upsertError } = await supabase
				.from("user_sessions")
				.upsert(sessionUpdate, { onConflict: "user_id" });

			if (upsertError) {
				console.error("Session upsert error:", upsertError);
				throw upsertError;
			}

			console.log("Login successful");
			return { success: true, user: userData };
		} else {
			console.log("No user found with provided credentials");
			return { success: false, message: "NRP atau No. Handphone tidak valid" };
		}
	} catch (error) {
		console.error("Login error:", error);
		return { success: false, message: "Terjadi kesalahan saat login" };
	}
};

export const saveUserLocation = async (userId: string): Promise<boolean> => {
	if (!("geolocation" in navigator)) {
		console.error("Geolocation tidak didukung oleh browser ini.");
		return false;
	}

	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					const { latitude, longitude } = position.coords;
					console.log("Lokasi diperoleh:", { latitude, longitude });

					const { data, error } = await supabase.from("user_locations").upsert(
						{
							username: userId, // Sesuaikan dengan struktur tabel Anda
							lat: latitude,
							lng: longitude,
							updated_at: new Date().toISOString(),
						},
						{ onConflict: "username" }
					);

					if (error) {
						console.error("Error menyimpan lokasi ke Supabase:", error);
						resolve(false);
					} else {
						console.log("Lokasi berhasil disimpan:", data);
						resolve(true);
					}
				} catch (error) {
					console.error("Error umum saat menyimpan lokasi:", error);
					resolve(false);
				}
			},
			(error) => {
				console.error("Error mendapatkan lokasi:", error.message);
				resolve(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			}
		);
	});
};

export const logout = async (
	userId: string
): Promise<{ success: boolean; message?: string }> => {
	try {
		const { error } = await supabase
			.from("user_sessions")
			.update({
				status: "logged_out",
				last_logout: new Date().toISOString(),
			})
			.eq("user_id", userId);

		if (error) throw error;

		return { success: true };
	} catch (error) {
		console.error("Logout error:", error);
		return { success: false, message: "Terjadi kesalahan saat logout" };
	}
};

export const isUserLoggedIn = async (userId: string): Promise<boolean> => {
	try {
		const { data, error } = await supabase
			.from("user_sessions")
			.select("status")
			.eq("user_id", userId)
			.single();

		if (error) throw error;

		return data?.status === "logged_in";
	} catch (error) {
		console.error("Error checking user login status:", error);
		return false;
	}
};
