import { Link } from "react-router-dom";

export default function TeacherDashboardPage() {
    return (
        <div className="content-card">
            <h2>Trang tổng quan giảng viên</h2>
            <p>
                Từ đây bạn có thể xem các kỳ học đang giảng dạy, quản lý sinh viên,
                question bank và bài thi.
            </p>

            <div style={{ marginTop: 18 }}>
                <Link
                    to="/teacher/terms"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 44,
                        padding: "0 16px",
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                        color: "#fff",
                        fontWeight: 700,
                    }}
                >
                    Đi tới kỳ học của tôi
                </Link>
            </div>
        </div>
    );
}