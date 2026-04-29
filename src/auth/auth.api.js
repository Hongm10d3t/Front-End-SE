import axiosClient from "../api/axiosClient";

// export async function loginApi(payload) {
//     const response = await axiosClient.post("/auth/login", {
//         username: payload.username,
//         password: payload.password,
//     });

//     return response.data;
// }

export async function loginApi(payload) {
    console.log(">>>>>>", payload);
    try {
        const response = await axiosClient.post("/auth/login", {
            username: payload.username,
            password: payload.password,
        });

        const result = response.data;

        // Backend trả 200 nhưng login fail
        if (result?.success === false) {
            throw new Error(result?.message || "Đăng nhập thất bại.");
        }

        // Nếu backend của bạn có kiểu EC/EM
        if (result?.EC && result.EC !== 0) {
            throw new Error(result?.EM || "Đăng nhập thất bại.");
        }

        return result;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.EM ||
            error?.message ||
            "Đăng nhập thất bại.";

        throw new Error(message);
    }
}

export async function logoutApi() {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
}

export async function getMeApi() {
    const response = await axiosClient.get("/auth/me");
    return response.data;
}