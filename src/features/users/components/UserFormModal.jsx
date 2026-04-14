import { useEffect, useState } from "react";
import "./UserFormModal.css";

const initialForm = {
    code: "",
    fullName: "",
    email: "",
    password: "",
    role: "STUDENT",
    status: "ACTIVE",
    avatarUrl: "",
    department: "",
};

export default function UserFormModal({
    open,
    mode,
    initialData,
    onClose,
    onSubmit,
    isSubmitting,
}) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                code: initialData.code || "",
                fullName: initialData.fullName || "",
                email: initialData.email || "",
                password: "",
                role: initialData.role || "STUDENT",
                status: initialData.status || "ACTIVE",
                avatarUrl: initialData.avatarUrl || "",
                department: initialData.department || "",
            });
        } else {
            setForm(initialForm);
        }
    }, [initialData, open]);

    if (!open) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSubmit(form);
    };

    return (
        <div className="modal-overlay">
            <div className="user-modal">
                <div className="user-modal-header">
                    <div>
                        <h3>{mode === "create" ? "Thêm người dùng" : "Cập nhật người dùng"}</h3>
                        <p>Điền đầy đủ thông tin cần thiết cho tài khoản.</p>
                    </div>

                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="user-modal-form" onSubmit={handleSubmit}>
                    <div className="modal-grid">
                        <div className="form-group">
                            <label>Mã người dùng</label>
                            <input
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="Ví dụ: GV001"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Mật khẩu {mode === "edit" ? "(để trống nếu không đổi)" : ""}
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required={mode === "create"}
                            />
                        </div>

                        <div className="form-group">
                            <label>Vai trò</label>
                            <select name="role" value={form.role} onChange={handleChange}>
                                <option value="ADMIN">Quản trị viên</option>
                                <option value="TEACHER">Giảng viên</option>
                                <option value="STUDENT">Sinh viên</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option value="ACTIVE">Đang hoạt động</option>
                                <option value="INACTIVE">Ngưng hoạt động</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Khoa / Bộ môn</label>
                            <input
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                placeholder="Ví dụ: CNTT"
                            />
                        </div>

                        <div className="form-group">
                            <label>Avatar URL</label>
                            <input
                                name="avatarUrl"
                                value={form.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Đang lưu..."
                                : mode === "create"
                                    ? "Tạo người dùng"
                                    : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}