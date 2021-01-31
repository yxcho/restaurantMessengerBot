import request from "request";
require("dotenv").config();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getFacebookUsername = function (sender_psid) {
  return new Promise(function (resolve, reject) {
    // Send the HTTP request to the Messenger Platform
    let url = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
    request(
      {
        uri: url,
        method: "GET",
      },

      function (err, res, body) {
        if (!err) {
        //   console.log(body);
        //   resolve(JSON.parse(body));
          body = JSON.parse(body)
          let username = `${body.last_name}, ${body.first_name}`
          resolve(username)
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

module.exports = {
  getFacebookUsername: getFacebookUsername,
};
