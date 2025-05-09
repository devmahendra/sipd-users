const roleMenuService = require('../services/roleMenuService');
const checkPermission = require('../utils/checkPermission');
const getPaginationParams = require('../helpers/pagination');
const { handleSuccess } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');

const getData = async (req, res) => {
    if (!checkPermission(req, res, 'r')) return;

    const { page, limit } = getPaginationParams(req);

    try {
      const result = await roleMenuService.getData(page, limit);
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
  if (!checkPermission(req, res, 'c')) return;

  const { roleId, menuId } = req.body;
  const createdBy = req.user?.id;

  try {
    await roleMenuService.insertData({ roleId, menuId, createdBy });
    handleSuccess(res, req, 200, "data created successfully");
  } catch (error) {
    handleError(res, req, error);
  }
};

const updateData = async (req, res) => {
  if (!checkPermission(req, res, 'u')) return;
  const id = parseInt(req.params.id);
  const { roleId, menuId } = req.body;
  const updatedBy = req.user?.id;

  try {
    await roleMenuService.updateData({ id, roleId, menuId, updatedBy });
    handleSuccess(res, req, 200, "data updated successfully");
  } catch (error) {
    handleError(res, req, error);
  }
};

const deleteData = async (req, res) => {
  if (!checkPermission(req, res, 'd')) return;
  const id = parseInt(req.params.id);
  const deletedAt = new Date();
  const deletedBy = req.user?.id;

  try {
    await roleMenuService.deleteData({ id, deletedAt, deletedBy });
    handleSuccess(res, req, 200, "data deleted successfully");
  } catch (error) {
    handleError(res, req, error);
  }
};

module.exports = { getData, insertData, updateData, deleteData };
