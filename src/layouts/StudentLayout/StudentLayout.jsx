import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import Topbar from "../../components/common/Topbar/Topbar";
import { studentNavItems } from "../../constants/navigation";
import "./StudentLayout.css";

export default function StudentLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                title="LMS Student"
                subtitle="Khu vực sinh viên"
                items={studentNavItems}
            />

            <div className="dashboard-main">
                <Topbar title="Bảng điều khiển sinh viên" user={user} onLogout={handleLogout} />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}