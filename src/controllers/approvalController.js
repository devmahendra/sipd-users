const approvalService = require('../services/approvalService');
const checkPermission = require('../utils/checkPermission');
const getPaginationParams = require('../helpers/pagination');
const { handleSuccess } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');

const getData = async (req, res) => {
    if (!checkPermission(req, res, 'r')) return;

    const { page, limit } = getPaginationParams(req);

    try {
      const result = await approvalService.getData(page, limit);
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

const approveData = async (req, res) => {
  if (!checkPermission(req, res, 'u')) return;
  const approvalId = parseInt(req.params.id);
  const approvedAt = new Date();
  const { entityType, entityId, status } = req.body;
  const approvedBy = req.user?.id;

  try {
    await approvalService.approveEntity({ approvalId, entityType, entityId, approvedAt, status, approvedBy });
    handleSuccess(res, req, 200, `data ${status} successfully`);
  } catch (error) {
    handleError(res, req, error);
  }
}

module.exports = { getData, approveData };