const express = require("express");
const router = express.Router();
const getRouteConfigs = require("../middlewares/getRoute");
const getToken = require("../middlewares/getToken");
const validateRequest = require("../middlewares/validateRequest");
const handlerMap = require("./routeHandler");
const validationMap = require("./routeValidation");

module.exports = async function initializeRoutes(app) {
  const routeConfigsObj = await getRouteConfigs(); 
  const routeConfigs = Object.values(routeConfigsObj);

  routeConfigs.forEach((route) => {
    const middlewares = [
      (req, res, next) => {
        req.routeConfig = route;
        req.routeId = route.id;
        req.menuId = route.menu_id
        next();
      },
    ];

    if (route.protected) {
      middlewares.push(getToken);
    }

    if (validationMap[route.name]) {
      middlewares.push(validateRequest(routeConfigs)); 
    }

    const handler = handlerMap[route.name];
    if (!handler) {
      console.warn(`No handler for route ${route.name}`);
      return;
    }

    router[route.method.toLowerCase()](route.path, ...middlewares, handler);
  });

  app.use("/api", router);
};

