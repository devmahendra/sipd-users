const Joi = require("joi");

exports.loginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

exports.getDataSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  }),
};

exports.createDataSchema = {
  body: Joi.object({
    username: Joi.string().min(1).max(50).required(),
    firstName: Joi.string().min(1).max(100).required(),
    lastName: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().min(1).max(100).required(),
    phone_number: Joi.string().pattern(/^[0-9]+$/).allow('').max(20).optional(),
  }),
};

exports.updateDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object({
    firstName: Joi.string().min(1).max(100).allow('').optional(),
    lastName: Joi.string().min(1).max(100).allow('').optional(),
    email: Joi.string().email().min(1).max(100).optional(),
    phone_number: Joi.string().pattern(/^[0-9]+$/).allow('').max(20).optional(),
  }),
};

exports.deleteDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
};
