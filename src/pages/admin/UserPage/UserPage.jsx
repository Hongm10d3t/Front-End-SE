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

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsersApi();
            console.log("users api data =", data);

            // nếu backend trả object { items, pagination }
            if (data?.items) {
                setUsers(Array.isArray(data.items) ? data.items : []);
                return;
            }

            // nếu backend trả thẳng mảng
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
            const search = keyword.trim().toLowerCase();

            const matchesKeyword =
                !search ||
                (user.code || "").toLowerCase().includes(search) ||
                (user.fullName || "").toLowerCase().includes(search) ||
                (user.email || "").toLowerCase().includes(search);

            const matchesRole =
                roleFilter === "ALL" || user.role === roleFilter;

            return matchesKeyword && matchesRole;
        });
    }, [users, keyword, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / limit));

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, page, limit]);

    useEffect(() => {
        setPage(1);
    }, [keyword, roleFilter, limit]);

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
                const result = await createUserApi(formData);

                if (result?.EC && result.EC !== 0) {
                    alert(result?.EM || "Lưu người dùng thất bại.");
                    return;
                }
            } else {
                const result = await updateUserApi(selectedUser._id, formData);

                if (result?.EC && result.EC !== 0) {
                    alert(result?.EM || "Lưu người dùng thất bại.");
                    return;
                }
            }

            handleCloseModal();
            await fetchUsers();
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Lưu người dùng thất bại.";
            alert(message);
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
            const result = await deleteUserApi(user._id);

            if (result?.EC && result.EC !== 0) {
                alert(result?.EM || "Xóa người dùng thất bại.");
                return;
            }

            await fetchUsers();
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Xóa người dùng thất bại.";
            alert(message);
        }
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages));
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
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="TEACHER">Giảng viên</option>
                        <option value="STUDENT">Sinh viên</option>
                    </select>
                </div>

                <select
                    className="limit-select"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                >
                    <option value={5}>5 / trang</option>
                    <option value={10}>10 / trang</option>
                    <option value={20}>20 / trang</option>
                </select>
            </div>

            {loading ? (
                <div className="users-loading-card">Đang tải danh sách người dùng...</div>
            ) : (
                <>
                    <UserTable
                        users={paginatedUsers}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteUser}
                    />

                    <div className="users-pagination">
                        <button onClick={handlePrevPage} disabled={page === 1}>
                            ← Trước
                        </button>

                        <span>
                            Trang {page} / {totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                        >
                            Sau →
                        </button>
                    </div>
                </>
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