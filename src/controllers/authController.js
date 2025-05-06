const authService = require('../services/authService');
const defaultResponse = require('../utils/responseDefault');

const login = async (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip || req.socket.remoteAddress
    const userAgent = req.headers['user-agent'] || 'unknown';
    const loginAt = new Date();
    try {
        const result = await authService.login(username, password, ip, userAgent, loginAt);
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