import { useState } from "react";
import "./UploadDocumentMaterialForm.css";

export default function UploadDocumentMaterialForm({ onSubmit, isSubmitting }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        file: null,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.file) return;

        await onSubmit(form);

        setForm({
            title: "",
            description: "",
            file: null,
        });

        event.target.reset();
    };

    return (
        <form className="teacher-upload-form" onSubmit={handleSubmit}>
            <div className="teacher-upload-form-header">
                <h3>Đăng tải document</h3>
                <p>Tải lên 1 file tài liệu cho học phần.</p>
            </div>

            <div className="form-group">
                <label>Tiêu đề tài liệu</label>
                <input
                    value={form.title}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Ví dụ: Slide chương 1"
                    required
                />
            </div>

            <div className="form-group">
                <label>Mô tả</label>
                <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Nhập mô tả ngắn cho tài liệu"
                />
            </div>

            <div className="form-group">
                <label>Chọn file document</label>
                <input
                    type="file"
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))
                    }
                    required
                />
            </div>

            <button className="teacher-primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tải lên..." : "Đăng tải tài liệu"}
            </button>
        </form>
    );
}