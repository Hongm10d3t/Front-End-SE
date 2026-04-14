import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeacherExamDetailApi } from "../../../features/teacher/teacher.api";
import TeacherExamDetailView from "../../../features/teacher/components/TeacherExamDetailView";
import "./ExamDetailPage.css";

export default function TeacherExamDetailPage() {
    const { examId } = useParams();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExamDetail = async () => {
            try {
                setLoading(true);
                const data = await getTeacherExamDetailApi(examId);
                setExam(data || null);
            } catch (error) {
                console.error(error);
                alert("Không tải được chi tiết đề thi.");
            } finally {
                setLoading(false);
            }
        };

        fetchExamDetail();
    }, [examId]);

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Chi tiết đề thi</span>
                    <h2>Xem chi tiết đề thi</h2>
                    <p>Xem toàn bộ câu hỏi, phương án và đáp án đúng của đề thi.</p>
                </div>

                <Link className="teacher-back-link" to="/teacher/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            {loading ? (
                <div className="teacher-loading-card">Đang tải chi tiết đề thi...</div>
            ) : exam ? (
                <TeacherExamDetailView exam={exam} />
            ) : (
                <div className="teacher-empty-card">
                    <h3>Không có dữ liệu đề thi</h3>
                    <p>Không tìm thấy thông tin chi tiết của đề thi này.</p>
                </div>
            )}
        </div>
    );
}