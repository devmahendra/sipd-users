const express = require("express");
const router = express.Router();
const routeConfigs = require("./routeConfig");
const validateRequest = require("../middlewares/validateRequest")(routeConfigs);
const getRequestToken = require("../middlewares/getToken"); 

routeConfigs.forEach((route) => {
  const middlewares = [(req, res, next) => {
    req.routeConfig = route;
    next();
  }]; 

  if (route.protected) {
    middlewares.push(getRequestToken);
  }

  middlewares.push(validateRequest)

  router[route.method.toLowerCase()](route.path, ...middlewares, route.handler);
});

module.exports = router;
