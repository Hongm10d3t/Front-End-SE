import axiosClient from "../../api/axiosClient";

function unwrapResponse(responseData) {
    return responseData?.data ?? responseData;
}

export async function getAnnouncementsApi(params = {}) {
    const response = await axiosClient.get("/admin/announcements", {
        params,
    });
    return unwrapResponse(response.data);
}

export async function getAnnouncementDetailApi(id) {
    const response = await axiosClient.get(`/admin/announcement/${id}`);
    return unwrapResponse(response.data);
}

export async function createAnnouncementApi(payload) {
    const response = await axiosClient.post("/admin/announcement", payload);
    return response.data;
}

export async function updateAnnouncementApi(id, payload) {
    const response = await axiosClient.put(`/admin/announcement/${id}`, payload);
    return response.data;
}

export async function deleteAnnouncementApi(id) {
    const response = await axiosClient.delete(`/admin/announcement/${id}`);
    return response.data;
}

export async function getTeacherAnnouncementsApi() {
    const response = await axiosClient.get("/teacher/announcements");
    return unwrapResponse(response.data);
}

export async function getStudentAnnouncementsApi() {
    const response = await axiosClient.get("/student/announcements");
    return unwrapResponse(response.data);
}