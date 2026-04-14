import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getStudentCourseDetailApi,
    getStudentCourseStudentsApi,
    getStudentCourseTeachersApi,
} from "../../../features/student/student.api";
import StudentCourseOverviewCard from "../../../features/student/components/StudentCourseOverviewCard";
import "./CourseDetailPage.css";

export default function StudentCourseDetailPage() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);

                const [courseRes, teachersRes, studentsRes] = await Promise.all([
                    getStudentCourseDetailApi(courseId),
                    getStudentCourseTeachersApi(courseId),
                    getStudentCourseStudentsApi(courseId),
                ]);

                setCourse(courseRes || null);
                setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
                setStudentCount(Array.isArray(studentsRes?.students) ? studentsRes.students.length : 0);
            } catch (error) {
                console.error(error);
                alert("Không tải được chi tiết lớp học.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [courseId]);

    return (
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Chi tiết lớp học</span>
                    <h2>Thông tin lớp học</h2>
                    <p>Từ đây bạn có thể xem tài liệu và làm bài thi của lớp học này.</p>
                </div>

                <Link className="student-back-link" to="/student/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            {loading ? (
                <div className="student-loading-card">Đang tải chi tiết lớp học...</div>
            ) : (
                <StudentCourseOverviewCard
                    course={course}
                    teachers={teachers}
                    studentCount={studentCount}
                />
            )}
        </div>
    );
}