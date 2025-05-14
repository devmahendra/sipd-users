const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const roleController = require("../controllers/roleController");
const roleMenuController = require("../controllers/roleMenuController");
const userRoleController = require("../controllers/userRoleController");
const menuController = require("../controllers/menuController");
const approvalController = require("../controllers/approvalController");

module.exports = {
    LOGIN: authController.login,
    GET_USER: userController.getData,
    CREATE_USER: userController.insertData,
    UPDATE_USER: userController.updateData,
    DELETE_USER: userController.deleteData,
    GET_ROLE: roleController.getData,
    CREATE_ROLE: roleController.insertData,
    UPDATE_ROLE: roleController.updateData,
    DELETE_ROLE: roleController.deleteData,
    GET_ROLEMENU: roleMenuController.getData,
    CREATE_ROLEMENU: roleMenuController.insertData,
    UPDATE_ROLEMENU: roleMenuController.updateData,
    DELETE_ROLEMENU: roleMenuController.deleteData,
    GET_USERROLE: userRoleController.getData,
    CREATE_USERROLE: userRoleController.insertData,
    UPDATE_USERROLE: userRoleController.updateData,
    DELETE_USERROLE: userRoleController.deleteData,
    GET_MENU: menuController.getData,
    CREATE_MENU: menuController.insertData,
    UPDATE_MENU: menuController.updateData,
    DELETE_MENU: menuController.deleteData,
    GET_APPROVAL: approvalController.getData,
    APPROVAL: approvalController.approveData,
};