import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().optional()
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordValidation = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});
