import {
    formatRole,
    formatStatus,
    getRoleClass,
    getStatusClass,
} from "../users.helpers";
import "./UserTable.css";

export default function UserTable({ users, onEdit, onDelete }) {
    if (!users.length) {
        return (
            <div className="user-table-empty">
                <h3>Chưa có người dùng nào</h3>
                <p>Hãy thêm người dùng mới để bắt đầu quản lý hệ thống.</p>
            </div>
        );
    }

    return (
        <div className="user-table-wrapper">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Khoa/Bộ môn</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.code || "--"}</td>
                            <td>
                                <div className="user-name-cell">
                                    <div className="user-avatar">
                                        {(user.fullName || user.code || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{user.fullName || "--"}</strong>
                                    </div>
                                </div>
                            </td>
                            <td>{user.email || "--"}</td>
                            <td>
                                <span className={getRoleClass(user.role)}>
                                    {formatRole(user.role)}
                                </span>
                            </td>
                            <td>
                                <span className={getStatusClass(user.status)}>
                                    {formatStatus(user.status)}
                                </span>
                            </td>
                            <td>{user.department || "--"}</td>
                            <td>
                                <div className="table-actions">
                                    <button className="btn-action btn-edit" onClick={() => onEdit(user)}>
                                        Sửa
                                    </button>
                                    <button
                                        className="btn-action btn-delete"
                                        onClick={() => onDelete(user)}
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