import { useEffect, useState } from "react";
import "./CourseFormModal.css";

const initialForm = {
    code: "",
    name: "",
    description: "",
    status: "active",
};

export default function CourseFormModal({
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
                name: initialData.name || "",
                description: initialData.description || "",
                status: initialData.status || "active",
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
            <div className="course-modal">
                <div className="course-modal-header">
                    <div>
                        <h3>{mode === "create" ? "Thêm học phần" : "Cập nhật học phần"}</h3>
                        <p>Quản lý thông tin lớp học phần trong kỳ học hiện tại.</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="course-modal-form" onSubmit={handleSubmit}>
                    <div className="course-grid">
                        <div className="form-group">
                            <label>Mã học phần</label>
                            <input
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="Ví dụ: INT2204"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Tên học phần</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ví dụ: Lập trình Web"
                                required
                            />
                        </div>

                        <div className="form-group course-grid-full">
                            <label>Mô tả</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả ngắn cho học phần"
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option value="active">Đang mở</option>
                                <option value="closed">Đã đóng</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Đang lưu..." : mode === "create" ? "Tạo học phần" : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}