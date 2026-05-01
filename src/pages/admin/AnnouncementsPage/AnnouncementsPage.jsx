import { useEffect, useMemo, useState } from "react";
import {
    createAnnouncementApi,
    deleteAnnouncementApi,
    getAnnouncementsApi,
    updateAnnouncementApi,
} from "../../../features/announcements/announcements.api";
import AnnouncementFormModal from "../../../features/announcements/components/AnnouncementFormModal";
import AnnouncementTable from "../../../features/announcements/components/AnnouncementTable";
import "./AnnouncementsPage.css";

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [targetFilter, setTargetFilter] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const fetchAnnouncements = async (target = targetFilter) => {
        try {
            setLoading(true);

            const params = target && target !== "all" ? { target } : {};
            const data = await getAnnouncementsApi(params);

            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được danh sách thông báo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleChangeFilter = async (value) => {
        setTargetFilter(value);
        await fetchAnnouncements(value);
    };

    const handleOpenCreate = () => {
        setModalMode("create");
        setSelectedAnnouncement(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (announcement) => {
        setModalMode("edit");
        setSelectedAnnouncement(announcement);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedAnnouncement(null);
    };

    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);

            if (modalMode === "create") {
                const result = await createAnnouncementApi(formData);
                if (result?.EC && result.EC !== 0) {
                    alert(result?.EM || "Tạo thông báo thất bại.");
                    return;
                }
            } else {
                const result = await updateAnnouncementApi(selectedAnnouncement._id, formData);
                if (result?.EC && result.EC !== 0) {
                    alert(result?.EM || "Cập nhật thông báo thất bại.");
                    return;
                }
            }

            handleCloseModal();
            await fetchAnnouncements(targetFilter);
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Lưu thông báo thất bại.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (announcement) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa thông báo "${announcement.title}" không?`
        );
        if (!confirmed) return;

        try {
            const result = await deleteAnnouncementApi(announcement._id);

            if (result?.EC && result.EC !== 0) {
                alert(result?.EM || "Xóa thông báo thất bại.");
                return;
            }

            await fetchAnnouncements(targetFilter);
        } catch (error) {
            console.error(error);
            const message =
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Xóa thông báo thất bại.";
            alert(message);
        }
    };

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Admin / Thông báo</span>
                    <h2>Quản lý thông báo</h2>
                    <p>Tạo, chỉnh sửa và xóa thông báo gửi tới sinh viên hoặc giảng viên.</p>
                </div>

                <button className="create-user-btn" onClick={handleOpenCreate}>
                    + Thêm thông báo
                </button>
            </div>

            <div className="users-toolbar">
                <div className="toolbar-filter">
                    <select
                        value={targetFilter}
                        onChange={(e) => handleChangeFilter(e.target.value)}
                    >
                        <option value="all">Tất cả nhóm</option>
                        <option value="student">Sinh viên</option>
                        <option value="teacher">Giảng viên</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="users-loading-card">Đang tải danh sách thông báo...</div>
            ) : (
                <AnnouncementTable
                    announcements={announcements}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                />
            )}

            <AnnouncementFormModal
                open={modalOpen}
                mode={modalMode}
                initialData={selectedAnnouncement}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
            />
        </div>
    );
}