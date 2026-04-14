import { useEffect, useState } from "react";
import "./RandomExamFormModal.css";

const initialForm = {
    questionBankId: "",
    title: "",
    description: "",
    questionCount: 10,
    durationMinutes: 15,
    startAt: "",
    endAt: "",
};

export default function RandomExamFormModal({
    open,
    questionBanks,
    courseId,
    onClose,
    onSubmit,
    isSubmitting,
}) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (open) {
            setForm((prev) => ({
                ...initialForm,
                questionBankId: questionBanks?.[0]?._id || "",
            }));
        }
    }, [open, questionBanks]);

    if (!open) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSubmit({
            ...form,
            courseId,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="teacher-modal">
                <div className="teacher-modal-header">
                    <div>
                        <h3>Tạo đề thi ngẫu nhiên</h3>
                        <p>Chọn question bank và cấu hình đề thi.</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="teacher-modal-form" onSubmit={handleSubmit}>
                    <div className="teacher-form-grid">
                        <div className="form-group">
                            <label>Question bank</label>
                            <select
                                name="questionBankId"
                                value={form.questionBankId}
                                onChange={handleChange}
                                required
                            >
                                {questionBanks.map((bank) => (
                                    <option key={bank._id} value={bank._id}>
                                        {bank.title || bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Tiêu đề đề thi</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Ví dụ: Kiểm tra giữa kỳ"
                                required
                            />
                        </div>

                        <div className="form-group teacher-form-full">
                            <label>Mô tả</label>
                            <textarea
                                rows={4}
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả ngắn cho đề thi"
                            />
                        </div>

                        <div className="form-group">
                            <label>Số câu hỏi</label>
                            <input
                                type="number"
                                name="questionCount"
                                min="1"
                                value={form.questionCount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Thời lượng (phút)</label>
                            <input
                                type="number"
                                name="durationMinutes"
                                min="1"
                                value={form.durationMinutes}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Bắt đầu</label>
                            <input
                                type="datetime-local"
                                name="startAt"
                                value={form.startAt}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Kết thúc</label>
                            <input
                                type="datetime-local"
                                name="endAt"
                                value={form.endAt}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Đang tạo..." : "Tạo đề thi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}