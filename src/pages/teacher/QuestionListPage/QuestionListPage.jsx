import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeacherQuestionListApi } from "../../../features/teacher/teacher.api";
import TeacherQuestionListTable from "../../../features/teacher/components/TeacherQuestionListTable";
import "./QuestionListPage.css";

export default function TeacherQuestionListPage() {
    const { questionBankId } = useParams();

    const [questions, setQuestions] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const data = await getTeacherQuestionListApi(questionBankId);
                setQuestions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được danh sách câu hỏi.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [questionBankId]);

    const filteredQuestions = useMemo(() => {
        const search = keyword.toLowerCase();

        return questions.filter((question) =>
            (question.content || question.questionText || "")
                .toLowerCase()
                .includes(search)
        );
    }, [questions, keyword]);

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Danh sách câu hỏi</span>
                    <h2>Câu hỏi trong question bank</h2>
                    <p>Xem nội dung câu hỏi, đáp án và mức độ khó.</p>
                </div>

                <Link className="teacher-back-link" to="/teacher/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            <div className="teacher-toolbar">
                <input
                    type="text"
                    placeholder="Tìm theo nội dung câu hỏi..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="teacher-loading-card">Đang tải danh sách câu hỏi...</div>
            ) : (
                <TeacherQuestionListTable questions={filteredQuestions} />
            )}
        </div>
    );
}