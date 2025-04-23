require('dotenv').config({ path: __dirname + '/../../.env' });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7 days';

const comparePassword = async (inputPassword, storedHash) => {
  return bcrypt.compare(inputPassword, storedHash);
};

const buildTokenPayload = (user) => {
    return {
        sub: user.id, 
        username: user.username,
        role: user.user_role.name,
        menus: user.user_menu.map(menu => ({
        id: menu.menu_id,
        c: menu.can_create,
        r: menu.can_read,
        u: menu.can_update,
        d: menu.can_delete,
        })),
    };
};


const generateTokens = (user) => {
  const payload = buildTokenPayload(user);
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
  };
};

module.exports = { comparePassword, generateTokens };
