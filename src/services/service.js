const authService = require('./authService');
const repository = require('../repositories/repository');

const login = async (req) => {
    const { username, password } = req.body;
    const users = await repository.getUserByUsername(username);

    if (users.length === 0) throw new Error('User not found');

    const user = users[0];
    const isValidPassword = await authService.comparePassword(password, user.password);
    if (!isValidPassword) throw new Error('Username or password is incorrect');

    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } = authService.generateTokens(user);
    await repository.storeRefreshToken(user.id, refreshToken, refreshExpiresIn);

    return {
        accessToken,
        refreshToken,
        expiresIn,
    };
};

module.exports = { login };
