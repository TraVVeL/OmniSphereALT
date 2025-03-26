import axios from "axios";

class TokenService {
    static getAccessToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.access || null;
    }

    static async refreshAccessToken() {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.refresh) throw new Error("No refresh token");

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/en/api/token/refresh/`, {
                refresh: user.refresh,
            });

            const newAccess = response.data.access;
            user.access = newAccess;
            localStorage.setItem("user", JSON.stringify(user));
            return newAccess;
        } catch (error) {
            console.error("Error updating token", error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem("user");
    }
}

export default TokenService;
