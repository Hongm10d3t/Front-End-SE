import { useEffect, useState } from "react";
import "./TermFormModal.css";

const initialForm = {
    name: "",
    startDate: "",
    endDate: "",
    isActive: true,
};

export default function TermFormModal({
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
                name: initialData.name || "",
                startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : "",
                endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
                isActive: initialData.isActive ?? true,
            });
        } else {
            setForm(initialForm);
        }
    }, [initialData, open]);

    if (!open) return null;

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSubmit(form);
    };

    return (
        <div className="modal-overlay">
            <div className="term-modal">
                <div className="term-modal-header">
                    <div>
                        <h3>{mode === "create" ? "Thêm kỳ học" : "Cập nhật kỳ học"}</h3>
                        <p>Quản lý thông tin kỳ học để tổ chức các lớp học phần.</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="term-modal-form" onSubmit={handleSubmit}>
                    <div className="term-grid">
                        <div className="form-group">
                            <label>Tên kỳ học</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ví dụ: Học kỳ 1 năm 2026"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Ngày kết thúc</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <label className="term-checkbox">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                            />
                            <span>Kỳ học đang hoạt động</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Đang lưu..." : mode === "create" ? "Tạo kỳ học" : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}