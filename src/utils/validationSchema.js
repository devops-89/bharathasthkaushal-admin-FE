export const loginValidation = ({ state, errors, setErrors }) => {
  const { email, password } = state;
   
  if (email === "" || password === "") {
    setErrors({
      ...errors,
      email: email === "" && "Please Enter Valid Emails",
      password: password === "" && "Please Enter Password",
    });
    return false;
  } else {
    return true;
  }
};

