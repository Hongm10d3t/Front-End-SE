import { Link } from "react-router-dom";
import "./CourseTable.css";

export default function CourseTable({ courses, onEdit, onDelete }) {
    if (!courses.length) {
        return (
            <div className="course-table-empty">
                <h3>Chưa có course nào</h3>
                <p>Hãy thêm lớp học phần vào kỳ học này.</p>
            </div>
        );
    }

    return (
        <div className="course-table-wrapper">
            <table className="course-table">
                <thead>
                    <tr>
                        <th>Mã học phần</th>
                        <th>Tên học phần</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Thành viên</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.code || "--"}</td>
                            <td><strong>{course.name || "--"}</strong></td>
                            <td>{course.description || "--"}</td>
                            <td>
                                <span className={course.status === "active" ? "course-badge active" : "course-badge closed"}>
                                    {course.status === "active" ? "Đang mở" : "Đã đóng"}
                                </span>
                            </td>
                            <td>
                                <Link className="course-link-btn" to={`/admin/courses/${course._id}/members`}>
                                    Quản lý thành viên
                                </Link>
                            </td>
                            <td>
                                <div className="course-actions">
                                    <button className="course-btn edit" onClick={() => onEdit(course)}>
                                        Sửa
                                    </button>
                                    <button className="course-btn delete" onClick={() => onDelete(course)}>
                                        Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}