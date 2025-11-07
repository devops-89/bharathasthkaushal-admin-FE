// export const loginValidation = ({ state, errors, setErrors }) => {
//   const { email, password } = state;
   
//   if (email === "" || password === "") {
//     setErrors({
//       ...errors,
//       email: email === "" && "Please Enter Valid Emails",
//       password: password === "" && "Please Enter Password",
//     });
//     return false;
//   } else {
//     return true;
//   }
// };

export const loginValidation = ({ state, errors, setErrors }) => {
  const { email, password } = state;

  let newErrors = { email: "", password: "", general: "" };

  // Email Empty
  if (!email.trim()) {
    newErrors.email = "Please Enter Email";
  } 
  // Email Invalid Format
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Please Enter Valid Email";
  }

  // Password Empty
  if (!password.trim()) {
    newErrors.password = "Please Enter Password";
  }

  setErrors(newErrors);

  // If koi error nhi hai -> true
  return newErrors.email === "" && newErrors.password === "";
};
