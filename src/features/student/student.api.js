import axiosClient from "../../api/axiosClient";

function unwrapResponse(raw) {
    if (raw?.data !== undefined) return raw.data;
    if (raw?.DT !== undefined) return raw.DT;
    return raw;
}

function toArray(raw) {
    const data = unwrapResponse(raw);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.DT)) return data.DT;
    if (Array.isArray(data?.studentIds)) return data.studentIds;
    if (Array.isArray(data?.teacherIds)) return data.teacherIds;
    if (Array.isArray(data?.questions)) return data.questions;

    return [];
}

export async function getStudentTermsApi() {
    const response = await axiosClient.get("/student/terms");
    return toArray(response.data);
}

export async function getStudentCoursesApi(termId) {
    const response = await axiosClient.get(`/student/${termId}/courses`);
    return toArray(response.data);
}

export async function getStudentCourseDetailApi(courseId) {
    const response = await axiosClient.get(`/student/term/${courseId}`);
    return unwrapResponse(response.data);
}

export async function getStudentCourseStudentsApi(courseId) {
    const response = await axiosClient.get(`/student/term/${courseId}/students`);
    const raw = unwrapResponse(response.data);

    return {
        course: raw || null,
        students: Array.isArray(raw?.studentIds) ? raw.studentIds : [],
    };
}

export async function getStudentCourseTeachersApi(courseId) {
    const response = await axiosClient.get(`/student/term/${courseId}/teacher`);
    const raw = unwrapResponse(response.data);

    return Array.isArray(raw?.teacherIds)
        ? raw.teacherIds
        : Array.isArray(raw)
            ? raw
            : raw
                ? [raw]
                : [];
}

export async function getStudentVideoMaterialApi(courseId) {
    const response = await axiosClient.get(
        `/student/term/course/${courseId}/material`,
        {
            params: { type: "video" },
        }
    );

    const raw = unwrapResponse(response.data);
    return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

export async function getStudentDocumentMaterialApi(courseId) {
    const response = await axiosClient.get(
        `/student/term/course/${courseId}/material`,
        {
            params: { type: "document" },
        }
    );

    const raw = unwrapResponse(response.data);
    return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

export async function getStudentExamsApi(courseId) {
    const response = await axiosClient.get(`/student/exams/${courseId}`);
    return toArray(response.data);
}

export async function startStudentExamApi(examId) {
    const response = await axiosClient.post(`/student/exam/${examId}/start`);
    return unwrapResponse(response.data);
}

export async function getStudentExamAttemptDetailApi(examAttemptId) {
    const response = await axiosClient.get(`/student/examAttempt/${examAttemptId}`);
    return unwrapResponse(response.data);
}

export async function updateStudentAnswerApi(examAttemptId, questionId, selectedAnswer) {
    const response = await axiosClient.patch(
        `/student/examAttempt/${examAttemptId}/question/${questionId}/answer`,
        { selectedAnswer }
    );
    return unwrapResponse(response.data);
}

export async function submitStudentExamApi(examAttemptId) {
    const response = await axiosClient.post(
        `/student/examAttempt/${examAttemptId}/submit`
    );
    return unwrapResponse(response.data);
}

/**
 * Chưa có backend route thật.
 * Tạm để sẵn để bạn bổ sung sau.
 */
// export async function saveStudentAttemptNoteApi(examAttemptId, payload) {
//     const response = await axiosClient.post(
//         `/student/examAttempt/${examAttemptId}/note`,
//         payload
//     );
//     return unwrapResponse(response.data);
// }


export async function getStudentExamAttemptsByExamApi(examId) {
    const response = await axiosClient.get(`/student/exam/${examId}/attempts`);
    return unwrapResponse(response.data) || [];
}

export async function saveStudentAttemptNoteApi(examAttemptId, payload) {
    const response = await axiosClient.post(
        `/student/examAttempt/${examAttemptId}/note`,
        payload
    );
    return unwrapResponse(response.data);
}

export async function updateStudentAttemptNoteApi(examAttemptId, noteId, payload) {
    const response = await axiosClient.patch(
        `/student/examAttempt/${examAttemptId}/note/${noteId}`,
        payload
    );
    return unwrapResponse(response.data);
}

export async function deleteStudentAttemptNoteApi(examAttemptId, noteId) {
    const response = await axiosClient.delete(
        `/student/examAttempt/${examAttemptId}/note/${noteId}`
    );
    return unwrapResponse(response.data);
}