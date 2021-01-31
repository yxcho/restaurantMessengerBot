import request from "request";
require("dotenv").config();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


let getFacebookUsername = (sender_psid) => {
  return new Promise((resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
    request(
      {
        uri: uri,
        method: "GET",
      },

      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // Print out the response body
          body = JSON.parse(body);
          let username = `${body.last_name} ${body.first_name}`;
          res.send(body);
        } else {
          // TODO: Handle errors
          res.send(error);
        }
      }
    );
  });
};

module.exports = {
  getFacebookUsername: getFacebookUsername,
};
