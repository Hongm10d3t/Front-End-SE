import { Link } from "react-router-dom";
import { formatDateOnly } from "../student.helpers";
import "./StudentTermGrid.css";

export default function StudentTermGrid({ terms }) {
    if (!terms.length) {
        return (
            <div className="student-empty-card">
                <h3>Chưa có kỳ học nào</h3>
                <p>Bạn chưa được ghi danh vào kỳ học nào.</p>
            </div>
        );
    }

    return (
        <div className="student-term-grid">
            {terms.map((term) => (
                <div className="student-term-card" key={term._id}>
                    <div className="student-term-card-top">
                        <span className={term.isActive ? "student-badge active" : "student-badge"}>
                            {term.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                        </span>
                    </div>

                    <h3>{term.name || "Kỳ học"}</h3>

                    <div className="student-term-meta">
                        <div>
                            <span>Bắt đầu</span>
                            <strong>{formatDateOnly(term.startDate)}</strong>
                        </div>
                        <div>
                            <span>Kết thúc</span>
                            <strong>{formatDateOnly(term.endDate)}</strong>
                        </div>
                    </div>

                    <Link className="student-primary-link" to={`/student/terms/${term._id}/courses`}>
                        Xem lớp học
                    </Link>
                </div>
            ))}
        </div>
    );
}