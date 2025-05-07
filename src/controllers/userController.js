const userService = require('../services/userService');
const defaultResponse = require('../utils/responseDefault');
const checkPermission = require('../utils/checkPermission');
const getPaginationParams = require('../helpers/pagination');
const mapHttpCode = require('../helpers/mapHttpCode');

const getData = async (req, res) => {
    let proccessName = req.routeConfig.name;

    if (!checkPermission(req, res, 'r')) return;

    const { page, limit } = getPaginationParams(req);

    try {
      const result = await userService.getData(page, limit, proccessName);
      res.status(200).json(defaultResponse("SUCCESS",{
          data: result.data,
          pagination: {
            totalRecords: result.totalRecords,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
          },
        },
      req));
    } catch (error) {
      res.status(500).json(defaultResponse("INTERNAL_ERROR", { error: error.message }, req));
    }
};

const insertData = async (req, res) => {
  let proccessName = req.routeConfig.name;
;
  if (!checkPermission(req, res, 'r')) return;

  const { username } = req.body;
  const createdBy = req.user?.id;

  try {
    await userService.insertData({ username, createdBy }, proccessName);
    res.status(200).json(defaultResponse("SUCCESS", "data created successfully", req));
  } catch (error) {
    const httpCode = error.httpCode || 500;
    const responseType = mapHttpCode(httpCode);
    res.status(httpCode).json(defaultResponse(responseType, { error: error.message }, req));
  }
}

module.exports = { getData, insertData };