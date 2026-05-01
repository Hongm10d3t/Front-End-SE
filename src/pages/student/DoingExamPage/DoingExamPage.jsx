import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getStudentExamAttemptDetailApi,
    submitStudentExamApi,
    updateStudentAnswerApi,
} from "../../../features/student/student.api";
import {
    extractAttemptQuestions,
    getAttemptQuestionId,
} from "../../../features/student/student.helpers";
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

    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
    const [timerReady, setTimerReady] = useState(false);

    const hasSubmittedRef = useRef(false);

    const questions = useMemo(() => extractAttemptQuestions(attempt), [attempt]);
    const currentQuestion = questions[currentIndex];

    const durationMinutes = useMemo(() => {
        if (!attempt) return 0;

        const raw =
            attempt.examId?.durationMinutes ??
            attempt.durationMinutes ??
            attempt.duration ??
            0;

        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : 0;
    }, [attempt]);

    const getDeadlineStorageKey = () => `student_exam_deadline_${examAttemptId}`;

    const formatRemainingTime = (totalSeconds) => {
        const safe = Math.max(0, totalSeconds);
        const hours = Math.floor(safe / 3600);
        const minutes = Math.floor((safe % 3600) / 60);
        const seconds = safe % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                2,
                "0"
            )}:${String(seconds).padStart(2, "0")}`;
        }

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    };

    const fetchAttempt = async () => {
        try {
            setLoading(true);
            const data = await getStudentExamAttemptDetailApi(examAttemptId);
            console.log("attempt detail update =", data);
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

    useEffect(() => {
        setTimerReady(false);
        hasSubmittedRef.current = false;
    }, [examAttemptId]);

    // Khởi tạo deadline local theo đúng duration của đề thi
    useEffect(() => {
        if (!attempt) return;
        if (!durationMinutes) return;

        const deadlineKey = getDeadlineStorageKey();
        const savedDeadline = Number(sessionStorage.getItem(deadlineKey));

        let deadline;

        if (Number.isFinite(savedDeadline) && savedDeadline > Date.now()) {
            deadline = savedDeadline;
        } else {
            deadline = Date.now() + durationMinutes * 60 * 1000;
            sessionStorage.setItem(deadlineKey, String(deadline));
        }

        const nextRemaining = Math.max(
            0,
            Math.floor((deadline - Date.now()) / 1000)
        );

        setRemainingSeconds(nextRemaining);
        setTimerReady(true);
    }, [attempt, durationMinutes, examAttemptId]);

    // Đồng hồ đếm ngược
    useEffect(() => {
        if (!attempt) return;
        if (!durationMinutes) return;
        if (!timerReady) return;
        if (hasSubmittedRef.current) return;

        const deadlineKey = getDeadlineStorageKey();

        const tick = () => {
            const deadline = Number(sessionStorage.getItem(deadlineKey));
            if (!Number.isFinite(deadline)) return;

            const nextRemaining = Math.max(
                0,
                Math.floor((deadline - Date.now()) / 1000)
            );
            setRemainingSeconds(nextRemaining);
        };

        tick();
        const timer = setInterval(tick, 1000);

        return () => clearInterval(timer);
    }, [attempt, durationMinutes, timerReady, examAttemptId]);

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

    const handleSubmitExam = async ({ auto = false } = {}) => {
        if (hasSubmittedRef.current) return;

        const confirmed = auto
            ? true
            : window.confirm("Bạn có chắc muốn nộp bài không?");

        if (!confirmed) return;

        try {
            hasSubmittedRef.current = true;
            setSubmitting(true);

            if (auto) {
                setIsAutoSubmitting(true);
            }

            await submitStudentExamApi(examAttemptId);

            sessionStorage.removeItem(`attempt_duration_${examAttemptId}`);
            sessionStorage.removeItem(getDeadlineStorageKey());

            if (auto) {
                alert("Đã hết thời gian làm bài. Hệ thống đã tự động nộp bài.");
            } else {
                alert("Nộp bài thành công.");
            }

            navigate(`/student/exam-attempts/${examAttemptId}/result`);
        } catch (error) {
            console.error(error);

            hasSubmittedRef.current = false;
            setSubmitting(false);
            setIsAutoSubmitting(false);

            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Nộp bài thất bại.";

            alert(message);
        }
    };

    // Hết giờ thì tự nộp
    useEffect(() => {
        if (!attempt) return;
        if (!durationMinutes) return;
        if (!timerReady) return;
        if (remainingSeconds !== 0) return;
        if (hasSubmittedRef.current) return;

        handleSubmitExam({ auto: true });
    }, [remainingSeconds, attempt, durationMinutes, timerReady]);

    if (loading) {
        return <div className="student-loading-card">Đang tải bài thi...</div>;
    }

    return (
        <div className="student-exam-layout">
            <div className="student-exam-main">
                <div className="student-page-header">
                    <div>
                        <span className="page-chip">Sinh viên / Làm bài thi</span>
                        <h2>{attempt?.title || attempt?.examTitle || attempt?.examId?.title || "Bài thi"}</h2>
                        <p>Chọn đáp án cho từng câu hỏi và nộp bài khi hoàn thành.</p>
                    </div>

                    <div className="student-exam-header-actions">
                        <div
                            className={`student-exam-timer ${remainingSeconds <= 60 ? "danger" : ""
                                }`}
                        >
                            {durationMinutes ? (
                                <>
                                    Thời gian còn lại:{" "}
                                    <strong>{formatRemainingTime(remainingSeconds)}</strong>
                                </>
                            ) : (
                                <>
                                    Thời gian: <strong>Không giới hạn</strong>
                                </>
                            )}
                        </div>

                        <button
                            className="student-primary-btn"
                            onClick={() => handleSubmitExam()}
                            disabled={submitting || isAutoSubmitting}
                        >
                            {isAutoSubmitting
                                ? "Đang tự nộp..."
                                : submitting
                                    ? "Đang nộp bài..."
                                    : "Nộp bài"}
                        </button>
                    </div>
                </div>

                <StudentExamQuestionPanel
                    question={currentQuestion}
                    index={currentIndex}
                    total={questions.length}
                    onChooseAnswer={handleChooseAnswer}
                    disabled={savingAnswer || submitting || isAutoSubmitting}
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
                            setCurrentIndex((prev) =>
                                Math.min(questions.length - 1, prev + 1)
                            )
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