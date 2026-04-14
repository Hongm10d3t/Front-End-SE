export function getRoleHomePath(role) {
    switch (role) {
        case "ADMIN":
            return "/admin";
        case "TEACHER":
            return "/teacher";
        case "STUDENT":
            return "/student";
        default:
            return "/login";
    }
}