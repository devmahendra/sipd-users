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

  if (!checkPermission(req, res, 'c')) return;

  const { username, firstName, lastName, email, phoneNumber } = req.body;
  const createdBy = req.user?.id;

  try {
    await userService.insertData({ username, firstName, lastName, email, phoneNumber, createdBy }, proccessName);
    handleSuccess(res, req, 200, "data created successfully");
  } catch (error) {
    handleError(res, req, error);
  }
}

const updateData = async (req, res) => {
  let proccessName = req.routeConfig.name;

  if (!checkPermission(req, res, 'u')) return;
  const id = parseInt(req.params.id);
  const { firstName, lastName, email, phoneNumber } = req.body;
  const updatedBy = req.user?.id;

  try {
    await userService.updateData({ id, firstName, lastName, email, phoneNumber, updatedBy }, proccessName);
    handleSuccess(res, req, 200, "data updated successfully");
  } catch (error) {
    handleError(res, req, error);
  }
}

const deleteData = async (req, res) => {
  let proccessName = req.routeConfig.name;
  
  if (!checkPermission(req, res, 'd')) return;
  const id = parseInt(req.params.id);
  const deletedAt = new Date();
  const deletedBy = req.user?.id;

  try {
    await userService.deleteData({ id, deletedAt, deletedBy }, proccessName);
    handleSuccess(res, req, 200, "data deleted successfully");
  } catch (error) {
    handleError(res, req, error);
  }
}

module.exports = { getData, insertData, updateData, deleteData };