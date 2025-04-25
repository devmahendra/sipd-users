const userController = require("../controllers/userController");

module.exports = {
    login: userController.login,
    get_user: userController.getData,
};