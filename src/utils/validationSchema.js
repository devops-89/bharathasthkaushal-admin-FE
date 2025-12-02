
export const loginValidation = ({ state, errors, setErrors }) => {
  const { email, password } = state;
  let newErrors = { email: "", password: "", general: "" };
  let hasErrors = false;
  if (!email) {
    newErrors.email = "Invalid email";
    hasErrors = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Invalid email";
    hasErrors = true;
  }

  if (!password.trim()) {
    newErrors.password = "Invalid password";
    hasErrors = true;
  }
 
  setErrors(newErrors);

  // Return true only if both fields are valid (no errors)
  return !hasErrors;
};
