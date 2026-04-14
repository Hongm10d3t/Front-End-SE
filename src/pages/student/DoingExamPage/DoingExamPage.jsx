import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getStudentExamAttemptDetailApi,
    submitStudentExamApi,
    updateStudentAnswerApi,
} from "../../../features/student/student.api";
import { extractAttemptQuestions, getAttemptQuestionId } from "../../../features/student/student.helpers";
import StudentExamQuestionPanel from "../../../features/student/components/StudentExamQuestionPanel";
import StudentExamSidebar from "../../../features/student/components/StudentExamSidebar";
import "./DoingExamPage.css";

export default function StudentDoingExamPage() {
    const { examAttemptId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [savingAnswer, setSavingAnswer] = useState(false);

    const fetchAttempt = async () => {
        try {
            setLoading(true);
            const data = await getStudentExamAttemptDetailApi(examAttemptId);
            setAttempt(data || null);
        } catch (error) {
            console.error(error);
            alert("Không tải được bài làm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttempt();
    }, [examAttemptId]);

    const questions = useMemo(() => extractAttemptQuestions(attempt), [attempt]);
    const currentQuestion = questions[currentIndex];

    const handleChooseAnswer = async (selectedAnswer) => {
        const questionId = getAttemptQuestionId(currentQuestion);

        if (!questionId) {
            console.log("currentQuestion =", currentQuestion);
            alert("Không lấy được questionId. Hãy kiểm tra response examAttempt detail.");
            return;
        }

        try {
            setSavingAnswer(true);
            await updateStudentAnswerApi(examAttemptId, questionId, selectedAnswer);

            setAttempt((prev) => {
                if (!prev) return prev;

                const newQuestions = [...(prev.questions || [])];
                newQuestions[currentIndex] = {
                    ...newQuestions[currentIndex],
                    selectedAnswer,
                };

                return {
                    ...prev,
                    questions: newQuestions,
                };
            });
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Lưu đáp án thất bại.";
            alert(message);
        } finally {
            setSavingAnswer(false);
        }
    };

    const handleSubmitExam = async () => {
        const confirmed = window.confirm("Bạn có chắc muốn nộp bài?");
        if (!confirmed) return;

        try {
            setSubmitting(true);
            await submitStudentExamApi(examAttemptId);
            navigate(`/student/exam-attempts/${examAttemptId}/result`);
        } catch (error) {
            console.error(error);
            alert("Nộp bài thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="student-loading-card">Đang tải bài thi...</div>;
    }

    return (
        <div className="student-exam-layout">
            <div className="student-exam-main">
                <div className="student-page-header">
                    <div>
                        <span className="page-chip">Sinh viên / Làm bài thi</span>
                        <h2>{attempt?.title || attempt?.examTitle || "Bài thi"}</h2>
                        <p>Chọn đáp án cho từng câu hỏi và nộp bài khi hoàn thành.</p>
                    </div>

                    <button
                        className="student-primary-btn"
                        onClick={handleSubmitExam}
                        disabled={submitting}
                    >
                        {submitting ? "Đang nộp bài..." : "Nộp bài"}
                    </button>
                </div>

                <StudentExamQuestionPanel
                    question={currentQuestion}
                    index={currentIndex}
                    total={questions.length}
                    onChooseAnswer={handleChooseAnswer}
                    disabled={savingAnswer}
                />

                <div className="student-exam-navigation">
                    <button
                        className="student-nav-btn"
                        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                    >
                        ← Câu trước
                    </button>

                    <button
                        className="student-nav-btn primary"
                        onClick={() =>
                            setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                        }
                        disabled={currentIndex === questions.length - 1}
                    >
                        Câu tiếp →
                    </button>
                </div>
            </div>

            <StudentExamSidebar
                attempt={attempt}
                currentIndex={currentIndex}
                onSelectQuestion={setCurrentIndex}
            />
        </div>
    );
}