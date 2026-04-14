import { Link } from "react-router-dom";
import {
    formatCourseStatus,
    getCourseStatusClass,
} from "../teacher.helpers";
import "./TeacherCourseTable.css";

export default function TeacherCourseTable({ courses }) {
    if (!courses.length) {
        return (
            <div className="teacher-empty-card">
                <h3>Chưa có lớp học nào</h3>
                <p>Không tìm thấy lớp học phần trong kỳ học này.</p>
            </div>
        );
    }

    return (
        <div className="teacher-table-wrapper">
            <table className="teacher-table">
                <thead>
                    <tr>
                        <th>Mã học phần</th>
                        <th>Tên học phần</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Sinh viên</th>
                        <th>Tài liệu</th>
                        <th>Question bank</th>
                        <th>Bài thi</th>
                    </tr>
                </thead>

                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.code || "--"}</td>
                            <td>
                                <strong>{course.name || "--"}</strong>
                            </td>
                            <td>{course.description || "--"}</td>
                            <td>
                                <span className={getCourseStatusClass(course.status)}>
                                    {formatCourseStatus(course.status)}
                                </span>
                            </td>
                            <td>
                                <Link
                                    className="teacher-inline-link"
                                    to={`/teacher/courses/${course._id}/students`}
                                >
                                    Xem sinh viên
                                </Link>
                            </td>
                            <td>
                                <Link
                                    className="teacher-inline-link"
                                    to={`/teacher/courses/${course._id}/materials`}
                                >
                                    Quản lý tài liệu
                                </Link>
                            </td>
                            <td>
                                <Link
                                    className="teacher-inline-link"
                                    to={`/teacher/courses/${course._id}/question-banks`}
                                >
                                    Quản lý bank
                                </Link>
                            </td>
                            <td>
                                <Link
                                    className="teacher-inline-link"
                                    to={`/teacher/courses/${course._id}/exams`}
                                >
                                    Quản lý bài thi
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}