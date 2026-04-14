import { Link } from "react-router-dom";
import "./TermTable.css";

export default function TermTable({ terms, onEdit, onDelete }) {
    if (!terms.length) {
        return (
            <div className="term-table-empty">
                <h3>Chưa có kỳ học nào</h3>
                <p>Hãy tạo kỳ học đầu tiên để bắt đầu quản lý lớp học phần.</p>
            </div>
        );
    }

    return (
        <div className="term-table-wrapper">
            <table className="term-table">
                <thead>
                    <tr>
                        <th>Tên kỳ học</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Course</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {terms.map((term) => (
                        <tr key={term._id}>
                            <td>
                                <strong>{term.name || "--"}</strong>
                            </td>
                            <td>{term.startDate ? new Date(term.startDate).toLocaleDateString("vi-VN") : "--"}</td>
                            <td>{term.endDate ? new Date(term.endDate).toLocaleDateString("vi-VN") : "--"}</td>
                            <td>
                                <span className={term.isActive ? "term-badge active" : "term-badge inactive"}>
                                    {term.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                                </span>
                            </td>
                            <td>
                                <Link className="term-link-btn" to={`/admin/terms/${term._id}/courses`}>
                                    Xem course
                                </Link>
                            </td>
                            <td>
                                <div className="term-actions">
                                    <button className="term-btn edit" onClick={() => onEdit(term)}>
                                        Sửa
                                    </button>
                                    <button className="term-btn delete" onClick={() => onDelete(term)}>
                                        Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}