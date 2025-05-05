const authService = require('./authService');
const userRepository = require('../repositories/userRepository');

const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

const login = async (username, password, ip, userAgent, loginAt) => {
    const user = await userRepository.getUserByUsername(username);
    if (!user || !await authService.comparePassword(password, user.password || '')) {
        throw new Error('Invalid credentials');
    }

    const userDetail = await userRepository.getUserById(user.id); 
    const tokens = await authService.generateTokens(userDetail, ip, userAgent, loginAt);
    await userRepository.storeRefreshToken(user.id, tokens.refreshToken, JWT_REFRESH_EXPIRES_IN);

    return { tokens };
};

const getData = async (page, limit) => {
    try {
        const result = await userRepository.getData(page, limit);
        console.log(`Success retrieve: ${result.totalRecords} rows.`);
      return result;
    } catch (error) {
        console.error(`Failed retrieve data with error: ${error.message}.`);
        throw error;
    }
};

module.exports = { login, getData };
