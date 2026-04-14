import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    createTeacherRandomExamApi,
    deleteTeacherExamApi,
    getTeacherExamsApi,
    getTeacherQuestionBanksApi,
} from "../../../features/teacher/teacher.api";
import TeacherExamTable from "../../../features/teacher/components/TeacherExamTable";
import RandomExamFormModal from "../../../features/teacher/components/RandomExamFormModal";
import "./ExamsPage.css";

export default function TeacherExamsPage() {
    const { courseId } = useParams();

    const [exams, setExams] = useState([]);
    const [questionBanks, setQuestionBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [examsData, banksData] = await Promise.all([
                getTeacherExamsApi(courseId),
                getTeacherQuestionBanksApi(courseId),
            ]);

            setExams(Array.isArray(examsData) ? examsData : []);
            setQuestionBanks(Array.isArray(banksData) ? banksData : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được danh sách bài thi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const handleCreateExam = async (formData) => {
        try {
            setSubmitting(true);
            await createTeacherRandomExamApi(formData);
            setOpenCreateModal(false);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Tạo đề thi thất bại. Bạn nhập thiếu thông tin hoặc số lượng câu hỏi vượt quá ngân hàng đề");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteExam = async (exam) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa đề thi ${exam.title || exam.name}?`
        );
        if (!confirmed) return;

        try {
            await deleteTeacherExamApi(exam._id);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Xóa đề thi thất bại.");
        }
    };

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Bài thi</span>
                    <h2>Danh sách bài thi</h2>
                    <p>Tạo và quản lý bài thi cho học phần hiện tại.</p>
                </div>

                <div className="teacher-header-actions">
                    <Link className="teacher-back-link" to="/teacher/terms">
                        ← Quay lại kỳ học
                    </Link>
                    <button
                        className="teacher-primary-btn"
                        onClick={() => setOpenCreateModal(true)}
                        disabled={!questionBanks.length}
                    >
                        + Tạo đề ngẫu nhiên
                    </button>
                </div>
            </div>

            {!questionBanks.length && !loading ? (
                <div className="teacher-warning-card">
                    Bạn cần tạo ít nhất một question bank trước khi tạo đề thi.
                </div>
            ) : null}

            {loading ? (
                <div className="teacher-loading-card">Đang tải danh sách bài thi...</div>
            ) : (
                <TeacherExamTable exams={exams} onDelete={handleDeleteExam} />
            )}

            <RandomExamFormModal
                open={openCreateModal}
                questionBanks={questionBanks}
                courseId={courseId}
                onClose={() => setOpenCreateModal(false)}
                onSubmit={handleCreateExam}
                isSubmitting={submitting}
            />
        </div>
    );
}