import { formatDateTime } from "../student.helpers";
import { Link } from "react-router-dom";
import "./StudentExamTable.css";

export default function StudentExamTable({ exams, onStartExam }) {
    if (!exams.length) {
        return (
            <div className="student-empty-card">
                <h3>Chưa có bài thi</h3>
                <p>Hiện chưa có bài thi nào cho học phần này.</p>
            </div>
        );
    }

    return (
        <div className="student-table-wrapper">
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Thời lượng</th>
                        <th>Làm bài</th>
                        <th>Lịch sử</th>
                    </tr>
                </thead>

                <tbody>
                    {exams.map((exam) => (
                        <tr key={exam._id}>
                            <td><strong>{exam.title || exam.name || "--"}</strong></td>
                            <td>{exam.description || "--"}</td>
                            <td>{formatDateTime(exam.startAt)}</td>
                            <td>{formatDateTime(exam.endAt)}</td>
                            <td>{exam.durationMinutes || exam.duration || "--"} phút</td>
                            <td>
                                <button
                                    className="student-primary-btn"
                                    onClick={() => onStartExam(exam)}
                                >
                                    Bắt đầu làm bài
                                </button>
                            </td>
                            <td>
                                <Link className="student-inline-link" to={`/student/exams/${exam._id}/history`}>
                                    Xem lịch sử
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}