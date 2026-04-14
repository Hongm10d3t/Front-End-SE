import {
    extractAttemptQuestions,
    getQuestionContent,
    getQuestionOptions,
    isQuestionCorrect,
    parseOption,
} from "../student.helpers";
import "./StudentReviewQuestionList.css";

export default function StudentReviewQuestionList({ attempt }) {
    const questions = extractAttemptQuestions(attempt);

    if (!questions.length) {
        return (
            <div className="student-empty-card">
                <h3>Không có dữ liệu câu hỏi</h3>
            </div>
        );
    }

    return (
        <div className="student-review-list">
            {questions.map((question, index) => {
                const options = getQuestionOptions(question);
                const correct = isQuestionCorrect(question);

                return (
                    <div className="student-review-card" key={question._id || index}>
                        <div className="student-review-card-top">
                            <div className="student-review-left">
                                <strong>Câu {index + 1}</strong>
                                <span className={correct ? "student-badge correct" : "student-badge wrong"}>
                                    {correct ? "Đúng" : "Sai"}
                                </span>
                            </div>

                            <div className="student-review-right">
                                Bạn chọn: <strong>{question?.selectedAnswer || "--"}</strong> · Đáp án đúng:{" "}
                                <strong>{question?.correctAnswer || "--"}</strong>
                            </div>
                        </div>

                        <h4>{getQuestionContent(question)}</h4>

                        <div className="student-review-options">
                            {options.map((option, optionIndex) => {
                                const parsed = parseOption(option, optionIndex);
                                const isSelected = parsed.label === question?.selectedAnswer;
                                const isCorrectOption = parsed.label === question?.correctAnswer;

                                let className = "student-review-option";
                                if (isSelected) className += " selected";
                                if (isCorrectOption) className += " correct";

                                return (
                                    <div className={className} key={optionIndex}>
                                        <span>{parsed.label}.</span>
                                        <p>{parsed.text}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="student-review-explanation">
                            Giải thích: <strong>{question?.explanation || "--"}</strong>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}