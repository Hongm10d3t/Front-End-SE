import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import Topbar from "../../components/common/Topbar/Topbar";
import { teacherNavItems } from "../../constants/navigation";
import "./TeacherLayout.css";

export default function TeacherLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                title="LMS Teacher"
                subtitle="Khu vực giảng viên"
                items={teacherNavItems}
            />

            <div className="dashboard-main">
                <Topbar title="Bảng điều khiển giảng viên" user={user} onLogout={handleLogout} />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}