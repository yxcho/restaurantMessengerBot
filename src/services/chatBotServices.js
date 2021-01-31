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
          body = JSON.parse(body);
          let username = `${body.first_name}`;
          resolve(username);
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

let sendResponseWelcomeNewCustomer = function (username, sender_psid) {
  return new Promise(async function (resolve, reject) {
    let first_response = { text: `Welcome ${username} to Juicy Restaurant!` };
    let second_response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Juicy restaurant",
              subtitle: "Check out our menu",
              image_url: "https://bit.ly/imageToSend",
              buttons: [
                {
                  type: "postback",
                  title: "Main menu",
                  payload: "MENU",
                },
              ],
            },
          ],
        },
      },
    };

    // send a welcome message
    await sendMessage(sender_psid, first_response);
    await sendMessage(sender_psid, second_response);
  });
};

let sendMessage = function (sender_id, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v9.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

module.exports = {
  getFacebookUsername: getFacebookUsername,
  sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
};
