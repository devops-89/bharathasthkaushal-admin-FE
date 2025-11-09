
export const loginValidation = ({ state, errors, setErrors }) => {
  const { email, password } = state;
  // Initialize errors object - both fields checked independently
  let newErrors = { email: "", password: "", general: "" };
  let hasErrors = false;
  
  // Email validation - checks if email is empty or invalid format
  // This runs independently, so even if password is also wrong, email error will be set
  if (!email.trim()) {
    newErrors.email = "Invalid email";
    hasErrors = true;
  } 
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Invalid email";
    hasErrors = true;
  }
  
  // Password validation - checked independently (separate if, not else if)
  // This runs regardless of email validation result
  if (!password.trim()) {
    newErrors.password = "Invalid password";
    hasErrors = true;
  }
  // You can add more password validation here if needed
  // else if (password.length < 6) {
  //   newErrors.password = "Invalid password";
  //   hasErrors = true;
  // }
  
  // Set all errors at once - if both are invalid, both errors will be set simultaneously
  setErrors(newErrors);
  
  // Return true only if both fields are valid (no errors)
  return !hasErrors;
};
