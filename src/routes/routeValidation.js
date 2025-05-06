const userSchema = require("../schemas/userSchema");

module.exports = {
    LOGIN: userSchema.loginSchema,
    GET_USER: userSchema.getDataSchema,
};