export const passwordStrength = (
  password
) => {
  let score = 0;

  if (password.length >= 8)
    score++;

  if (/[A-Z]/.test(password))
    score++;

  if (/[a-z]/.test(password))
    score++;

  if (/\d/.test(password))
    score++;

  if (
    /[!@#$%^&*]/.test(password)
  )
    score++;

  switch (score) {
    case 0:
    case 1:
      return {
        score,
        label: "Very Weak",
      };

    case 2:
      return {
        score,
        label: "Weak",
      };

    case 3:
      return {
        score,
        label: "Fair",
      };

    case 4:
      return {
        score,
        label: "Strong",
      };

    default:
      return {
        score,
        label: "Excellent",
      };
  }
};