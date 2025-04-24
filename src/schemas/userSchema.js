const Joi = require("joi");

exports.loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});