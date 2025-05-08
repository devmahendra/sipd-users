const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { redisClient } = require('../configs/redis');
const { comparePassword } = require('../helpers/password');
const userRepository = require('../repositories/userRepository');
const { logData } = require('../utils/loggers');
const { HttpError } = require('../utils/errorHandler');

const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

const login = async (username, password, ip, userAgent, loginAt, proccessName) => {
  const user = await userRepository.getUserByUsername(username);
  if (!user || !await comparePassword(password, user.password || '')) {
        logData({
          level: 'warn',
          proccessName: proccessName,
          data: `Invalid credentials.`,
          httpCode: 401,
      });
      throw new HttpError('Invalid credentials', 401);
  }

  const userDetail = await userRepository.getUserById(user.id); 
  const tokens = await generateTokens(userDetail, ip, userAgent, loginAt);
  await userRepository.storeRefreshToken(user.id, tokens.refreshToken, JWT_REFRESH_EXPIRES_IN);

  return { tokens };
};

const buildTokenPayload = (user, ip, agent, loginAt) => {
  const base = user[0]
    return {
        id: base.user_id, 
        username: base.username,
        role: base.role_name,
        menus: user.filter(item => item.menu_id).map(item => ({
            id: item.menu_id,
            c: item.can_create,
            r: item.can_read,
            u: item.can_update,
            d: item.can_delete,
        })),
        meta: {
          ip: ip,
          agent: agent,
          loginAt: loginAt,
        },
    };
};

const generateTokens = async (user, ip, agent, loginAt) => {
  const sessionId = uuidv4();
  const sessionData = buildTokenPayload(user, ip, agent, loginAt);
  await redisClient.set(`${sessionId}`, JSON.stringify(sessionData), {
    EX: 60 * 60, 
  });
  const accessToken = jwt.sign({ jti: sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
  const refreshToken = jwt.sign({ sub: user[0].user_id, jti: sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN,
  };
};

module.exports = { login };
