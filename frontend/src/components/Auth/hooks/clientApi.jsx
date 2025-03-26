import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

export const refreshAccessToken = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.refresh) throw new Error('No refresh token');

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/en/api/token/refresh/`,
            {
                refresh: user.refresh,
            },
        );

        const newAccess = response.data.access;
        user.access = newAccess;
        localStorage.setItem('user', JSON.stringify(user));
        return newAccess;
    } catch (error) {
        console.error('Error to update token', error);
        throw error;
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers[
                    'Authorization'
                ] = `Bearer ${newAccessToken}`;

                return api.request(originalRequest);
            } catch (refreshError) {
                console.error('Ошибка обновления токена', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
