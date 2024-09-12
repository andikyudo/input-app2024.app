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
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("nrp", nrp)
			.eq("no_handphone", noHandphone)
			.single();

		if (error) throw error;

		if (data) {
			// Update user_sessions
			const { error: sessionError } = await supabase
				.from("user_sessions")
				.upsert(
					{
						user_id: data.id,
						status: "logged_in",
						last_login: new Date().toISOString(),
					},
					{
						onConflict: "user_id",
					}
				);

			if (sessionError) throw sessionError;

			return { success: true, user: data };
		} else {
			return { success: false, message: "NRP atau No. Handphone tidak valid" };
		}
	} catch (error) {
		console.error("Login error:", error);
		return { success: false, message: "Terjadi kesalahan saat login" };
	}
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
