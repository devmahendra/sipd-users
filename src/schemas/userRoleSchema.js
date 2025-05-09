const Joi = require("joi");

exports.getDataSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  }),
};

exports.createDataSchema = {
  body: Joi.object({
    userId: Joi.number().integer().min(1).required(),
    roleId: Joi.number().integer().min(1).required(),
  }),
};

exports.updateDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object({
    userId: Joi.number().integer().min(1).required(),
    roleId: Joi.number().integer().min(1).required(),
  }),
};

exports.deleteDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
};
