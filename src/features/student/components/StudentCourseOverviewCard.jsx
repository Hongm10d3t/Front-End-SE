import { Link } from "react-router-dom";
import "./StudentCourseOverviewCard.css";

export default function StudentCourseOverviewCard({
    course,
    teachers,
    studentCount,
}) {
    return (
        <div className="student-course-overview">
            <div className="student-course-overview-header">
                <div>
                    <h3>{course?.name || "Lớp học"}</h3>
                    <p>{course?.code || "--"}</p>
                </div>

                <span className="student-badge active">
                    {course?.status === "active" ? "Đang học" : course?.status || "--"}
                </span>
            </div>

            <p className="student-course-overview-desc">
                {course?.description || "Không có mô tả."}
            </p>

            <div className="student-course-meta-grid">
                <div>
                    <span>Giảng viên</span>
                    <strong>
                        {teachers.length
                            ? teachers.map((teacher) => teacher.fullName || teacher.code).join(", ")
                            : "--"}
                    </strong>
                </div>

                <div>
                    <span>Số sinh viên</span>
                    <strong>{studentCount}</strong>
                </div>
            </div>

            <div className="student-course-actions">
                <Link className="student-primary-link" to={`/student/courses/${course?._id}/videos`}>
                    Xem video khóa học
                </Link>

                <Link
                    className="student-primary-link secondary"
                    to={`/student/courses/${course?._id}/documents`}
                >
                    Xem tài liệu
                </Link>

                <Link
                    className="student-primary-link secondary"
                    to={`/student/courses/${course?._id}/exams`}
                >
                    Làm bài thi
                </Link>
            </div>
        </div>
    );
}