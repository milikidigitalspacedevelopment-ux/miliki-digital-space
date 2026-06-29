import Joi from "joi";

export const updateUserValidation = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().optional(),
  isActive: Joi.boolean().optional()
});

export const updateProfileValidation = Joi.object({
  name: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
  bio: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  avatar: Joi.string().uri().optional()
});

export const roleValidation = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  permissions: Joi.array().items(Joi.string()).optional()
});
