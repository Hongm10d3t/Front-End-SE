import { useState } from "react";
import "./UploadVideoMaterialForm.css";

export default function UploadVideoMaterialForm({ onSubmit, isSubmitting }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        url: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSubmit(form);
        setForm({
            title: "",
            description: "",
            url: "",
        });
    };

    return (
        <form className="teacher-upload-form" onSubmit={handleSubmit}>
            <div className="teacher-upload-form-header">
                <h3>Đăng tải video URL</h3>
                <p>Dùng cho YouTube, Drive, hoặc link video công khai.</p>
            </div>

            <div className="form-group">
                <label>Tiêu đề video</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Ví dụ: Bài giảng chương 1"
                    required
                />
            </div>

            <div className="form-group">
                <label>Mô tả</label>
                <textarea
                    rows={4}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả ngắn cho video"
                />
            </div>

            <div className="form-group">
                <label>URL video</label>
                <input
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://..."
                    required
                />
            </div>

            <button className="teacher-primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tải lên..." : "Đăng tải video"}
            </button>
        </form>
    );
}