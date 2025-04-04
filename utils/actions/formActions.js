import {validateFirstAndLastName, validatePassword,validateEmail, validateLength} from "../validationConstraints";

export const validateInput = (inputId, inputValue) => {
  if (inputId === "firstName" || inputId === "lastName") {
    return validateFirstAndLastName(inputId, inputValue);
  } else if (inputId === "email") {
    return validateEmail(inputId, inputValue);
  } else if (inputId === "password") {
    return validatePassword(inputId, inputValue);
  } else if (inputId === "about") {
    return validateLength(inputId, inputValue, 0, 10, true);
  }
};
