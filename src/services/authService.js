const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

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


const generateTokens = (user) => {
  const payload = buildTokenPayload(user);
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN,
  };
};

module.exports = { comparePassword, generateTokens };
