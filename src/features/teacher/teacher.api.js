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
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.studentIds)) return data.studentIds;
    if (Array.isArray(data?.students)) return data.students;
    if (Array.isArray(data?.teacherIds)) return data.teacherIds;
    if (Array.isArray(data?.questions)) return data.questions;

    return [];
}

export async function getTeacherTermsApi() {
    const response = await axiosClient.get("/teacher/terms");
    return toArray(response.data);
}

export async function getTeacherCoursesApi(termId) {
    const response = await axiosClient.get(`/teacher/${termId}/courses`);
    return toArray(response.data);
}

export async function getTeacherCourseStudentsApi(courseId) {
    const response = await axiosClient.get(`/teacher/term/${courseId}/students`);
    const data = unwrapResponse(response.data);

    if (Array.isArray(data)) {
        return {
            course: null,
            students: data,
        };
    }

    return {
        course: data || null,
        students: Array.isArray(data?.studentIds)
            ? data.studentIds
            : Array.isArray(data?.students)
                ? data.students
                : [],
    };
}

export async function getTeacherQuestionBanksApi(courseId) {
    const response = await axiosClient.get(`/teacher/course/${courseId}/questionbank`);
    return toArray(response.data);
}

export async function createTeacherQuestionBankApi(courseId, formData) {
    const payload = {
        title: formData.title,
        name: formData.title,
        description: formData.description || "",
    };

    const response = await axiosClient.post(
        `/teacher/course/${courseId}/questionbank`,
        payload
    );

    return unwrapResponse(response.data);
}

export async function deleteTeacherQuestionBankApi(courseId, questionBankId) {
    const response = await axiosClient.delete(
        `/teacher/course/${courseId}/questionbank/${questionBankId}`
    );

    return unwrapResponse(response.data);
}

export async function importTeacherQuestionBankCsvApi(questionBankId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post(
        `/teacher/question-bank/${questionBankId}/import-csv`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return unwrapResponse(response.data);
}

export async function getTeacherQuestionListApi(questionBankId) {
    const response = await axiosClient.get(
        `/teacher/question-bank/${questionBankId}/questionList`
    );

    return toArray(response.data);
}

export async function getTeacherExamsApi(courseId) {
    const response = await axiosClient.get(`/teacher/exams/${courseId}`);
    return toArray(response.data);
}

export async function createTeacherRandomExamApi(formData) {
    const payload = {
        courseId: formData.courseId,
        questionBankId: formData.questionBankId,
        bankId: formData.questionBankId,
        title: formData.title,
        name: formData.title,
        description: formData.description || "",
        questionCount: Number(formData.questionCount),
        totalQuestions: Number(formData.questionCount),
        durationMinutes: Number(formData.durationMinutes),
        duration: Number(formData.durationMinutes),
        startAt: formData.startAt || null,
        endAt: formData.endAt || null,
    };

    const response = await axiosClient.post("/teacher/exam/random", payload);
    return unwrapResponse(response.data);
}

export async function getTeacherExamDetailApi(examId) {
    const response = await axiosClient.get(`/teacher/exam/${examId}`);
    return unwrapResponse(response.data);
}

export async function deleteTeacherExamApi(examId) {
    const response = await axiosClient.delete(`/teacher/exam/${examId}`);
    return unwrapResponse(response.data);
}

export async function getTeacherVideoMaterialApi(courseId) {
    const response = await axiosClient.get(
        `/teacher/term/course/${courseId}/material`,
        {
            params: { type: "video" },
        }
    );

    const raw = unwrapResponse(response.data);
    return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

export async function getTeacherDocumentMaterialApi(courseId) {
    const response = await axiosClient.get(
        `/teacher/term/course/${courseId}/material`,
        {
            params: { type: "document" },
        }
    );

    const raw = unwrapResponse(response.data);
    return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

export async function uploadTeacherVideoMaterialApi(courseId, formData) {
    const payload = new FormData();
    payload.append("type", "video");
    payload.append("title", formData.title);
    payload.append("description", formData.description || "");
    payload.append("url", formData.url || "");

    const response = await axiosClient.post(
        `/teacher/term/course/${courseId}/material`,
        payload,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return unwrapResponse(response.data);
}

export async function uploadTeacherDocumentMaterialApi(courseId, formData) {
    const payload = new FormData();
    payload.append("type", "document");
    payload.append("title", formData.title);
    payload.append("description", formData.description || "");

    if (formData.file) {
        payload.append("file", formData.file);
    }

    const response = await axiosClient.post(
        `/teacher/term/course/${courseId}/material`,
        payload,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );


    return unwrapResponse(response.data);
}
