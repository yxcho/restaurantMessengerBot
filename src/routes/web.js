import express from "express";
import homepageController from "../controllers/homepageController.js";
import chatbotController from "../controllers/chatbotController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homepageController.getHomePage);
  router.get("/webhook", chatbotController.getWebhook); // to verify the facebook webhook
  router.post("/webhook", chatbotController.postWebhook); // to communicate with fb server
  return app.use("/", router);
};

module.exports = initWebRoutes;
