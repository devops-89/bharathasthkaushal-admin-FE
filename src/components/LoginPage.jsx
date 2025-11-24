import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/image.png";
import { authControllers } from "../api/auth";
import { Eye, EyeOff } from "lucide-react";
import { loginValidation } from "../utils/validationSchema";
export default function LoginPage({ onLogin }) {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",                      
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const inputHandler = (e) => {
    const { id, value } = e.target;
    setState({ ...state, [id]: value });
    setErrors({
      email: "",
      password: "",
      general: "",
    });
  };
  const handleSubmit = () => {
    let frontendErrors = { email: "", password: "", general: "" };
    const emailTrimmed = state.email.trim();
    if (!emailTrimmed) {
      frontendErrors.email = "Invalid email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        frontendErrors.email = "Invalid email";
      } else {
       
        const domainPart = emailTrimmed.split('@')[1];
        if (domainPart) {
          const lastPart = domainPart.split('.').pop();
          
    
          const commonTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'in', 'uk', 'us', 'au', 'ca', 'de', 'fr', 'jp', 'cn', 'ru', 'br', 'mx', 'it', 'es', 'nl', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'gr', 'ie', 'pt', 'be', 'at', 'ch', 'nz', 'sg', 'hk', 'my', 'th', 'ph', 'id', 'vn', 'kr', 'tw', 'tr', 'ae', 'sa', 'eg', 'za', 'info', 'biz', 'xyz', 'tech', 'online', 'site', 'website', 'app', 'dev', 'cloud', 'email', 'mail', 'me', 'tv', 'cc', 'ws', 'name', 'mobi', 'asia', 'tel', 'travel', 'jobs', 'pro', 'museum', 'aero', 'coop', 'int', 'mil'];
          
          if (!lastPart || lastPart.length < 2) {
    
            frontendErrors.email = "Invalid email";
          } else if (/^\d+$/.test(lastPart)) {
       
            frontendErrors.email = "Invalid email";
          } else if (lastPart.length > 15) {
     
            frontendErrors.email = "Invalid email";
          } else if (/[^a-zA-Z]/.test(lastPart)) {
       
            frontendErrors.email = "Invalid email";
          } else if (!commonTLDs.includes(lastPart.toLowerCase())) {
     
            const commonTypos = ['comm', 'commm', 'commmm', 'room', 'roomm', 'roommm', 'conj', 'con', 'coom', 'coomm', 'rrrm', 'rrr', 'rrrr'];
            if (commonTypos.includes(lastPart.toLowerCase()) || lastPart.length > 6) {
              frontendErrors.email = "Invalid email";
            }
            // For other uncommon TLDs, let backend validate (don't block in frontend)
          }
        }
      }
    }
    if (!state.password.trim()) {
      frontendErrors.password = "Invalid password";
    }
    const hasEmailError = frontendErrors.email !== "";
    const hasPasswordError = frontendErrors.password !== "";
    
    if (hasEmailError || hasPasswordError) {
      setErrors(frontendErrors);
      
      return;
    }
    let body = {
      identity: emailTrimmed,
      password: state.password,
    };
    setIsLoading(true);
    

    setErrors({ email: "", password: "", general: "" });
    
    authControllers
      .login(body)
      .then((res) => {
        const response = res.data.data;
        localStorage.setItem("accessToken", response.accessToken);
        navigate("/dashboard");
        setIsLoading(false);
      })
      .catch((err) => {
        let errMessage = err?.response?.data?.message || "";
        const errorMsgLower = errMessage.toLowerCase();
        
        
        let apiErrors = { email: "", password: "", general: "" };
        
 
        if (errorMsgLower.includes("phone")) {

          apiErrors.password = "Invalid password";
        }
       
        else if (errorMsgLower.includes("password") && 
                 (errorMsgLower.includes("incorrect") || 
                  errorMsgLower.includes("wrong") || 
                  errorMsgLower.includes("invalid"))) {

          apiErrors.password = "Invalid password";
        }
       
        else if (errorMsgLower.includes("user not found") || 
                 errorMsgLower.includes("email not found") ||
                 errorMsgLower.includes("no user") ||
                 errorMsgLower.includes("account not found") ||
                 errorMsgLower.includes("invalid email") ||
                 errorMsgLower.includes("email invalid") ||
                 (errorMsgLower.includes("user") && errorMsgLower.includes("not found")) ||
                 errorMsgLower.includes("user does not exist")) {
         
          apiErrors.email = "Invalid email";
        }
      
        else {
          const domainPart = emailTrimmed.split('@')[1];
          let emailLooksInvalid = false;
          
          if (domainPart) {
            const lastPart = domainPart.split('.').pop();
            const commonTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'in', 'uk', 'us', 'au', 'ca', 'de', 'fr', 'jp', 'cn', 'ru', 'br', 'mx', 'it', 'es', 'nl', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'gr', 'ie', 'pt', 'be', 'at', 'ch', 'nz', 'sg', 'hk', 'my', 'th', 'ph', 'id', 'vn', 'kr', 'tw', 'tr', 'ae', 'sa', 'eg', 'za', 'info', 'biz', 'xyz', 'tech', 'online', 'site', 'website', 'app', 'dev', 'cloud', 'email', 'mail', 'me', 'tv', 'cc', 'ws', 'name', 'mobi', 'asia', 'tel', 'travel', 'jobs', 'pro', 'museum', 'aero', 'coop', 'int', 'mil', 'yopmail', 'gmail', 'yahoo', 'hotmail', 'outlook', 'live', 'msn', 'aol', 'icloud', 'mail', 'pm', 'gm', 'ru', 'ua', 'by', 'kz', 'uz', 'tj', 'kg', 'md', 'am', 'az', 'ge', 'lv', 'lt', 'ee', 'is', 'li', 'lu', 'mc', 'ad', 'sm', 'va', 'mt', 'cy', 'gi', 'je', 'gg', 'im', 'fo', 'gl', 'sj', 'ax', 'bg', 'ro', 'hu', 'sk', 'si', 'hr', 'ba', 'rs', 'me', 'mk', 'al', 'xk'];
         
            if (!lastPart || lastPart.length < 2) {
            
              emailLooksInvalid = true;
            } else if (/^\d+$/.test(lastPart)) {
            
              emailLooksInvalid = true;
            } else if (lastPart.length > 15) {
       
              emailLooksInvalid = true;
            } else if (/[^a-zA-Z]/.test(lastPart)) {
             
              emailLooksInvalid = true;
            } else if (!commonTLDs.includes(lastPart.toLowerCase())) {
              
              emailLooksInvalid = true;
            }
          } else {
            // No domain part found
            emailLooksInvalid = true;
          }
          
          // If email looks suspicious and backend rejected it, show email error
          // Otherwise, assume password is wrong
          if (emailLooksInvalid) {
            apiErrors.email = "Invalid email";
          } else {
            apiErrors.password = "Invalid password";
          }
        }
        
        setErrors(apiErrors);
        setIsLoading(false);
      });
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
  const inputFocusStyle = {
    borderColor: "#f59e0b",
    boxShadow: "0 0 0 2px rgba(251, 191, 36, 0.1)",
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

  const demoButtonStyle = {
    width: "100%",
    background: "transparent",
    color: "#d97706",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #d97706",
    cursor: "pointer",
    fontSize: "12px",
    marginTop: "8px",
    transition: "all 0.2s",
  };
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Logo Section */}
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
          <h1 style={titleStyle}>Handloom & Handicraft</h1>
          <p style={subtitleStyle}>Welcome back</p>
        </div>
        {/* Login Form */}
        <div style={formContainerStyle}>
          <div>
            {/* Email section */}
            <div style={fieldContainerStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={state.email}
                required
                onChange={inputHandler}
                style={inputStyle}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                  {errors.email}
                </p>
              )}
              
            </div>

            <div style={fieldContainerStyle}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={state.password}
                  required
                  onChange={inputHandler}
                  style={{ ...inputStyle, paddingRight: "40px" }}
                  placeholder="Enter your password"
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
                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleSubmit}
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
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
