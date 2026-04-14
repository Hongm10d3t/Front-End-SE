import { Link } from "react-router-dom";
import { formatDateOnly } from "../teacher.helpers";
import "./TeacherTermGrid.css";

export default function TeacherTermGrid({ terms }) {
    if (!terms.length) {
        return (
            <div className="teacher-empty-card">
                <h3>Chưa có kỳ học nào</h3>
                <p>Bạn chưa được phân công vào kỳ học nào.</p>
            </div>
        );
    }

    return (
        <div className="teacher-term-grid">
            {terms.map((term) => (
                <div className="teacher-term-card" key={term._id}>
                    <div className="teacher-term-card-top">
                        <span className={term.isActive ? "teacher-badge active" : "teacher-badge"}>
                            {term.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                        </span>
                    </div>

                    <h3>{term.name || "Kỳ học"}</h3>

                    <div className="teacher-term-meta">
                        <div>
                            <span>Bắt đầu</span>
                            <strong>{formatDateOnly(term.startDate)}</strong>
                        </div>

                        <div>
                            <span>Kết thúc</span>
                            <strong>{formatDateOnly(term.endDate)}</strong>
                        </div>
                    </div>

                    <Link className="teacher-primary-link" to={`/teacher/terms/${term._id}/courses`}>
                        Xem lớp học trong kỳ
                    </Link>
                </div>
            ))}
        </div>
    );
}