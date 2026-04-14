import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStudentCoursesApi } from "../../../features/student/student.api";
import StudentCourseTable from "../../../features/student/components/StudentCourseTable";
import "./CoursesPage.css";

export default function StudentCoursesPage() {
    const { termId } = useParams();

    const [courses, setCourses] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const data = await getStudentCoursesApi(termId);
                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được danh sách lớp học.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [termId]);

    const filteredCourses = useMemo(() => {
        const search = keyword.toLowerCase();

        return courses.filter((course) => {
            return (
                (course.code || "").toLowerCase().includes(search) ||
                (course.name || "").toLowerCase().includes(search)
            );
        });
    }, [courses, keyword]);

    return (
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Lớp học phần</span>
                    <h2>Lớp học theo kỳ</h2>
                    <p>Danh sách các lớp học phần bạn đang tham gia trong kỳ này.</p>
                </div>

                <Link className="student-back-link" to="/student/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            <div className="student-toolbar">
                <input
                    type="text"
                    placeholder="Tìm theo mã hoặc tên học phần..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="student-loading-card">Đang tải danh sách lớp học...</div>
            ) : (
                <StudentCourseTable courses={filteredCourses} />
            )}
        </div>
    );
}