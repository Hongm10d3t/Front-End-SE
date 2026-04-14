import { useEffect, useMemo, useState } from "react";
import {
    createTermApi,
    deleteTermApi,
    getTermsApi,
    updateTermApi,
} from "../../../features/terms/term.api"
import TermFormModal from "../../../features/terms/components/TermFormModal";
import TermTable from "../../../features/terms/components/TermTable";

import "./TermsPage.css";

export default function TermsPage() {
    const [terms, setTerms] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedTerm, setSelectedTerm] = useState(null);

    const fetchTerms = async () => {
        try {
            setLoading(true);
            const data = await getTermsApi();
            setTerms(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được danh sách kỳ học.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const filteredTerms = useMemo(() => {
        return terms.filter((term) =>
            (term.name || "").toLowerCase().includes(keyword.toLowerCase())
        );
    }, [terms, keyword]);

    const handleOpenCreate = () => {
        setModalMode("create");
        setSelectedTerm(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (term) => {
        setModalMode("edit");
        setSelectedTerm(term);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTerm(null);
    };

    const handleSubmitTerm = async (formData) => {
        try {
            setSubmitting(true);

            if (modalMode === "create") {
                await createTermApi(formData);
            } else {
                await updateTermApi(selectedTerm._id, formData);
            }

            handleCloseModal();
            await fetchTerms();
        } catch (error) {
            console.error(error);
            alert("Lưu kỳ học thất bại. Hãy kiểm tra lại backend.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTerm = async (term) => {
        const confirmed = window.confirm(`Bạn có chắc muốn xóa kỳ học ${term.name}?`);
        if (!confirmed) return;

        try {
            await deleteTermApi(term._id);
            await fetchTerms();
        } catch (error) {
            console.error(error);
            alert("Xóa kỳ học thất bại.");
        }
    };

    return (
        <div className="terms-page">
            <div className="terms-page-header">
                <div>
                    <span className="page-chip">Admin / Kỳ học</span>
                    <h2>Quản lý kỳ học</h2>
                    <p>Tạo và quản lý kỳ học để tổ chức lớp học phần trong hệ thống.</p>
                </div>

                <button className="create-term-btn" onClick={handleOpenCreate}>
                    + Thêm kỳ học
                </button>
            </div>

            <div className="terms-toolbar">
                <input
                    type="text"
                    placeholder="Tìm theo tên kỳ học..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="terms-loading-card">Đang tải danh sách kỳ học...</div>
            ) : (
                <TermTable
                    terms={filteredTerms}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteTerm}
                />
            )}

            <TermFormModal
                open={modalOpen}
                mode={modalMode}
                initialData={selectedTerm}
                onClose={handleCloseModal}
                onSubmit={handleSubmitTerm}
                isSubmitting={submitting}
            />
        </div>
    );
}