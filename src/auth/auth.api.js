import axiosClient from "../api/axiosClient";

export async function loginApi(payload) {
    const response = await axiosClient.post("/auth/login", {
        username: payload.username,
        password: payload.password,
    });

    return response.data;
}

export async function logoutApi() {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
}

export async function getMeApi() {
    const response = await axiosClient.get("/auth/me");
    return response.data;
}