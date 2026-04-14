import { useMemo, useState } from "react";
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
    const [selectedId, setSelectedId] = useState("");

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const okRole = type === "teacher" ? user.role === "TEACHER" : user.role === "STUDENT";
            const search = keyword.toLowerCase();

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedId) return;
        await onSubmit(selectedId);
        setSelectedId("");
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
                    <button className="modal-close-btn" onClick={onClose}>
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

                    <div className="assign-list">
                        {filteredUsers.map((user) => (
                            <label key={user._id} className="assign-item">
                                <input
                                    type="radio"
                                    name="selectedUser"
                                    value={user._id}
                                    checked={selectedId === user._id}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                />
                                <div>
                                    <strong>{user.fullName || user.code}</strong>
                                    <p>{user.code} · {user.email || "--"}</p>
                                </div>
                            </label>
                        ))}

                        {!filteredUsers.length ? (
                            <div className="assign-empty">Không tìm thấy người dùng phù hợp.</div>
                        ) : null}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting || !selectedId}>
                            {isSubmitting ? "Đang thêm..." : "Xác nhận thêm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}