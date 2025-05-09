const Joi = require("joi");

exports.getDataSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  }),
};

exports.createDataSchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(50).required(),
    description: Joi.string().allow('').optional(),
  }),
};

exports.updateDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object({
    name: Joi.string().min(1).max(50).required(),
    description: Joi.string().allow('').optional(),
  }),
};

exports.deleteDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
};
