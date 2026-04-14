import { useEffect, useState } from "react";
import { getStudentTermsApi } from "../../../features/student/student.api";
import StudentTermGrid from "../../../features/student/components/StudentTermGrid";
import "./TermsPage.css";

export default function StudentTermsPage() {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                setLoading(true);
                const data = await getStudentTermsApi();
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
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Kỳ học</span>
                    <h2>Kỳ học của tôi</h2>
                    <p>Chọn kỳ học để xem các lớp học mà bạn đang tham gia.</p>
                </div>
            </div>

            {loading ? (
                <div className="student-loading-card">Đang tải danh sách kỳ học...</div>
            ) : (
                <StudentTermGrid terms={terms} />
            )}
        </div>
    );
}