import Joi from "joi";

const loginSchema = Joi.object({
  username: Joi.string().min(1).required().messages({
    "string.min": "Username must be at least 3 characters long.",
    "any.required": "Username is required.",
  }),
  password: Joi.string().min(1).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

export default loginSchema