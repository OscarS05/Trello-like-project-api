const Joi = require('joi');

const id = Joi.string().uuid();
const email = Joi.string().email();
const name = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z0-9-_ ]+$/)
  .messages({
    'string.pattern.base': 'The user name contains illegal characters',
  });
const password = Joi.string().min(8);

const createUserSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  confirmPassword: Joi.object()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
});

const changePasswordSchema = Joi.object({
  newPassword: password.required(),
  confirmNewPassword: Joi.object()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
});

const userIdSchema = Joi.object({
  userId: id.required(),
});

module.exports = { createUserSchema, changePasswordSchema, userIdSchema };
