const userService = require('../services/userService');
const defaultResponse = require('../utils/responseDefault');
const { hasPermission } = require('../utils/permission');

const getData = async (req, res) => {
    let processName = req.routeConfig.name;
    
    const user = req.user;
    const menuId = req.menuId
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;

    if (!hasPermission(user, menuId, 'r')) {
        return res.status(403).json(defaultResponse("FORBIDDEN", null, req));
    }

    try {
      const result = await userService.getData(page, limit, processName);
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
    const user = req.user;
    const menuId = req.menuId

    if (!hasPermission(user, menuId, 'c')) {
        return res.status(403).json(defaultResponse("FORBIDDEN", null, req));
    }

    try {
        const result = await userService.insertData(req.body);
        res.status(200).json(defaultResponse("SUCCESS",{},req));
    } catch (error) {
        res.status(500).json(defaultResponse("INTERNAL_ERROR", { error: error.message }, req));
    }
}

module.exports = { getData, insertData };