const userController = require("../controllers/userController");
const userSchema = require("../schemas/userSchema");

const routeConfigs = [
  {
    id: "10",
    name: "login",
    path: "/v1.0/users/login",
    method: "POST",
    description: "Login User",
    handler: userController.login,
    validation: userSchema.loginSchema,
    protected: false,
  }
];

module.exports = routeConfigs;