import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeacherCoursesApi } from "../../../features/teacher/teacher.api";
import TeacherCourseTable from "../../../features/teacher/components/TeacherCourseTable";
import "./CoursesPage.css";

export default function TeacherCoursesPage() {
    const { termId } = useParams();

    const [courses, setCourses] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const data = await getTeacherCoursesApi(termId);
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
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Lớp học phần</span>
                    <h2>Lớp học theo kỳ</h2>
                    <p>Quản lý lớp học bạn đang giảng dạy trong kỳ học đã chọn.</p>
                </div>

                <Link className="teacher-back-link" to="/teacher/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            <div className="teacher-toolbar">
                <input
                    type="text"
                    placeholder="Tìm theo mã hoặc tên học phần..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="teacher-loading-card">Đang tải danh sách lớp học...</div>
            ) : (
                <TeacherCourseTable courses={filteredCourses} />
            )}
        </div>
    );
}