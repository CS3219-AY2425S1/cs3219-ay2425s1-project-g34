
export const validateUsername = (username) => {
  return username.trim() === ''
    ? "Username cannot be empty."
    : "";
}
  
export const validateEmail = (email) => {
  const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return email.trim() === ''
    ? "Email cannot be empty."
    : !re.test(email)
    ? "Invalid email format."
    : "";
}

export const validatePassword = (password, confirmPassword) => {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])[\w@$!%*#?&.+-=]{8,20}$/;
  return (password !== confirmPassword)
    ? "Passwords do not match."
    : !re.test(password)
    ? "Invalid password. Please ensure that it is between 8 and 20 non-space characters, " +
      "and contains at least one alphabet and one digit."
    : "";
}
