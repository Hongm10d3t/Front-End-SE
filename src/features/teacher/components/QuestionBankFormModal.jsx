import { useEffect, useState } from "react";
import "./QuestionBankFormModal.css";

const initialForm = {
    title: "",
    description: "",
    file: null,
};

export default function QuestionBankFormModal({
    open,
    onClose,
    onSubmit,
    isSubmitting,
}) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (open) {
            setForm(initialForm);
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSubmit(form);
    };

    return (
        <div className="modal-overlay">
            <div className="teacher-modal">
                <div className="teacher-modal-header">
                    <div>
                        <h3>Tạo question bank</h3>
                        <p>
                            Nhập thông tin ngân hàng câu hỏi. Có thể chọn thêm file CSV để import ngay khi tạo.
                        </p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="teacher-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên ngân hàng câu hỏi</label>
                        <input
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Ví dụ: Ngân hàng câu hỏi giữa kỳ"
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
                            placeholder="Nhập mô tả ngắn"
                        />
                    </div>

                    <div className="form-group">
                        <label>File CSV khởi tạo (tùy chọn)</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    file: e.target.files?.[0] || null,
                                }))
                            }
                        />
                        <small className="question-bank-hint">
                            Không chọn file thì hệ thống sẽ tạo ngân hàng câu hỏi rỗng như trước.
                        </small>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Đang tạo..." : "Tạo question bank"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}