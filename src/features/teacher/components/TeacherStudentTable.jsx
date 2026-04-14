import "./TeacherStudentTable.css";

export default function TeacherStudentTable({ students }) {
    if (!students.length) {
        return (
            <div className="teacher-empty-card">
                <h3>Chưa có sinh viên</h3>
                <p>Học phần này hiện chưa có sinh viên nào.</p>
            </div>
        );
    }

    return (
        <div className="teacher-table-wrapper">
            <table className="teacher-table">
                <thead>
                    <tr>
                        <th>Mã sinh viên</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Khoa/Bộ môn</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>

                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td>{student.code || "--"}</td>
                            <td>
                                <div className="teacher-student-cell">
                                    <div className="teacher-student-avatar">
                                        {(student.fullName || student.code || "S").charAt(0).toUpperCase()}
                                    </div>
                                    <strong>{student.fullName || "--"}</strong>
                                </div>
                            </td>
                            <td>{student.email || "--"}</td>
                            <td>{student.department || "--"}</td>
                            <td>
                                <span className={student.status === "ACTIVE" ? "teacher-badge active" : "teacher-badge"}>
                                    {student.status === "ACTIVE" ? "Đang hoạt động" : student.status || "--"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}