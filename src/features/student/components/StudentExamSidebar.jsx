import { extractAttemptQuestions, isQuestionCorrect, getAttemptQuestionId } from "../student.helpers";
import "./StudentExamSidebar.css";

export default function StudentExamSidebar({
    attempt,
    currentIndex,
    onSelectQuestion,
    isSubmitted = false,

}) {
    const questions = extractAttemptQuestions(attempt);

    return (
        <aside className="student-exam-sidebar">
            <div className="student-exam-sidebar-header">
                <h3>Danh sách câu hỏi</h3>
                <p>Tổng số: {questions.length}</p>
            </div>

            <div className="student-exam-number-grid">
                {questions.map((question, index) => {
                    const hasAnswer = !!question?.selectedAnswer;

                    let className = "student-question-number";
                    if (index === currentIndex) className += " active";
                    if (hasAnswer) className += " answered";
                    if (isSubmitted) {
                        className += isQuestionCorrect(question) ? " correct" : " wrong";
                    }

                    return (
                        <button
                            key={getAttemptQuestionId(question) || index}
                            className={className}
                            onClick={() => onSelectQuestion(index)}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}