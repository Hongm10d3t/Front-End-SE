import { Link } from "react-router-dom";
import { formatCourseStatus, getCourseStatusClass } from "../student.helpers";
import "./StudentCourseTable.css";

export default function StudentCourseTable({ courses }) {
    if (!courses.length) {
        return (
            <div className="student-empty-card">
                <h3>Chưa có lớp học nào</h3>
                <p>Không tìm thấy lớp học phần trong kỳ học này.</p>
            </div>
        );
    }

    return (
        <div className="student-table-wrapper">
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Mã học phần</th>
                        <th>Tên học phần</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>

                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.code || "--"}</td>
                            <td><strong>{course.name || "--"}</strong></td>
                            <td>{course.description || "--"}</td>
                            <td>
                                <span className={getCourseStatusClass(course.status)}>
                                    {formatCourseStatus(course.status)}
                                </span>
                            </td>
                            <td>
                                <Link className="student-inline-link" to={`/student/courses/${course._id}`}>
                                    Vào lớp học
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}