import { AuthProvider } from "../auth/AuthProvider";

export default function AppProviders({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}