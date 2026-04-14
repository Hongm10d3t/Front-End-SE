import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import Topbar from "../../components/common/Topbar/Topbar";
import { adminNavItems } from "../../constants/navigation";
import "./AdminLayout.css";

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                title="LMS Admin"
                subtitle="Khu vực quản trị"
                items={adminNavItems}
            />

            <div className="dashboard-main">
                <Topbar title="Bảng điều khiển quản trị" user={user} onLogout={handleLogout} />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}