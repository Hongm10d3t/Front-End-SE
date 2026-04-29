import { useEffect, useState } from "react";
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
    const [searchKeyword, setSearchKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const fetchUsers = async ({
        currentPage = page,
        currentLimit = limit,
        currentKeyword = searchKeyword,
        currentRole = roleFilter,
    } = {}) => {
        try {
            setLoading(true);

            const result = await getUsersApi({
                page: currentPage,
                limit: currentLimit,
                keyword: currentKeyword,
                role: currentRole === "ALL" ? "" : currentRole,
            });

            // Backend mới: { items, pagination }
            if (result?.items && result?.pagination) {
                setUsers(Array.isArray(result.items) ? result.items : []);
                setPagination({
                    page: result.pagination.page || currentPage,
                    limit: result.pagination.limit || currentLimit,
                    total: result.pagination.total || 0,
                    totalPages: result.pagination.totalPages || 1,
                });
                return;
            }

            // Fallback nếu backend vẫn trả mảng
            const fallbackItems = Array.isArray(result) ? result : [];
            setUsers(fallbackItems);
            setPagination({
                page: currentPage,
                limit: currentLimit,
                total: fallbackItems.length,
                totalPages: 1,
            });
        } catch (error) {
            console.error(error);
            alert("Không tải được danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    const handleSearch = async () => {
        setPage(1);
        setSearchKeyword(keyword);

        await fetchUsers({
            currentPage: 1,
            currentLimit: limit,
            currentKeyword: keyword,
            currentRole: roleFilter,
        });
    };

    const handleFilterRole = async (nextRole) => {
        setRoleFilter(nextRole);
        setPage(1);

        await fetchUsers({
            currentPage: 1,
            currentLimit: limit,
            currentKeyword: searchKeyword,
            currentRole: nextRole,
        });
    };

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
                "Lưu người dùng thất bại. Hãy kiểm tra lại API backend.";
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
        setPage((prev) => Math.min(prev + 1, pagination.totalPages || 1));
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
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                </div>

                <div className="toolbar-filter">
                    <select
                        value={roleFilter}
                        onChange={(e) => handleFilterRole(e.target.value)}
                    >
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="TEACHER">Giảng viên</option>
                        <option value="STUDENT">Sinh viên</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="search-user-btn"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>

                <select
                    className="limit-select"
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
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
                        users={users}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteUser}
                    />

                    <div className="users-pagination">
                        <button onClick={handlePrevPage} disabled={page === 1}>
                            ← Trước
                        </button>

                        <span>
                            Trang {pagination.page} / {pagination.totalPages || 1}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={page >= (pagination.totalPages || 1)}
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