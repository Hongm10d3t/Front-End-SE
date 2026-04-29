import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeacherStudentExamResultsApi } from "../../../features/teacher/teacher.api";

export default function TeacherStudentResultsPage() {
    const { courseId, studentId } = useParams();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await getTeacherStudentExamResultsApi(courseId, studentId);
                setResults(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được kết quả học tập của sinh viên.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [courseId, studentId]);

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Kết quả học tập</span>
                    <h2>Kết quả học tập của sinh viên</h2>
                    <p>Danh sách các đề sinh viên này đã làm trong học phần.</p>
                </div>

                <Link className="teacher-back-link" to={`/teacher/courses/${courseId}/students`}>
                    ← Quay lại danh sách sinh viên
                </Link>
            </div>

            {loading ? (
                <div className="teacher-loading-card">Đang tải kết quả học tập...</div>
            ) : results.length ? (
                <div className="teacher-table-wrapper">
                    <table className="teacher-table">
                        <thead>
                            <tr>
                                <th>Đề thi</th>
                                <th>Số lần làm</th>
                                <th>Điểm cao nhất</th>
                                <th>Điểm gần nhất</th>
                                <th>Trạng thái gần nhất</th>
                                <th>Lần nộp gần nhất</th>
                                <th>Kết quả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item) => (
                                <tr key={item.examId}>
                                    <td><strong>{item.title}</strong></td>
                                    <td>{item.attemptCount}</td>
                                    <td>{item.bestScore}</td>
                                    <td>{item.latestScore}</td>
                                    <td>{item.latestStatus}</td>
                                    <td>
                                        {item.latestSubmittedAt
                                            ? new Date(item.latestSubmittedAt).toLocaleString("vi-VN")
                                            : "--"}
                                    </td>
                                    <td>
                                        <Link
                                            className="teacher-inline-link"
                                            to={`/teacher/courses/${courseId}/students/${studentId}/results/${item.examId}`}
                                        >
                                            Xem các lần làm
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="teacher-empty-card">
                    <h3>Chưa có dữ liệu</h3>
                    <p>Sinh viên này chưa làm đề nào trong học phần này.</p>
                </div>
            )}
        </div>
    );
}