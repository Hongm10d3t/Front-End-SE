import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeacherStudentExamAttemptsApi } from "../../../features/teacher/teacher.api";

export default function TeacherStudentExamAttemptsPage() {
    const { courseId, studentId, examId } = useParams();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                setLoading(true);
                const data = await getTeacherStudentExamAttemptsApi(courseId, studentId, examId);
                setAttempts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được các lần làm bài.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, [courseId, studentId, examId]);

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Kết quả theo đề</span>
                    <h2>Các lần làm bài của sinh viên</h2>
                    <p>Hiển thị kết quả các lần làm cho đề thi này.</p>
                </div>

                <Link
                    className="teacher-back-link"
                    to={`/teacher/courses/${courseId}/students/${studentId}/results`}
                >
                    ← Quay lại danh sách đề
                </Link>
            </div>

            {loading ? (
                <div className="teacher-loading-card">Đang tải các lần làm bài...</div>
            ) : attempts.length ? (
                <div className="teacher-table-wrapper">
                    <table className="teacher-table">
                        <thead>
                            <tr>
                                <th>Lần làm</th>
                                <th>Bắt đầu</th>
                                <th>Nộp bài</th>
                                <th>Điểm</th>
                                <th>Đúng</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.map((attempt) => (
                                <tr key={attempt._id}>
                                    <td>Lần {attempt.attemptNo}</td>
                                    <td>
                                        {attempt.startedAt
                                            ? new Date(attempt.startedAt).toLocaleString("vi-VN")
                                            : "--"}
                                    </td>
                                    <td>
                                        {attempt.submittedAt
                                            ? new Date(attempt.submittedAt).toLocaleString("vi-VN")
                                            : "--"}
                                    </td>
                                    <td>{attempt.score}</td>
                                    <td>{attempt.correctCount}/{attempt.totalQuestions}</td>
                                    <td>{attempt.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="teacher-empty-card">
                    <h3>Chưa có lần làm nào</h3>
                    <p>Sinh viên này chưa làm đề thi này.</p>
                </div>
            )}
        </div>
    );
}