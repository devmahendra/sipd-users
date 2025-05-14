const Joi = require("joi");

exports.getDataSchema = {
  body: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  }),
};

exports.approveDataSchema = {
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object({
    entityType: Joi.string().required(),
    entityId: Joi.number().integer().min(1).required(),
    status: Joi.string().required(),
  }),
};
