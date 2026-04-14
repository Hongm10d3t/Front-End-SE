import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getStudentExamAttemptsByExamApi } from "../../../features/student/student.api";

export default function StudentExamHistoryPage() {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                setLoading(true);
                const data = await getStudentExamAttemptsByExamApi(examId);
                setAttempts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được lịch sử làm bài.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, [examId]);

    return (
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Lịch sử bài thi</span>
                    <h2>Lịch sử làm bài</h2>
                    <p>Xem lại tất cả các lần bạn đã làm đề thi này.</p>
                </div>

                <Link className="student-back-link" to="/student/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            {loading ? (
                <div className="student-loading-card">Đang tải lịch sử làm bài...</div>
            ) : attempts.length ? (
                <div className="student-table-wrapper">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Lần làm</th>
                                <th>Bắt đầu</th>
                                <th>Nộp bài</th>
                                <th>Điểm</th>
                                <th>Đúng</th>
                                <th>Trạng thái</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.map((attempt, index) => (
                                <tr key={attempt._id}>
                                    <td>Lần {attempts.length - index}</td>
                                    <td>{attempt.startedAt ? new Date(attempt.startedAt).toLocaleString("vi-VN") : "--"}</td>
                                    <td>{attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString("vi-VN") : "--"}</td>
                                    <td>{attempt.score ?? 0}</td>
                                    <td>{attempt.correctCount ?? 0}/{attempt.totalQuestions ?? 0}</td>
                                    <td>{attempt.status || "--"}</td>
                                    <td>
                                        <button
                                            className="student-primary-btn"
                                            onClick={() =>
                                                navigate(`/student/exam-attempts/${attempt._id}/result`)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="student-empty-card">
                    <h3>Chưa có lần làm nào</h3>
                    <p>Bạn chưa làm đề thi này lần nào.</p>
                </div>
            )}
        </div>
    );
}