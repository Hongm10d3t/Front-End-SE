import { formatDateTime, extractAttemptQuestions } from "../student.helpers";
import "./StudentResultSummary.css";

export default function StudentResultSummary({ attempt }) {
    const questions = extractAttemptQuestions(attempt);
    const correctCount = questions.filter((question) => {
        if (typeof question?.isCorrect === "boolean") return question.isCorrect;
        return question?.selectedAnswer === question?.correctAnswer;
    }).length;

    return (
        <div className="student-result-summary">
            <div className="student-result-top">
                <h3>Kết quả bài làm</h3>
                <span className="student-badge active">Điểm: {attempt?.score ?? 0}</span>
            </div>

            <div className="student-result-grid">
                <div>
                    <span>Trạng thái</span>
                    <strong>{attempt?.status || "--"}</strong>
                </div>
                <div>
                    <span>Số câu đúng</span>
                    <strong>{correctCount}/{questions.length}</strong>
                </div>
                <div>
                    <span>Bắt đầu làm</span>
                    <strong>{formatDateTime(attempt?.startedAt)}</strong>
                </div>
                <div>
                    <span>Nộp bài</span>
                    <strong>{formatDateTime(attempt?.submittedAt)}</strong>
                </div>
            </div>
        </div>
    );
}