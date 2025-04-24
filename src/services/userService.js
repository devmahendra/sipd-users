const authService = require('./authService');
const userRepository = require('../repositories/userRepository');

const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

const login = async (req) => {
    const { username, password } = req.body;
    const user = await userRepository.getUserByUsername(username);
    if (!user || !await authService.comparePassword(password, user.password || '')) {
        throw new Error('Invalid credentials');
    }

    const userDetail = await userRepository.getUserById(user.id); 
    const tokens = await authService.generateTokens(userDetail);
    await userRepository.storeRefreshToken(user.id, tokens.refreshToken, JWT_REFRESH_EXPIRES_IN);

    return { tokens };
};

module.exports = { login };
