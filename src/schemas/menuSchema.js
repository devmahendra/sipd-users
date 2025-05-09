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
    path: Joi.string().min(1).max(100).required(),
    icon: Joi.string().min(1).max(50).allow('').optional(),
    parent_id: Joi.number().integer().min(1).allow('').optional(),
    sort_order: Joi.string().allow('').max(20).optional(),
  }),
};

exports.updateDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object({
    name: Joi.string().min(1).max(50).required(),
    path: Joi.string().min(1).max(100).required(),
    icon: Joi.string().min(1).max(50).allow('').optional(),
    parent_id: Joi.number().integer().min(1).allow('').optional(),
    sort_order: Joi.string().allow('').max(20).optional(),
  }),
};

exports.deleteDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
};
