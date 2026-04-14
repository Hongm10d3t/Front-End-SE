import axiosClient from "../../api/axiosClient";

function extractData(response) {
    const raw = response?.data;

    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.DT)) return raw.DT;
    if (Array.isArray(raw?.users)) return raw.users;

    return raw;
}

export async function getUsersApi() {
    const response = await axiosClient.get("/admin/users");
    return extractData(response) || [];
}

export async function getUserDetailApi(userId) {
    const response = await axiosClient.get(`/admin/user/${userId}`);
    return response?.data?.data || response?.data?.DT || response?.data;
}

export async function createUserApi(formData) {
    const payload = {
        code: formData.code,
        fullName: formData.fullName,
        email: formData.email,
        passwordHash: formData.password,
        role: formData.role,
        status: formData.status,
        avatarUrl: formData.avatarUrl || "",
        department: formData.department || "",
    };

    const response = await axiosClient.post("/admin/user", payload);
    // console.log(">>>>>", response.data);
    // return response?.data;
    console.log(">>>>>", response.data);
    return response.data;
    // return response.data.data;
}

export async function updateUserApi(userId, formData) {
    const payload = {
        code: formData.code,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatarUrl: formData.avatarUrl || "",
        department: formData.department || "",
    };

    if (formData.password?.trim()) {
        payload.passwordHash = formData.password;
    }

    const response = await axiosClient.put(`/admin/user/${userId}`, payload);
    return response?.data;
}

export async function deleteUserApi(userId) {
    const response = await axiosClient.delete(`/admin/user/${userId}`);
    return response?.data;
}