const userService = require('../services/userService');
const checkPermission = require('../utils/checkPermission');
const getPaginationParams = require('../helpers/pagination');
const { handleSuccess } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');

const getData = async (req, res) => {
    let proccessName = req.routeConfig.name;

    if (!checkPermission(req, res, 'r')) return;

    const { page, limit } = getPaginationParams(req);

    try {
      const result = await userService.getData(page, limit, proccessName);
      handleSuccess(res, req, 200, {
        data: result.data,
        pagination: {
          totalRecords: result.totalRecords,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        },
      });
    } catch (error) {
      handleError(res, req, error);
    }
};

const insertData = async (req, res) => {
  let proccessName = req.routeConfig.name;

  if (!checkPermission(req, res, 'r')) return;

  const { username } = req.body;
  const createdBy = req.user?.id;

  try {
    await userService.insertData({ username, createdBy }, proccessName);
    handleSuccess(res, req, 200, "data created successfully");
  } catch (error) {
    handleError(res, req, error);
  }
}

module.exports = { getData, insertData };