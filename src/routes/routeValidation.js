const userSchema = require("../schemas/userSchema");

module.exports = {
    LOGIN: userSchema.loginSchema,
    GET_USER: userSchema.getDataSchema,
    CREATE_USER: userSchema.createDataSchema,
    UPDATE_USER: userSchema.updateDataSchema,
};