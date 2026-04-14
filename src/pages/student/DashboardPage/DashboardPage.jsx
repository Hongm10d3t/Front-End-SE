import { Link } from "react-router-dom";

export default function StudentDashboardPage() {
    return (
        <div className="content-card">
            <h2>Trang tổng quan sinh viên</h2>
            <p>
                Từ đây bạn có thể vào các kỳ học, xem tài liệu, làm bài thi và xem lại kết quả bài làm.
            </p>

            <div style={{ marginTop: 18 }}>
                <Link
                    to="/student/terms"
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