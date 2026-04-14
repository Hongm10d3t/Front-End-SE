import { formatLevel, getLevelClass } from "../teacher.helpers";
import "./TeacherQuestionListTable.css";

export default function TeacherQuestionListTable({ questions }) {
    if (!questions.length) {
        return (
            <div className="teacher-empty-card">
                <h3>Chưa có câu hỏi</h3>
                <p>Question bank này hiện chưa có câu hỏi nào.</p>
            </div>
        );
    }

    return (
        <div className="teacher-question-list">
            {questions.map((question, index) => (
                <div className="teacher-question-card" key={question._id || index}>
                    <div className="teacher-question-card-top">
                        <span className={getLevelClass(question.level)}>
                            {formatLevel(question.level)}
                        </span>
                        <strong>Câu {index + 1}</strong>
                    </div>

                    <h4>{question.content || question.questionText || "Không có nội dung"}</h4>

                    <div className="teacher-option-list">
                        {Array.isArray(question.options) ? (
                            question.options.map((option, optionIndex) => {
                                const label = option.label || option.key || String.fromCharCode(65 + optionIndex);
                                const text = option.text || option.content || option.value || "--";

                                return (
                                    <div className="teacher-option-item" key={optionIndex}>
                                        <span>{label}.</span>
                                        <p>{text}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="teacher-option-item">
                                <p>Không có dữ liệu đáp án.</p>
                            </div>
                        )}
                    </div>

                    <div className="teacher-question-footer">
                        <span>
                            Đáp án đúng: <strong>{question.correctAnswer || "--"}</strong>
                        </span>
                        <span>
                            Giải thích: <strong>{question.explanation || "--"}</strong>
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}