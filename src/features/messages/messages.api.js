import axiosClient from "../../api/axiosClient";

function unwrapResponse(responseData) {
    return responseData?.data ?? responseData;
}

export async function getTeacherCourseMessagesApi(courseId, params = {}) {
    const response = await axiosClient.get(`/teacher/course/${courseId}/messages`, {
        params,
    });
    return unwrapResponse(response.data);
}

export async function sendTeacherCourseMessageApi(courseId, payload) {
    const isFormData = payload instanceof FormData;

    const response = await axiosClient.post(
        `/teacher/course/${courseId}/message`,
        payload,
        isFormData
            ? {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
            : undefined
    );

    return response.data;
}

export async function getStudentCourseMessagesApi(courseId, params = {}) {
    const response = await axiosClient.get(`/student/course/${courseId}/messages`, {
        params,
    });
    return unwrapResponse(response.data);
}

export async function sendStudentCourseMessageApi(courseId, payload) {
    const isFormData = payload instanceof FormData;

    const response = await axiosClient.post(
        `/student/course/${courseId}/message`,
        payload,
        isFormData
            ? {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
            : undefined
    );

    return response.data;
}