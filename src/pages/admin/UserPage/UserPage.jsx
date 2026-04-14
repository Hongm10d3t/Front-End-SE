import { useEffect, useMemo, useState } from "react";
import {
    createUserApi,
    deleteUserApi,
    getUsersApi,
    updateUserApi,
} from "../../../features/users/users.api";
import UserFormModal from "../../../features/users/components/UserFormModal";
import UserTable from "../../../features/users/components/UserTable";
import "./UserPage.css";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsersApi();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesKeyword =
                !keyword ||
                user.code?.toLowerCase().includes(keyword.toLowerCase()) ||
                user.fullName?.toLowerCase().includes(keyword.toLowerCase()) ||
                user.email?.toLowerCase().includes(keyword.toLowerCase());

            const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

            return matchesKeyword && matchesRole;
        });
    }, [users, keyword, roleFilter]);

    const handleOpenCreate = () => {
        setModalMode("create");
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setModalMode("edit");
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleSubmitUser = async (formData) => {
        try {
            setSubmitting(true);

            if (modalMode === "create") {
                await createUserApi(formData);
            } else {
                await updateUserApi(selectedUser._id, formData);
            }

            handleCloseModal();
            await fetchUsers();
        } catch (error) {
            console.error(error);
            alert("Lưu người dùng thất bại. Hãy kiểm tra lại API backend.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (user) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa người dùng ${user.fullName || user.code}?`
        );

        if (!confirmed) return;

        try {
            await deleteUserApi(user._id);
            await fetchUsers();
        } catch (error) {
            console.error(error);
            alert("Xóa người dùng thất bại.");
        }
    };

    return (
        <div className="users-page">
            <div className="users-page-header">
                <div>
                    <span className="page-chip">Admin / Người dùng</span>
                    <h2>Quản lý người dùng</h2>
                    <p>Quản trị tài khoản quản trị viên, giảng viên và sinh viên trong hệ thống.</p>
                </div>

                <button className="create-user-btn" onClick={handleOpenCreate}>
                    + Thêm người dùng
                </button>
            </div>

            <div className="users-toolbar">
                <div className="toolbar-search">
                    <input
                        type="text"
                        placeholder="Tìm theo mã, họ tên hoặc email..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div className="toolbar-filter">
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="TEACHER">Giảng viên</option>
                        <option value="STUDENT">Sinh viên</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="users-loading-card">Đang tải danh sách người dùng...</div>
            ) : (
                <UserTable
                    users={filteredUsers}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteUser}
                />
            )}

            <UserFormModal
                open={modalOpen}
                mode={modalMode}
                initialData={selectedUser}
                onClose={handleCloseModal}
                onSubmit={handleSubmitUser}
                isSubmitting={submitting}
            />
        </div>
    );
}