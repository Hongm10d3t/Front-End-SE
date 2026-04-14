import "./Topbar.css";

export default function Topbar({ title, user, onLogout }) {
    return (
        <header className="topbar">
            <div>
                <h1>{title}</h1>
                <p>Hệ thống quản lý học tập trực tuyến</p>
            </div>

            <div className="topbar-user">
                <div className="topbar-avatar">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="topbar-user-info">
                    <strong>{user?.fullName || user?.code || "Người dùng"}</strong>
                    <span>{user?.role || ""}</span>
                </div>

                <button className="logout-btn" onClick={onLogout}>
                    Đăng xuất
                </button>
            </div>
        </header>
    );
}