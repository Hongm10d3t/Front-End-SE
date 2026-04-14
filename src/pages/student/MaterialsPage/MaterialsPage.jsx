import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getStudentDocumentMaterialApi,
    getStudentVideoMaterialApi,
} from "../../../features/student/student.api";
import StudentMaterialPanel from "../../../features/student/components/StudentMaterialPanel";
import "./MaterialsPage.css";

export default function StudentMaterialsPage() {
    const { courseId } = useParams();

    const [videoMaterials, setVideoMaterials] = useState([]);
    const [documentMaterials, setDocumentMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                setLoading(true);

                const [videoRes, documentRes] = await Promise.all([
                    getStudentVideoMaterialApi(courseId),
                    getStudentDocumentMaterialApi(courseId),
                ]);

                setVideoMaterials(Array.isArray(videoRes) ? videoRes : []);
                setDocumentMaterials(Array.isArray(documentRes) ? documentRes : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được tài liệu khóa học.");
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [courseId]);

    return (
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Tài liệu khóa học</span>
                    <h2>Tài liệu học tập</h2>
                    <p>Xem video khóa học và tài liệu học tập của lớp học hiện tại.</p>
                </div>

                <Link className="student-back-link" to={`/student/courses/${courseId}`}>
                    ← Quay lại lớp học
                </Link>
            </div>

            <div className="student-material-grid">
                {loading ? (
                    <div className="student-loading-card">Đang tải tài liệu...</div>
                ) : (
                    <>
                        <StudentMaterialPanel
                            title="Danh sách video"
                            type="video"
                            materials={videoMaterials}
                        />
                        <StudentMaterialPanel
                            title="Danh sách document"
                            type="document"
                            materials={documentMaterials}
                        />
                    </>
                )}
            </div>
        </div>
    );
}