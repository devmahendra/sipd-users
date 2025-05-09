const Joi = require("joi");

exports.getDataSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  }),
};

exports.createDataSchema = {
  body: Joi.object({
    roleId: Joi.number().integer().min(1).required(),
    menuId: Joi.number().integer().min(1).required(),
    canRead: Joi.boolean().required(),
    canCreate: Joi.boolean().required(),
    canUpdate: Joi.boolean().required(),
    canDelete: Joi.boolean().required(),
  }),
};

exports.updateDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object({
    roleId: Joi.number().integer().min(1).required(),
    menuId: Joi.number().integer().min(1).required(),
    canRead: Joi.boolean().required(),
    canCreate: Joi.boolean().required(),
    canUpdate: Joi.boolean().required(),
    canDelete: Joi.boolean().required(),
  }),
};

exports.deleteDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
};
