const userSchema = require("../schemas/userSchema");
const roleSchema = require("../schemas/roleSchema");
const roleMenuSchema = require("../schemas/roleMenuSchema");
const userRoleSchema = require("../schemas/userRoleSchema");
const menuSchema = require("../schemas/menuSchema");

module.exports = {
    LOGIN: userSchema.loginSchema,
    GET_USER: userSchema.getDataSchema,
    CREATE_USER: userSchema.createDataSchema,
    UPDATE_USER: userSchema.updateDataSchema,
    DELETE_USER: userSchema.deleteDataSchema,
    GET_ROLE: roleSchema.getDataSchema,
    CREATE_ROLE: roleSchema.createDataSchema,
    UPDATE_ROLE: roleSchema.updateDataSchema,
    DELETE_ROLE: roleSchema.deleteDataSchema,
    GET_ROLEMENU: roleMenuSchema.getDataSchema,
    CREATE_ROLEMENU: roleMenuSchema.createDataSchema,
    UPDATE_ROLEMENU: roleMenuSchema.updateDataSchema,
    DELETE_ROLEMENU: roleMenuSchema.deleteDataSchema,
    GET_USERROLE: userRoleSchema.getDataSchema,
    CREATE_USERROLE: userRoleSchema.createDataSchema,
    UPDATE_USERROLE: userRoleSchema.updateDataSchema,
    DELETE_USERROLE: userRoleSchema.deleteDataSchema,
    GET_MENU: menuSchema.getDataSchema,
    CREATE_MENU: menuSchema.createDataSchema,
    UPDATE_MENU: menuSchema.updateDataSchema,
    DELETE_MENU: menuSchema.deleteDataSchema,
};