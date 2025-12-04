import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/image.png";
import { authControllers } from "../api/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);
        try {
            await authControllers.forgotPassword({ email });
            toast.success("Password reset link sent to your email!");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "Failed to send reset link";
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
                    <h1 style={titleStyle}>Forgot Password</h1>
                    <p style={subtitleStyle}>Enter your email to reset password</p>
                </div>

                <div style={formContainerStyle}>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#d97706",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "16px",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}
                    >
                        <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Back to Login
                    </button>
                    <form onSubmit={handleSubmit}>
                        <div style={fieldContainerStyle}>
                            <label htmlFor="email" style={labelStyle}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter your registered email"
                            />
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
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
