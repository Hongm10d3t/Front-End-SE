import { useEffect, useMemo, useState } from "react";
import "./AssignMemberModal.css";

export default function AssignMemberModal({
    open,
    title,
    users,
    type,
    onClose,
    onSubmit,
    isSubmitting,
}) {
    const [keyword, setKeyword] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        if (open) {
            setKeyword("");
            setSelectedIds([]);
        }
    }, [open]);

    const filteredUsers = useMemo(() => {
        const search = keyword.toLowerCase();

        return users.filter((user) => {
            const okRole =
                type === "teacher"
                    ? user.role === "TEACHER"
                    : user.role === "STUDENT";

            return (
                okRole &&
                (
                    (user.fullName || "").toLowerCase().includes(search) ||
                    (user.code || "").toLowerCase().includes(search) ||
                    (user.email || "").toLowerCase().includes(search)
                )
            );
        });
    }, [users, keyword, type]);

    if (!open) return null;

    const handleToggleUser = (userId) => {
        setSelectedIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAllFiltered = () => {
        const filteredIds = filteredUsers.map((user) => user._id);
        setSelectedIds(filteredIds);
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedIds.length) return;

        await onSubmit(selectedIds);
        setSelectedIds([]);
        setKeyword("");
    };

    return (
        <div className="modal-overlay">
            <div className="assign-modal">
                <div className="assign-modal-header">
                    <div>
                        <h3>{title}</h3>
                        <p>Chọn người dùng để thêm vào học phần.</p>
                    </div>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form className="assign-form" onSubmit={handleSubmit}>
                    <input
                        className="assign-search"
                        type="text"
                        placeholder="Tìm theo mã, họ tên hoặc email..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <span style={{ fontSize: 14, color: "#64748b" }}>
                            Đã chọn: {selectedIds.length}
                        </span>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleSelectAllFiltered}
                                disabled={!filteredUsers.length}
                            >
                                Chọn tất cả
                            </button>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleClearSelection}
                                disabled={!selectedIds.length}
                            >
                                Bỏ chọn
                            </button>
                        </div>
                    </div>

                    <div className="assign-list">
                        {filteredUsers.map((user) => (
                            <label key={user._id} className="assign-item">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(user._id)}
                                    onChange={() => handleToggleUser(user._id)}
                                />

                                <div>
                                    <strong>{user.fullName || user.code}</strong>
                                    <p>{user.code} · {user.email || "--"}</p>
                                </div>
                            </label>
                        ))}

                        {!filteredUsers.length ? (
                            <div className="assign-empty">
                                Không tìm thấy người dùng phù hợp.
                            </div>
                        ) : null}
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting || !selectedIds.length}
                        >
                            {isSubmitting ? "Đang thêm..." : "Xác nhận thêm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}