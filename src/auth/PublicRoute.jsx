import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getRoleHomePath } from "./roleRedirect";

export default function PublicRoute({ children }) {
    const { user, isInitializing } = useAuth();

    if (isInitializing) {
        return <div className="app-center-loader">Đang tải...</div>;
    }

    if (user) {
        return <Navigate to={getRoleHomePath(user.role)} replace />;
    }

    return children;
}