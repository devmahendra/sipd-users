const controller = require("../controllers/controller");
const schema = require("../schemas/schema");

const routeConfigs = [
  {
    id: "50",
    name: "login",
    path: "/v1.0/users/login",
    method: "POST",
    description: "Login User",
    handler: controller.login,
    validation: schema.loginSchema,
    protected: false,
  }
];

module.exports = routeConfigs;