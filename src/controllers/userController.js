const userService = require('../services/userService');
const defaultResponse = require('../utils/responseDefault');
const { hasPermission } = require('../utils/permission');

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await userService.login(username, password);
        if (res.status(200)) {
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000, // 1 hour
                sameSite: 'None',
            });
            
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: 'None',
            });
        }
        res.status(200).json(defaultResponse("SUCCESS", null, req));
    } catch (error) {
        res.status(500).json(defaultResponse("INTERNAL_ERROR", { error: error.message }, req));
    }
};

const getData = async (req, res) => {
    const user = req.user;
    const routeId = req.routeId
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;

    if (!hasPermission(user, routeId, 'r')) {
        return res.status(403).json(defaultResponse("FORBIDDEN", null, req));
    }

    try {
      const result = await userService.getData(page, limit);
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

module.exports = { login, getData };