import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getRoleHomePath } from "./roleRedirect";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user, isInitializing } = useAuth();

    if (isInitializing) {
        return <div className="app-center-loader">Đang tải dữ liệu người dùng...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getRoleHomePath(user.role)} replace />;
    }

    return children;
}