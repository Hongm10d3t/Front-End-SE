export function formatDateOnly(dateValue) {
    if (!dateValue) return "--";
    try {
        return new Date(dateValue).toLocaleDateString("vi-VN");
    } catch {
        return "--";
    }
}

export function formatDateTime(dateValue) {
    if (!dateValue) return "--";
    try {
        return new Date(dateValue).toLocaleString("vi-VN");
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
    if (status === "active") return "student-badge active";
    if (status === "closed") return "student-badge closed";
    return "student-badge";
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

    if (typeof material === "string") {
        if (material.startsWith("http")) return material;
        return `http://localhost:8888${material}`;
    }

    return "";
}

export function extractAttemptQuestions(attempt) {
    if (!attempt) return [];
    if (Array.isArray(attempt.questions)) return attempt.questions;
    if (Array.isArray(attempt.questionIds)) return attempt.questionIds;
    return [];
}

export function getQuestionContent(question) {
    return (
        question?.content ||
        question?.questionText ||
        question?.title ||
        question?.text ||
        "Không có nội dung"
    );
}

export function getQuestionOptions(question) {
    if (Array.isArray(question?.options)) return question.options;
    if (Array.isArray(question?.answers)) return question.answers;
    return [];
}

export function parseOption(option, index) {
    return {
        label:
            option?.label ||
            option?.key ||
            option?.optionKey ||
            String.fromCharCode(65 + index),
        text:
            option?.text ||
            option?.content ||
            option?.value ||
            option?.optionText ||
            "--",
    };
}

export function isQuestionCorrect(question) {
    if (!question) return false;
    if (typeof question?.isCorrect === "boolean") return question.isCorrect;
    return question?.selectedAnswer === question?.correctAnswer;
}

export function getAttemptQuestionId(question) {
    if (!question) return "";

    if (typeof question.questionId === "string") return question.questionId;
    if (question.questionId?._id) return question.questionId._id;
    if (question._id) return question._id;

    return "";
}

export function buildEmbeddedVideoLink(url) {
    if (!url) return "";

    // YouTube: https://www.youtube.com/watch?v=...
    if (url.includes("youtube.com/watch")) {
        const parsed = new URL(url);
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    // YouTube short: https://youtu.be/...
    if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    // Google Drive: .../file/d/FILE_ID/view
    if (url.includes("drive.google.com/file/d/")) {
        const match = url.match(/\/file\/d\/([^/]+)/);
        const fileId = match?.[1];
        return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
    }

    return url;
}

export function isDirectVideoFile(url) {
    if (!url) return false;
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}