import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8888/v1/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;