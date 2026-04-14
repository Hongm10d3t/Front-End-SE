export function formatRole(role) {
    switch (role) {
        case "ADMIN":
            return "Quản trị viên";
        case "TEACHER":
            return "Giảng viên";
        case "STUDENT":
            return "Sinh viên";
        default:
            return role || "Không xác định";
    }
}

export function formatStatus(status) {
    switch (status) {
        case "ACTIVE":
            return "Đang hoạt động";
        case "INACTIVE":
            return "Ngưng hoạt động";
        default:
            return status || "Không rõ";
    }
}

export function getRoleClass(role) {
    switch (role) {
        case "ADMIN":
            return "badge badge-admin";
        case "TEACHER":
            return "badge badge-teacher";
        case "STUDENT":
            return "badge badge-student";
        default:
            return "badge";
    }
}

export function getStatusClass(status) {
    switch (status) {
        case "ACTIVE":
            return "badge badge-success";
        case "INACTIVE":
            return "badge badge-muted";
        default:
            return "badge";
    }
}