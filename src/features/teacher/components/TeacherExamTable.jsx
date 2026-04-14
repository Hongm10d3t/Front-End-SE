import { Link } from "react-router-dom";
import { getExamQuestionCount, formatDate } from "../teacher.helpers";
import "./TeacherExamTable.css";

export default function TeacherExamTable({ exams, onDelete }) {
    if (!exams.length) {
        return (
            <div className="teacher-empty-card">
                <h3>Chưa có bài thi nào</h3>
                <p>Hãy tạo đề thi đầu tiên cho học phần này.</p>
            </div>
        );
    }

    return (
        <div className="teacher-table-wrapper">
            <table className="teacher-table">
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Số câu hỏi</th>
                        <th>Thời lượng</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Chi tiết</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {exams.map((exam) => (
                        <tr key={exam._id}>
                            <td>
                                <strong>{exam.title || exam.name || "--"}</strong>
                            </td>
                            <td>{exam.description || "--"}</td>
                            <td>{getExamQuestionCount(exam)}</td>
                            <td>{exam.durationMinutes || exam.duration || "--"} phút</td>
                            <td>{formatDate(exam.startAt)}</td>
                            <td>{formatDate(exam.endAt)}</td>
                            <td>
                                <Link
                                    className="teacher-inline-link"
                                    to={`/teacher/exams/${exam._id}/detail`}
                                >
                                    Xem chi tiết
                                </Link>
                            </td>
                            <td>
                                <button
                                    className="teacher-danger-btn"
                                    onClick={() => onDelete(exam)}
                                >
                                    Xóa đề
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}