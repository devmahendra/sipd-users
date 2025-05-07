const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

module.exports = {
    LOGIN: authController.login,
    GET_USER: userController.getData,
    CREATE_USER: userController.insertData,
};