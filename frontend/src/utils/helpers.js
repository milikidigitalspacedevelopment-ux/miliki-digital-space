export const capitalize = (
  value = ""
) =>
  value.charAt(0).toUpperCase() +
  value.slice(1);


export const truncateText = (
  text,
  maxLength = 100
) => {

  if (!text) return "";

  return text.length <= maxLength
    ? text
    : `${text.substring(
        0,
        maxLength
      )}...`;
};


export const slugify = (
  text = ""
) =>

  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");


export const debounce = (
  callback,
  delay = 500
) => {

  let timer;

  return (...args) => {

    clearTimeout(timer);

    timer = setTimeout(
      () => callback(...args),
      delay
    );

  };

};


export const generateAvatar = (
  fullName = ""
) => {

  return fullName
    .split(" ")
    .map(
      (word) => word[0]
    )
    .join("")
    .toUpperCase();

};