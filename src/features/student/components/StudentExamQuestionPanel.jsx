import { getQuestionContent, getQuestionOptions, parseOption, getAttemptQuestionId } from "../student.helpers";
import "./StudentExamQuestionPanel.css";

export default function StudentExamQuestionPanel({
    question,
    index,
    total,
    onChooseAnswer,
    disabled = false,
}) {
    if (!question) {
        return (
            <div className="student-empty-card">
                <h3>Không có dữ liệu câu hỏi</h3>
            </div>
        );
    }

    const options = getQuestionOptions(question);
    const selectedAnswer = question?.selectedAnswer || "";

    return (
        <div className="student-question-panel">
            <div className="student-question-panel-top">
                <span className="student-badge active">
                    Câu {index + 1}/{total}
                </span>
            </div>

            <h3>{getQuestionContent(question)}</h3>

            <div className="student-answer-list">
                {options.map((option, optionIndex) => {
                    const parsed = parseOption(option, optionIndex);

                    return (
                        <label
                            className={
                                selectedAnswer === parsed.label
                                    ? "student-answer-item selected"
                                    : "student-answer-item"
                            }
                            key={optionIndex}
                        >
                            <input
                                type="radio"
                                name={`question-${getAttemptQuestionId(question) || index}`}
                                value={parsed.label}
                                checked={selectedAnswer === parsed.label}
                                onChange={() => onChooseAnswer(parsed.label)}
                                disabled={disabled}
                            />
                            <div>
                                <strong>{parsed.label}</strong>
                                <p>{parsed.text}</p>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}