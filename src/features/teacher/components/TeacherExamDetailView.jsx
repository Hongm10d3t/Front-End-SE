import { extractExamQuestions, formatDate, getLevelClass, formatLevel } from "../teacher.helpers";
import "./TeacherExamDetailView.css";

function renderOption(option, index) {
    const label =
        option?.label ||
        option?.key ||
        option?.optionKey ||
        String.fromCharCode(65 + index);

    const text =
        option?.text ||
        option?.content ||
        option?.value ||
        option?.optionText ||
        "--";

    return { label, text };
}

export default function TeacherExamDetailView({ exam }) {
    const questions = extractExamQuestions(exam);

    return (
        <div className="teacher-exam-detail">
            <div className="teacher-exam-summary-card">
                <div className="teacher-exam-summary-top">
                    <h3>{exam?.title || exam?.name || "Chi tiết đề thi"}</h3>
                    <span className="teacher-badge active">Số câu: {questions.length}</span>
                </div>

                <div className="teacher-exam-summary-grid">
                    <div>
                        <span>Mô tả</span>
                        <strong>{exam?.description || "--"}</strong>
                    </div>
                    <div>
                        <span>Thời lượng</span>
                        <strong>{exam?.durationMinutes || exam?.duration || "--"} phút</strong>
                    </div>
                    <div>
                        <span>Bắt đầu</span>
                        <strong>{formatDate(exam?.startAt)}</strong>
                    </div>
                    <div>
                        <span>Kết thúc</span>
                        <strong>{formatDate(exam?.endAt)}</strong>
                    </div>
                </div>
            </div>

            <div className="teacher-question-list">
                {questions.length ? (
                    questions.map((question, index) => {
                        const content =
                            question?.content ||
                            question?.questionText ||
                            question?.title ||
                            "--";

                        const options = Array.isArray(question?.options)
                            ? question.options
                            : Array.isArray(question?.answers)
                                ? question.answers
                                : [];

                        return (
                            <div className="teacher-question-card" key={question?._id || index}>
                                <div className="teacher-question-card-top">
                                    <div className="teacher-question-top-left">
                                        <strong>Câu {index + 1}</strong>
                                        <span className={getLevelClass(question?.level)}>
                                            {formatLevel(question?.level)}
                                        </span>
                                    </div>
                                    <div className="teacher-correct-answer">
                                        Đáp án đúng: <strong>{question?.correctAnswer || "--"}</strong>
                                    </div>
                                </div>

                                <h4>{content}</h4>

                                <div className="teacher-option-list">
                                    {options.length ? (
                                        options.map((option, optionIndex) => {
                                            const parsed = renderOption(option, optionIndex);
                                            const isCorrect = parsed.label === question?.correctAnswer;

                                            return (
                                                <div
                                                    className={
                                                        isCorrect
                                                            ? "teacher-option-item correct"
                                                            : "teacher-option-item"
                                                    }
                                                    key={optionIndex}
                                                >
                                                    <span>{parsed.label}.</span>
                                                    <p>{parsed.text}</p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="teacher-option-item">
                                            <p>Không có dữ liệu phương án.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="teacher-question-footer">
                                    <span>
                                        Giải thích: <strong>{question?.explanation || "--"}</strong>
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="teacher-empty-card">
                        <h3>Không có câu hỏi</h3>
                        <p>Đề thi này hiện chưa có dữ liệu câu hỏi để hiển thị.</p>
                    </div>
                )}
            </div>
        </div>
    );
}