import { useEffect, useState } from "react";

const defaultForm = {
    title: "",
    content: "",
    target: "student",
    isPublished: true,
};

export default function AnnouncementFormModal({
    open,
    mode,
    initialData,
    onClose,
    onSubmit,
    isSubmitting,
}) {
    const [form, setForm] = useState(defaultForm);

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && initialData) {
            setForm({
                title: initialData.title || "",
                content: initialData.content || "",
                target: initialData.target || "student",
                isPublished:
                    typeof initialData.isPublished === "boolean"
                        ? initialData.isPublished
                        : true,
            });
        } else {
            setForm(defaultForm);
        }
    }, [open, mode, initialData]);

    if (!open) return null;

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            alert("Vui lòng nhập tiêu đề thông báo.");
            return;
        }

        if (!form.content.trim()) {
            alert("Vui lòng nhập nội dung thông báo.");
            return;
        }

        await onSubmit({
            title: form.title.trim(),
            content: form.content.trim(),
            target: form.target,
            isPublished: form.isPublished,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="assign-modal">
                <div className="assign-modal-header">
                    <div>
                        <h3>{mode === "edit" ? "Cập nhật thông báo" : "Thêm thông báo"}</h3>
                        <p>Quản lý thông báo gửi tới giảng viên hoặc sinh viên.</p>
                    </div>

                    <button type="button" className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="assign-form" onSubmit={handleSubmit}>
                    <input
                        className="assign-search"
                        type="text"
                        placeholder="Nhập tiêu đề thông báo..."
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                    />

                    <textarea
                        className="assign-search"
                        rows={5}
                        placeholder="Nhập nội dung thông báo..."
                        value={form.content}
                        onChange={(e) => handleChange("content", e.target.value)}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <select
                            className="assign-search"
                            value={form.target}
                            onChange={(e) => handleChange("target", e.target.value)}
                        >
                            <option value="student">Sinh viên</option>
                            <option value="teacher">Giảng viên</option>
                            <option value="all">Tất cả</option>
                        </select>

                        <select
                            className="assign-search"
                            value={form.isPublished ? "true" : "false"}
                            onChange={(e) => handleChange("isPublished", e.target.value === "true")}
                        >
                            <option value="true">Đang hiển thị</option>
                            <option value="false">Đã ẩn</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Đang lưu..."
                                : mode === "edit"
                                    ? "Cập nhật"
                                    : "Tạo thông báo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}