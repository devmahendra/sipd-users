const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../configs/redis');

const comparePassword = async (inputPassword, storedHash) => {
  const normalizedHash = storedHash.replace(/^\$2y\$/, '$2b$');
  return bcrypt.compare(inputPassword, normalizedHash);
};

const buildTokenPayload = (user) => {
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
    };
};

const generateTokens = async (user) => {
  const sessionId = uuidv4();
  const sessionData = buildTokenPayload(user);
  await redisClient.set(`${sessionId}`, JSON.stringify(sessionData), {
    EX: 60 * 60, 
  });

  const accessToken = jwt.sign({ jti: sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  const refreshToken = jwt.sign({ sub: user[0].user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN,
  };
};

module.exports = { comparePassword, generateTokens };
