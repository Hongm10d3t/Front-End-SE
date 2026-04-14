import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    deleteStudentAttemptNoteApi,
    getStudentExamAttemptDetailApi,
    saveStudentAttemptNoteApi,
} from "../../../features/student/student.api";
import StudentResultSummary from "../../../features/student/components/StudentResultSummary";
import StudentReviewQuestionList from "../../../features/student/components/StudentReviewQuestionList";
import "./ExamResultPage.css";

export default function StudentExamResultPage() {
    const { examAttemptId } = useParams();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState("");
    const [savingNote, setSavingNote] = useState(false);

    const fetchResult = async () => {
        try {
            setLoading(true);
            const data = await getStudentExamAttemptDetailApi(examAttemptId);
            setAttempt(data || null);
        } catch (error) {
            console.error(error);
            alert("Không tải được kết quả bài làm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResult();
    }, [examAttemptId]);

    const handleSaveNote = async () => {
        try {
            if (!noteText.trim()) {
                alert("Nội dung note không được để trống.");
                return;
            }

            setSavingNote(true);
            await saveStudentAttemptNoteApi(examAttemptId, {
                content: noteText,
            });

            setNoteText("");
            await fetchResult();
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.EM ||
                "Lưu note thất bại.";
            alert(message);
        } finally {
            setSavingNote(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa note này?");
        if (!confirmed) return;

        try {
            await deleteStudentAttemptNoteApi(examAttemptId, noteId);
            await fetchResult();
        } catch (error) {
            console.error(error);
            alert("Xóa note thất bại.");
        }
    };

    return (
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Kết quả bài làm</span>
                    <h2>Xem lại bài làm</h2>
                    <p>Xem câu đúng, câu sai, đáp án đúng và ghi chú cho bài làm.</p>
                </div>

                <Link className="student-back-link" to="/student/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            {loading ? (
                <div className="student-loading-card">Đang tải kết quả bài làm...</div>
            ) : attempt ? (
                <>
                    <StudentResultSummary attempt={attempt} />

                    <div className="student-note-card">
                        <h3>Ghi chú cho bài làm</h3>
                        <p>Ghi lại những nội dung cần ôn tập sau khi xem bài.</p>

                        <textarea
                            rows={5}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Ví dụ: Cần ôn lại chương 2, nhầm nhiều ở câu điều kiện..."
                        />

                        <button
                            className="student-primary-btn"
                            onClick={handleSaveNote}
                            disabled={savingNote}
                        >
                            {savingNote ? "Đang lưu..." : "Lưu note"}
                        </button>

                        <div style={{ marginTop: 18 }}>
                            <h4 style={{ marginBottom: 12 }}>Danh sách note</h4>

                            {attempt.notes?.length ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {attempt.notes.map((note) => (
                                        <div
                                            key={note._id}
                                            style={{
                                                padding: 14,
                                                borderRadius: 14,
                                                background: "#f8fafc",
                                                border: "1px solid #e2e8f0",
                                            }}
                                        >
                                            <div style={{ color: "#0f172a", marginBottom: 6 }}>
                                                {note.content}
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    gap: 12,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span style={{ fontSize: 13, color: "#64748b" }}>
                                                    {note.createdAt
                                                        ? new Date(note.createdAt).toLocaleString("vi-VN")
                                                        : "--"}
                                                </span>

                                                <button
                                                    onClick={() => handleDeleteNote(note._id)}
                                                    style={{
                                                        border: "none",
                                                        background: "#fef2f2",
                                                        color: "#dc2626",
                                                        padding: "8px 10px",
                                                        borderRadius: 10,
                                                        fontWeight: 700,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: "#64748b" }}>Chưa có note nào.</div>
                            )}
                        </div>
                    </div>

                    <StudentReviewQuestionList attempt={attempt} />
                </>
            ) : (
                <div className="student-empty-card">
                    <h3>Không có dữ liệu bài làm</h3>
                </div>
            )}
        </div>
    );
}