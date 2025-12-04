import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logoImage from "../assets/image.png";
import { authControllers } from "../api/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Assuming token is passed as a query param
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);
        try {
            // Adjust payload based on actual API requirements. 
            // Often it's { token, password } or { token, newPassword }
            await authControllers.resetPassword({ token, password });
            toast.success("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "Failed to reset password";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle = {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "linear-gradient(135deg, #fef7ed 0%, #fef3c7 50%, #fefce8 100%)",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
    };

    const cardStyle = {
        width: "100%",
        maxWidth: "384px",
        padding: "0 16px",
    };
    const logoContainerStyle = {
        textAlign: "center",
        marginBottom: "24px",
    };
    const titleStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#92400e",
        marginBottom: "4px",
    };
    const subtitleStyle = {
        fontSize: "14px",
        color: "#d97706",
    };
    const formContainerStyle = {
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(8px)",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        padding: "24px",
        border: "1px solid #fde68a",
    };

    const fieldContainerStyle = {
        marginBottom: "16px",
    };
    const labelStyle = {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#92400e",
        marginBottom: "4px",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "12px",
        border: "2px solid #fde68a",
        outline: "none",
        transition: "all 0.2s",
        background: "rgba(255, 255, 255, 0.8)",
        color: "#78350f",
        fontSize: "14px",
    };

    const buttonStyle = {
        width: "100%",
        background: isLoading
            ? "#9ca3af"
            : "linear-gradient(90deg, #d97706 0%, #ea580c 100%)",
        color: "white",
        fontWeight: "600",
        padding: "10px 24px",
        borderRadius: "12px",
        border: "none",
        cursor: isLoading ? "not-allowed" : "pointer",
        boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s",
        marginTop: "24px",
        fontSize: "14px",
    };

    return (
        <div style={containerStyle}>
            <ToastContainer />
            <div style={cardStyle}>
                <div style={logoContainerStyle}>
                    <img
                        src={logoImage}
                        alt="Logo"
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "12px",
                            boxShadow:
                                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    />
                    <h1 style={titleStyle}>Reset Password</h1>
                    <p style={subtitleStyle}>Enter your new password</p>
                </div>

                <div style={formContainerStyle}>
                    <form onSubmit={handleSubmit}>
                        <div style={fieldContainerStyle}>
                            <label htmlFor="password" style={labelStyle}>
                                New Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ ...inputStyle, paddingRight: "40px" }}
                                    placeholder="Enter new password"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#92400e",
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        <div style={fieldContainerStyle}>
                            <label htmlFor="confirmPassword" style={labelStyle}>
                                Confirm Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{ ...inputStyle, paddingRight: "40px" }}
                                    placeholder="Confirm new password"
                                />
                                <span
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#92400e",
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={buttonStyle}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.target.style.background =
                                        "linear-gradient(90deg, #b45309 0%, #c2410c 100%)";
                                    e.target.style.transform = "scale(1.05)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.target.style.background =
                                        "linear-gradient(90deg, #d97706 0%, #ea580c 100%)";
                                    e.target.style.transform = "scale(1)";
                                }
                            }}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
