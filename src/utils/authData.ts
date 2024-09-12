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
			throw userError;
		}

		if (userData) {
			console.log("User found:", userData);

			const { data: sessionData, error: sessionError } = await supabase
				.from("user_sessions")
				.select("*")
				.eq("user_id", userData.id)
				.single();

			if (sessionError && sessionError.code !== "PGRST116") {
				console.error("Session query error:", sessionError);
				throw sessionError;
			}

			const sessionUpdate = {
				user_id: userData.id,
				status: "logged_in",
				last_login: new Date().toISOString(),
			};

			let upsertResult;
			if (sessionData) {
				console.log("Updating existing session");
				upsertResult = await supabase
					.from("user_sessions")
					.update(sessionUpdate)
					.eq("user_id", userData.id);
			} else {
				console.log("Inserting new session");
				upsertResult = await supabase
					.from("user_sessions")
					.insert(sessionUpdate);
			}

			if (upsertResult.error) {
				console.error("Session upsert error:", upsertResult.error);
				throw upsertResult.error;
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
