const userSchema = require("../schemas/userSchema");

module.exports = {
    login: userSchema.loginSchema,
    get_user: userSchema.getDataSchema,
};