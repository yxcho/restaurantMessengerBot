import request from "request";
import homepageServices from "../services/homepageServices"
require("dotenv").config();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};

let getFacebookUserProfile = (req, res) => {
  return res.render("profile.ejs");
};

let setUpUserFacebookProfile = async (req, res) => {
  // let data = {
  //   get_started: {
  //     payload: "GET_STARTED",
  //   },
  //   persistent_menu: [
  //     {
  //       locale: "default",
  //       composer_input_disabled: false,
  //       call_to_actions: [
  //         {
  //           type: "postback",
  //           title: "Talk to an agent",
  //           payload: "CARE_HELP",
  //         },
  //         {
  //           type: "postback",
  //           title: "Outfit suggestions",
  //           payload: "CURATION",
  //         },
  //         {
  //           type: "web_url",
  //           title: "Shop now",
  //           url: "https://www.originalcoastclothing.com/",
  //           webview_height_ratio: "full",
  //         },
  //       ],
  //     },
  //   ],
  //   whitelisted_domains: ["https://messenger-chatbot-yx.herokuapp.com"],
  // };

  // // Send the HTTP request to the Messenger Platform
  // request(
  //   {
  //     uri: `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
  //     method: "POST",
  //     json: data,
  //   },
  //   function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       // Print out the response body
  //       res.send(body);
  //     } else {
  //       // TODO: Handle errors
  //       res.send(body);
  //     }
  //   }
  // );
  try {
    await homepageServices.setUpUserFacebookProfile(PAGE_ACCESS_TOKEN)
    res.send(body);
  } catch (e) {
    res.send(e);
  }
};

module.exports = {
  getHomePage: getHomePage, //exporting an object instead of just a function
  getFacebookUserProfile: getFacebookUserProfile,
  setUpUserFacebookProfile: setUpUserFacebookProfile,
};
