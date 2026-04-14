import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStudentDocumentMaterialApi } from "../../../features/student/student.api";
import StudentMaterialPanel from "../../../features/student/components/StudentMaterialPanel";
import "./DocumentsPage.css";

export default function StudentDocumentsPage() {
    const { courseId } = useParams();

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                const data = await getStudentDocumentMaterialApi(courseId);
                setDocuments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được tài liệu khóa học.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [courseId]);

    return (
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Tài liệu khóa học</span>
                    <h2>Tài liệu khóa học</h2>
                    <p>Xem và mở các document được giảng viên cung cấp.</p>
                </div>

                <Link className="student-back-link" to={`/student/courses/${courseId}`}>
                    ← Quay lại lớp học
                </Link>
            </div>

            {loading ? (
                <div className="student-loading-card">Đang tải tài liệu...</div>
            ) : (
                <StudentMaterialPanel
                    title="Danh sách document"
                    type="document"
                    materials={documents}
                />
            )}
        </div>
    );
}