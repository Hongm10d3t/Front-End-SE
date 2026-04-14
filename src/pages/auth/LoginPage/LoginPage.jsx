import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import { getRoleHomePath } from "../../../auth/roleRedirect";
import "./LoginPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const user = await login(form);

            if (!user?.role) {
                throw new Error("Không xác định được vai trò người dùng.");
            }

            navigate(getRoleHomePath(user.role));
        } catch (error) {
            setErrorMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-card-header">
                    <span className="login-mini-badge">Xin chào</span>
                    <h2>Đăng nhập hệ thống</h2>
                    <p>Nhập tài khoản để truy cập vào khu vực học tập của bạn.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Nhập username hoặc mã người dùng"
                            value={form.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    {errorMessage ? <div className="form-error">{errorMessage}</div> : null}

                    <button className="login-submit-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}