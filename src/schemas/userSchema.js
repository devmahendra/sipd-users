const Joi = require("joi");

exports.loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

exports.getDataSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
});