const authService = require('../services/authService');
const { handleSuccess } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');

const login = async (req, res) => {
    let proccessName = req.routeConfig.name;
    const { username, password } = req.body;
    const ip = req.ip || req.socket.remoteAddress
    const userAgent = req.headers['user-agent'] || 'unknown';
    const loginAt = new Date();
    try {
        const result = await authService.login(username, password, ip, userAgent, loginAt, proccessName);
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
        handleSuccess(res, req, 200, null);
    } catch (error) {
        handleError(res, req, error);
    }
};

module.exports = { login };