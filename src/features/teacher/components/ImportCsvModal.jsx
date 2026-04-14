import { useState } from "react";
import "./ImportCsvModal.css";

export default function ImportCsvModal({
    open,
    bankName,
    onClose,
    onSubmit,
    isSubmitting,
}) {
    const [file, setFile] = useState(null);

    if (!open) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;
        await onSubmit(file);
        setFile(null);
    };

    return (
        <div className="modal-overlay">
            <div className="teacher-modal">
                <div className="teacher-modal-header">
                    <div>
                        <h3>Import CSV</h3>
                        <p>Ngân hàng câu hỏi: {bankName || "--"}</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="teacher-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Chọn file CSV</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting || !file}>
                            {isSubmitting ? "Đang import..." : "Import"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}