const authService = require('./authService');
const repository = require('../repositories/repository');

const login = async (req) => {
    const { username, password } = req.body;
    const user = await repository.getUserByUsername(username);
    
    if (!user || !await authService.comparePassword(password, user.password || '')) {
        throw new Error('Invalid credentials');
    }

    const userDetail = await repository.getUserById(user.id); 
    const tokens = authService.generateTokens(userDetail);

    await repository.storeRefreshToken(user.id, tokens.refreshToken, tokens.refreshExpiresIn);

    return {
        user: {
            id: user.id,
            username: user.username,
            profile: userDetail.user_profile,
            role: userDetail.user_role.name,
            },
        tokens,
    };
};

module.exports = { login };
