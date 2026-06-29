export const validatePassword = (
  password
) => ({
  minLength:
    password.length >= 8,

  upperCase:
    /[A-Z]/.test(password),

  lowerCase:
    /[a-z]/.test(password),

  number: /\d/.test(password),

  special:
    /[!@#$%^&*]/.test(password),
});