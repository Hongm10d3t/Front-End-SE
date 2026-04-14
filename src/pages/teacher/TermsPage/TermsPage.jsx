import { useEffect, useState } from "react";
import { getTeacherTermsApi } from "../../../features/teacher/teacher.api";
import TeacherTermGrid from "../../../features/teacher/components/TeacherTermGrid";
import "./TermsPage.css";

export default function TeacherTermsPage() {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                setLoading(true);
                const data = await getTeacherTermsApi();
                setTerms(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được danh sách kỳ học.");
            } finally {
                setLoading(false);
            }
        };

        fetchTerms();
    }, []);

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Kỳ học</span>
                    <h2>Kỳ học của tôi</h2>
                    <p>Danh sách các kỳ học mà bạn đang được phân công giảng dạy.</p>
                </div>
            </div>

            {loading ? (
                <div className="teacher-loading-card">Đang tải danh sách kỳ học...</div>
            ) : (
                <TeacherTermGrid terms={terms} />
            )}
        </div>
    );
}