import { Link } from "react-router-dom";
import { getQuestionCount } from "../teacher.helpers";
import "./TeacherQuestionBankTable.css";

export default function TeacherQuestionBankTable({
    courseId,
    banks,
    onDelete,
    onImportCsv,
}) {
    if (!banks.length) {
        return (
            <div className="teacher-empty-card">
                <h3>Chưa có question bank</h3>
                <p>Hãy tạo ngân hàng câu hỏi đầu tiên cho học phần này.</p>
            </div>
        );
    }

    return (
        <div className="teacher-table-wrapper">
            <table className="teacher-table">
                <thead>
                    <tr>
                        <th>Tên ngân hàng</th>
                        <th>Mô tả</th>
                        <th>Số câu hỏi</th>
                        <th>Câu hỏi</th>
                        <th>CSV</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {banks.map((bank) => (
                        <tr key={bank._id}>
                            <td>
                                <strong>{bank.title || bank.name || "--"}</strong>
                            </td>
                            <td>{bank.description || "--"}</td>
                            <td>{getQuestionCount(bank)}</td>
                            <td>
                                <Link
                                    className="teacher-inline-link"
                                    to={`/teacher/question-banks/${bank._id}/questions`}
                                >
                                    Xem danh sách câu hỏi
                                </Link>
                            </td>
                            <td>
                                <button
                                    className="teacher-light-btn"
                                    onClick={() => onImportCsv(bank)}
                                >
                                    Import CSV
                                </button>
                            </td>
                            <td>
                                <button
                                    className="teacher-danger-btn"
                                    onClick={() => onDelete(bank)}
                                >
                                    Xóa bank
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}