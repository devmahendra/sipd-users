const userService = require('../services/userService');
const defaultResponse = require('../utils/responseDefault');

const login = async (req, res) => {
    try {
        const result = await userService.login(req);
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

module.exports = { login };