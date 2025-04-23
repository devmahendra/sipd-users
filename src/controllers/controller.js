const service = require('../services/service');
const defaultResponse = require('../utils/responseDefault');

const login = async (req, res) => {
  try {
    const result = await service.login(req);
    res.status(200).json(defaultResponse("SUCCESS",{ data: result },req));
  } catch (error) {
    res.status(500).json(defaultResponse("INTERNAL_ERROR", { error: error.message }, req));
  }
};

module.exports = { login };