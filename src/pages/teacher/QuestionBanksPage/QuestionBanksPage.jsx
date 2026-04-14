import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    createTeacherQuestionBankApi,
    deleteTeacherQuestionBankApi,
    getTeacherQuestionBanksApi,
    importTeacherQuestionBankCsvApi,
} from "../../../features/teacher/teacher.api";
import TeacherQuestionBankTable from "../../../features/teacher/components/TeacherQuestionBankTable";
import QuestionBankFormModal from "../../../features/teacher/components/QuestionBankFormModal";
import ImportCsvModal from "../../../features/teacher/components/ImportCsvModal";
import "./QuestionBanksPage.css";

export default function TeacherQuestionBanksPage() {
    const { courseId } = useParams();

    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);

    const fetchBanks = async () => {
        try {
            setLoading(true);
            const data = await getTeacherQuestionBanksApi(courseId);
            setBanks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được question bank.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, [courseId]);

    const handleCreateBank = async (formData) => {
        try {
            setSubmitting(true);
            await createTeacherQuestionBankApi(courseId, formData);
            setOpenCreateModal(false);
            await fetchBanks();
        } catch (error) {
            console.error(error);
            alert("Tạo question bank thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBank = async (bank) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa question bank ${bank.title || bank.name}?`
        );
        if (!confirmed) return;

        try {
            await deleteTeacherQuestionBankApi(courseId, bank._id);
            await fetchBanks();
        } catch (error) {
            console.error(error);
            alert("Xóa question bank thất bại.");
        }
    };

    const handleOpenImport = (bank) => {
        setSelectedBank(bank);
        setOpenImportModal(true);
    };

    const handleImportCsv = async (file) => {
        try {
            setSubmitting(true);
            await importTeacherQuestionBankCsvApi(selectedBank._id, file);
            setOpenImportModal(false);
            setSelectedBank(null);
            await fetchBanks();
            alert("Import CSV thành công.");
        } catch (error) {
            console.error(error);
            alert("Import CSV thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Question bank</span>
                    <h2>Ngân hàng câu hỏi</h2>
                    <p>Quản lý question bank cho học phần hiện tại.</p>
                </div>

                <div className="teacher-header-actions">
                    <Link className="teacher-back-link" to="/teacher/terms">
                        ← Quay lại kỳ học
                    </Link>
                    <button className="teacher-primary-btn" onClick={() => setOpenCreateModal(true)}>
                        + Tạo question bank
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="teacher-loading-card">Đang tải question bank...</div>
            ) : (
                <TeacherQuestionBankTable
                    courseId={courseId}
                    banks={banks}
                    onDelete={handleDeleteBank}
                    onImportCsv={handleOpenImport}
                />
            )}

            <QuestionBankFormModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSubmit={handleCreateBank}
                isSubmitting={submitting}
            />

            <ImportCsvModal
                open={openImportModal}
                bankName={selectedBank?.title || selectedBank?.name}
                onClose={() => {
                    setOpenImportModal(false);
                    setSelectedBank(null);
                }}
                onSubmit={handleImportCsv}
                isSubmitting={submitting}
            />
        </div>
    );
}