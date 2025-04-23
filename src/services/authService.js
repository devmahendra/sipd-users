require('dotenv').config({ path: __dirname + '/../../.env' });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7 days';

const comparePassword = async (inputPassword, storedHash) => {
  return bcrypt.compare(inputPassword, storedHash);
};

const generateTokens = (user) => {
  const payload = { id: user.id, username: user.username };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = crypto.randomBytes(40).toString('hex');
  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
  };
};

module.exports = { comparePassword, generateTokens };
