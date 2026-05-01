export default function AnnouncementTable({ announcements, onEdit, onDelete }) {
    if (!announcements.length) {
        return (
            <div className="teacher-empty-card">
                <h3>Chưa có thông báo</h3>
                <p>Hiện chưa có thông báo nào trong hệ thống.</p>
            </div>
        );
    }

    const getTargetLabel = (target) => {
        if (target === "teacher") return "Giảng viên";
        if (target === "student") return "Sinh viên";
        if (target === "all") return "Tất cả";
        return "--";
    };

    return (
        <div className="teacher-table-wrapper">
            <table className="teacher-table">
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Đối tượng</th>
                        <th>Trạng thái</th>
                        <th>Người tạo</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {announcements.map((item) => (
                        <tr key={item._id}>
                            <td>
                                <strong>{item.title}</strong>
                                <div style={{ color: "#64748b", marginTop: 6 }}>
                                    {item.content}
                                </div>
                            </td>
                            <td>{getTargetLabel(item.target)}</td>
                            <td>{item.isPublished ? "Đang hiển thị" : "Đã ẩn"}</td>
                            <td>{item.createdBy?.fullName || item.createdBy?.code || "--"}</td>
                            <td>
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString("vi-VN")
                                    : "--"}
                            </td>
                            <td>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        type="button"
                                        className="teacher-inline-link"
                                        onClick={() => onEdit(item)}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        type="button"
                                        className="teacher-danger-btn"
                                        onClick={() => onDelete(item)}
                                    >
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