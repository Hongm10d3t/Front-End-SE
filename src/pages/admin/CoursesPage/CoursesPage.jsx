import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    createCourseApi,
    deleteCourseApi,
    getCoursesByTermApi,
    updateCourseApi,
} from "../../../features/courses/courses.api";
import CourseFormModal from "../../../features/courses/components/CourseFormModal";
import CourseTable from "../../../features/courses/components/CourseTable";
import "./CoursesPage.css";

export default function CoursesPage() {
    const { termId } = useParams();

    const [courses, setCourses] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedCourse, setSelectedCourse] = useState(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getCoursesByTermApi(termId);
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được danh sách học phần.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [termId]);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const search = keyword.toLowerCase();
            return (
                (course.code || "").toLowerCase().includes(search) ||
                (course.name || "").toLowerCase().includes(search)
            );
        });
    }, [courses, keyword]);

    const handleOpenCreate = () => {
        setModalMode("create");
        setSelectedCourse(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (course) => {
        setModalMode("edit");
        setSelectedCourse(course);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCourse(null);
    };

    const handleSubmitCourse = async (formData) => {
        try {
            setSubmitting(true);

            let result;

            if (modalMode === "create") {
                result = await createCourseApi(termId, formData);
            } else {
                result = await updateCourseApi(termId, selectedCourse._id, formData);
            }

            // Nếu backend trả 200 nhưng báo lỗi trong body
            if (result?.EC && result.EC !== 0) {
                alert(result?.EM || "Lưu học phần thất bại.");
                return;
            }

            handleCloseModal();
            await fetchCourses();
        } catch (error) {
            console.error(error);

            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                error?.message ||
                "Lưu học phần thất bại.";

            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCourse = async (course) => {
        const confirmed = window.confirm(`Bạn có chắc muốn xóa học phần ${course.name}?`);
        if (!confirmed) return;

        try {
            await deleteCourseApi(termId, course._id);
            await fetchCourses();
        } catch (error) {
            console.error(error);
            alert("Xóa học phần thất bại.");
        }
    };

    return (
        <div className="courses-page">
            <div className="courses-page-header">
                <div>
                    <span className="page-chip">Admin / Học phần</span>
                    <h2>Danh sách học phần theo kỳ học</h2>
                    <p>Quản lý các lớp học phần thuộc kỳ học đang chọn.</p>
                </div>

                <div className="courses-header-actions">
                    <Link className="back-link-btn" to="/admin/terms">
                        ← Quay lại kỳ học
                    </Link>
                    <button className="create-course-btn" onClick={handleOpenCreate}>
                        + Thêm học phần
                    </button>
                </div>
            </div>

            <div className="courses-toolbar">
                <input
                    type="text"
                    placeholder="Tìm theo mã hoặc tên học phần..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="courses-loading-card">Đang tải danh sách học phần...</div>
            ) : (
                <CourseTable
                    courses={filteredCourses}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteCourse}
                />
            )}

            <CourseFormModal
                open={modalOpen}
                mode={modalMode}
                initialData={selectedCourse}
                onClose={handleCloseModal}
                onSubmit={handleSubmitCourse}
                isSubmitting={submitting}
            />
        </div>
    );
}