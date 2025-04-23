const express = require("express");
const router = express.Router();
const routeConfigs = require("./routeConfig");
const validateRequest = require("../middlewares/validateRequest")(routeConfigs); 

routeConfigs.forEach((route) => {
  const middlewares = [(req, res, next) => {
    req.routeConfig = route;
    next();
  }]; 

  middlewares.push(validateRequest)

  router[route.method.toLowerCase()](route.path, ...middlewares, route.handler);
});

module.exports = router;
