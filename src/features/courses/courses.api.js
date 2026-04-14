import axiosClient from "../../api/axiosClient";

function pickArray(raw) {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.DT)) return raw.DT;
    return [];
}

export async function getCoursesByTermApi(termId) {
    const response = await axiosClient.get(`/admin/term/${termId}/courses`);
    return pickArray(response.data);
}

export async function createCourseApi(termId, formData) {
    const payload = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        status: formData.status,
    };

    const response = await axiosClient.post(`/admin/term/${termId}/course`, payload);
    return response.data;
}

export async function updateCourseApi(termId, courseId, formData) {
    const payload = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        status: formData.status,
    };

    const response = await axiosClient.put(`/admin/term/${termId}/${courseId}`, payload);
    return response.data;
}

export async function deleteCourseApi(termId, courseId) {
    const response = await axiosClient.delete(`/admin/term/${termId}/${courseId}`);
    return response.data;
}

export async function getCourseMembersApi(courseId) {
    const response = await axiosClient.get(`/admin/course/${courseId}/members`);
    const raw = response.data;
    return raw?.data || raw?.DT || raw;
}

export async function addTeacherToCourseApi(courseId, teacherId) {
    const response = await axiosClient.post(`/admin/course/${courseId}/teacher`, { teacherId });
    return response.data;
}

export async function addStudentToCourseApi(courseId, studentId) {
    const response = await axiosClient.post(`/admin/course/${courseId}/student`, { studentId });
    return response.data;
}

export async function removeStudentFromCourseApi(courseId, studentId) {
    const response = await axiosClient.delete(`/admin/course/${courseId}/student/${studentId}`);
    return response.data;
}

export async function removeTeacherFromCourseApi(courseId, teacherId) {
    const response = await axiosClient.delete(`/admin/course/${courseId}/teacher/${teacherId}`);
    return response.data;
}