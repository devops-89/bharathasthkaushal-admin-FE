import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../assets/image.png";
import { authControllers } from "../api/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";


export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get state passed from ForgotPassword
    const { email, referenceId } = location.state || {};

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [isResending, setIsResending] = useState(false);
    const [errors, setErrors] = useState({
        otp: "",
        password: "",
        confirmPassword: "",
        passwordFormat: ""
    });

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (errors.otp) setErrors({ ...errors, otp: "" });

        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newOtp = [...otp];
            pasteData.split("").forEach((char, index) => {
                if (index < 6) newOtp[index] = char;
            });
            setOtp(newOtp);
            // Focus the last filled input
            const form = e.target.form;
            if (form) {
                const inputs = Array.from(form.querySelectorAll('input[name="otp"]'));
                const lastIndex = Math.min(pasteData.length - 1, 5);
                if (inputs[lastIndex]) {
                    inputs[lastIndex].focus();
                }
            }
        }
    };

    const formatTime = (timeInSeconds) => {
        const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const s = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleResendOtp = async () => {
        if (timer > 0 || isResending) return;

        setIsResending(true);
        try {
            await authControllers.resendOtp({
                identity: email,
                otpType: "FORGOT_PASSWORD_OTP"
            });
            toast.dismiss();
            toast.success("OTP resent to your email!");
            setTimer(120);
        } catch (err) {
            console.error("Resend OTP Error:", err);
            const errorMessage = err?.response?.data?.message || "Failed to resend OTP.";
            toast.dismiss();
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        if (!email && !referenceId) {
            toast.dismiss();
            toast.warning("Please initiate password reset from the Forgot Password page.");
            // navigate("/forgot-password"); // Optional: redirect back
        }
    }, [email, referenceId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = { otp: "", password: "", confirmPassword: "", passwordFormat: "" };
        let hasError = false;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!referenceId) {
            toast.dismiss();
            toast.error("Missing reference ID. Please try 'Forgot Password' again.");
            return;
        }

        const otpValue = otp.join("");

        if (otpValue.length < 6) {
            newErrors.otp = "Please enter the 6-digit OTP.";
            hasError = true;
        }

        if (!password) {
            newErrors.password = "Please enter a new password.";
            hasError = true;
        } else if (!passwordRegex.test(password)) {
            newErrors.passwordFormat = "A password should contain: At least 8 characters, 1 uppercase (A-Z), 1 lowercase (a-z), 1 number (0-9) & 1 special character (!@#$%^&*).";
            hasError = true;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password.";
            hasError = true;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        setIsLoading(true);
        try {
            const payload = {
                referenceId: referenceId, // Using the ID from the previous step
                otp: otpValue,
                password: password
            };
            // console.log("Resetting password with:", payload);

            await authControllers.resetPassword(payload);

            toast.dismiss();
            toast.success("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error("Reset Password Error:", err);
            const errorMessage = err?.response?.data?.message || "Failed to reset password. Please check your OTP.";
            toast.dismiss();
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
        marginTop: "16px",
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
                    {/*<p style={subtitleStyle}>Enter OTP and your new password</p>*/}
                </div>

                <div style={formContainerStyle}>
                    <button
                        onClick={() => navigate(-1)}
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
                        type="button"
                    >
                        <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Back
                    </button>
                    <form onSubmit={handleSubmit} noValidate>
                        {/* OTP Field */}
                        <div style={fieldContainerStyle}>
                            <label style={labelStyle}>
                                Enter OTP
                            </label>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                                {otp.map((data, index) => {
                                    return (
                                        <input
                                            key={index}
                                            type="text"
                                            name="otp"
                                            maxLength="1"
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            onPaste={handleOtpPaste}
                                            style={{
                                                ...inputStyle,
                                                border: errors.otp ? "2px solid #f87171" : "2px solid #fde68a",
                                                width: "100%",
                                                height: "45px",
                                                padding: "0",
                                                textAlign: "center",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            {errors.otp && (
                                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>
                                    {errors.otp}
                                </p>
                            )}
                        </div>

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
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: "" });
                                    }}
                                    style={{ ...inputStyle, border: (errors.password || errors.passwordFormat) ? "2px solid #f87171" : "2px solid #fde68a", paddingRight: "40px" }}
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
                            {errors.password && (
                                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>
                                    {errors.password}
                                </p>
                            )}
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
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                                    }}
                                    style={{ ...inputStyle, border: errors.confirmPassword ? "2px solid #f87171" : "2px solid #fde68a", paddingRight: "40px" }}
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
                            {errors.confirmPassword && (
                                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {errors.passwordFormat && (
                            <div style={{ color: "#f87171", fontSize: "12px", marginBottom: "16px", textAlign: "center", fontWeight: "500", lineHeight: "1.4" }}>
                                {errors.passwordFormat}
                            </div>
                        )}

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
                        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#92400e" }}>
                            {/*Didn't receive the OTP?{" "} */}
                            <span
                                onClick={timer > 0 || isResending ? undefined : handleResendOtp}
                                style={{
                                    color: timer > 0 || isResending ? "#9ca3af" : "#d97706",
                                    cursor: timer > 0 || isResending ? "not-allowed" : "pointer",
                                    fontWeight: "600",
                                    transition: "color 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                    if (timer === 0 && !isResending) e.target.style.color = "#ea580c";
                                }}
                                onMouseLeave={(e) => {
                                    if (timer === 0 && !isResending) e.target.style.color = "#d97706";
                                }}
                            >
                                Resend OTP
                            </span>
                            {timer > 0 && <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{formatTime(timer)}</span>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
