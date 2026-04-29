import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getTeacherDocumentMaterialApi,
    getTeacherVideoMaterialApi,
    uploadTeacherDocumentMaterialApi,
    uploadTeacherVideoMaterialApi,
    deleteTeacherMaterialApi
} from "../../../features/teacher/teacher.api";
import TeacherMaterialPanel from "../../../features/teacher/components/TeacherMaterialPanel";
import UploadVideoMaterialForm from "../../../features/teacher/components/UploadVideoMaterialForm";
import UploadDocumentMaterialForm from "../../../features/teacher/components/UploadDocumentMaterialForm";
import "./MaterialsPage.css";

export default function TeacherMaterialsPage() {
    const { courseId } = useParams();

    const [videoMaterials, setVideoMaterials] = useState([]);
    const [documentMaterials, setDocumentMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingVideo, setSubmittingVideo] = useState(false);
    const [submittingDocument, setSubmittingDocument] = useState(false);

    const fetchMaterials = async () => {
        try {
            setLoading(true);

            const [videoRes, documentRes] = await Promise.all([
                getTeacherVideoMaterialApi(courseId),
                getTeacherDocumentMaterialApi(courseId),
            ]);

            setVideoMaterials(Array.isArray(videoRes) ? videoRes : []);
            setDocumentMaterials(Array.isArray(documentRes) ? documentRes : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được danh sách tài liệu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, [courseId]);

    const handleUploadVideo = async (formData) => {
        try {
            setSubmittingVideo(true);
            await uploadTeacherVideoMaterialApi(courseId, formData);
            await fetchMaterials();
            alert("Đăng tải video thành công.");
        } catch (error) {
            console.error(error);
            alert("Đăng tải video thất bại.");
        } finally {
            setSubmittingVideo(false);
        }
    };

    const handleUploadDocument = async (formData) => {
        try {
            setSubmittingDocument(true);
            await uploadTeacherDocumentMaterialApi(courseId, formData);
            await fetchMaterials();
            alert("Đăng tải tài liệu thành công.");
        } catch (error) {
            console.error(error);
            alert("Đăng tải tài liệu thất bại.");
        } finally {
            setSubmittingDocument(false);
        }
    };
    const handleDeleteMaterial = async (material) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa tài liệu "${material.title}" không?`
        );
        if (!confirmed) return;

        try {
            await deleteTeacherMaterialApi(courseId, material._id);
            await fetchMaterials();
            alert("Xóa tài liệu thành công.");
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Xóa tài liệu thất bại.";
            alert(message);
        }
    };

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Tài liệu</span>
                    <h2>Quản lý tài liệu học tập</h2>
                    <p>
                        Đăng tải video URL và document cho học phần hiện tại, hiển thị tách riêng theo từng loại.
                    </p>
                </div>

                <Link className="teacher-back-link" to="/teacher/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            <div className="teacher-material-grid">
                <div className="teacher-material-column">
                    <UploadVideoMaterialForm
                        onSubmit={handleUploadVideo}
                        isSubmitting={submittingVideo}
                    />

                    {loading ? (
                        <div className="teacher-loading-card">Đang tải video...</div>
                    ) : (
                        <TeacherMaterialPanel
                            title="Danh sách video"
                            type="video"
                            materials={videoMaterials}
                            onDelete={handleDeleteMaterial}
                        />
                    )}
                </div>

                <div className="teacher-material-column">
                    <UploadDocumentMaterialForm
                        onSubmit={handleUploadDocument}
                        isSubmitting={submittingDocument}
                    />

                    {loading ? (
                        <div className="teacher-loading-card">Đang tải document...</div>
                    ) : (
                        <TeacherMaterialPanel
                            title="Danh sách document"
                            type="document"
                            materials={documentMaterials}
                            onDelete={handleDeleteMaterial}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}