import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTeacherAnnouncementsApi } from "../../../features/announcements/announcements.api";
import AnnouncementList from "../../../features/announcements/components/AnnouncementList";

export default function TeacherDashboardPage() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getTeacherAnnouncementsApi();
                setAnnouncements(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAnnouncements();
    }, []);
    return (
        <div className="content-card">
            <h2>Trang tổng quan giảng viên</h2>
            <p>
                Từ đây bạn có thể xem các kỳ học đang giảng dạy, quản lý sinh viên,
                question bank và bài thi.
            </p>

            <div style={{ marginTop: 18 }}>
                <Link
                    to="/teacher/terms"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 44,
                        padding: "0 16px",
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                        color: "#fff",
                        fontWeight: 700,
                    }}
                >
                    Đi tới kỳ học của tôi
                </Link>
                {/* <AnnouncementList
                    title="Thông báo mới"
                    announcements={announcements}
                    emptyText="Hiện chưa có thông báo nào dành cho giảng viên."
                /> */}

            </div>
        </div>
    );
}