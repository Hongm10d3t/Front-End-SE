import axiosClient from "../../api/axiosClient";

function pickArray(raw) {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.DT)) return raw.DT;
    return [];
}

export async function getTermsApi() {
    const response = await axiosClient.get("/admin/terms");
    return pickArray(response.data);
}

export async function createTermApi(formData) {
    const payload = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
    };

    const response = await axiosClient.post("/admin/term", payload);
    return response.data;
}

export async function updateTermApi(termId, formData) {
    const payload = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
    };

    const response = await axiosClient.put(`/admin/term/${termId}`, payload);
    return response.data;
}

export async function deleteTermApi(termId) {
    const response = await axiosClient.delete(`/admin/term/${termId}`);
    return response.data;
}