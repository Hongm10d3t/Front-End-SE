export function formatDate(dateValue) {
    if (!dateValue) return "--";

    try {
        return new Date(dateValue).toLocaleString("vi-VN");
    } catch {
        return "--";
    }
}

export function formatDateOnly(dateValue) {
    if (!dateValue) return "--";

    try {
        return new Date(dateValue).toLocaleDateString("vi-VN");
    } catch {
        return "--";
    }
}

export function formatCourseStatus(status) {
    if (status === "active") return "Đang mở";
    if (status === "closed") return "Đã đóng";
    return status || "--";
}

export function getCourseStatusClass(status) {
    if (status === "active") return "teacher-badge active";
    if (status === "closed") return "teacher-badge closed";
    return "teacher-badge";
}

export function formatLevel(level) {
    if (level === "easy") return "Dễ";
    if (level === "medium") return "Trung bình";
    if (level === "hard") return "Khó";
    return level || "--";
}

export function getLevelClass(level) {
    if (level === "easy") return "teacher-badge easy";
    if (level === "medium") return "teacher-badge medium";
    if (level === "hard") return "teacher-badge hard";
    return "teacher-badge";
}

export function getQuestionCount(item) {
    if (Array.isArray(item?.questions)) return item.questions.length;
    if (typeof item?.questionCount === "number") return item.questionCount;
    if (typeof item?.totalQuestions === "number") return item.totalQuestions;
    return 0;
}

export function getExamQuestionCount(exam) {
    if (Array.isArray(exam?.questions)) return exam.questions.length;
    if (typeof exam?.questionCount === "number") return exam.questionCount;
    if (typeof exam?.totalQuestions === "number") return exam.totalQuestions;
    return 0;
}

export function splitMaterialsByType(materials) {
    const list = Array.isArray(materials) ? materials : [];

    return {
        videos: list.filter((item) => item?.type === "video"),
        documents: list.filter((item) => item?.type === "document"),
    };
}
export function buildMaterialDisplayLink(material) {
    if (!material) return "";

    if (material.type === "video") {
        return material.url || material.fileUrl || "";
    }

    if (material.fileUrl) {
        if (material.fileUrl.startsWith("http")) return material.fileUrl;
        return `http://localhost:8888${material.fileUrl}`;
    }

    if (material.fileName) {
        return `http://localhost:8888/file/document/${material.fileName}`;
    }

    return "";
}

export function extractExamQuestions(exam) {
    if (!exam) return [];

    if (Array.isArray(exam.questions)) return exam.questions;
    if (Array.isArray(exam.questionIds)) return exam.questionIds;
    if (Array.isArray(exam.items)) return exam.items;

    return [];
}