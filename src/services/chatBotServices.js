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
    try {
      let first_response = { text: `Welcome ${username} to Juicy Restaurant!` };
      let second_response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Juicy restaurant",
                subtitle: "Best restaurant in Penang by a legendary chef",
                image_url: "https://bit.ly/imageToSend",
                buttons: [
                  {
                    type: "postback",
                    title: "Show me more",
                    payload: "MAIN_MENU",
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
      resolve("DONE");
    } catch (e) {
      reject(e);
    }
  });
};

let sendMainMenu = function (sender_psid) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Our menus",
                subtitle: "We have menus for lunch, dinner and drinks",
                image_url: "https://bit.ly/imageMenu",
                buttons: [
                  {
                    type: "postback",
                    title: "Lunch menu",
                    payload: "LUNCH_MENU",
                  },
                  {
                    type: "postback",
                    title: "Dinner menu",
                    payload: "DINNER_MENU",
                  },
                  {
                    type: "postback",
                    title: "Drinks",
                    payload: "DRINKS_MENU",
                  },
                ],
              },
              {
                title: "Opening Hours",
                subtitle:
                  "Mon to Fri - 10AM - 11PM | Sat - 5PM - 10PM | Sun - 5PM - 9PM",
                image_url: "https://bit.ly/imageOpening",
                buttons: [
                  {
                    type: "postback",
                    title: "Reserve a table",
                    payload: "RESERVE_TABLE",
                  },
                ],
              },
              {
                title: "Banquet rooms",
                subtitle: "We have venues for all occasions",
                image_url: "https://bit.ly/imageShowRooms",
                buttons: [
                  {
                    type: "postback",
                    title: "Show me around",
                    payload: "SHOW_ROOMS",
                  },
                ],
              },
            ],
          },
        },
      };

      // send a message
      await sendMessage(sender_psid, response);
    } catch (e) {
      console.log(e);
    }
  });
};

let sendLunchMenu = function (sender_psid) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Appetizers",
                image_url: "https://bit.ly/imageAppetizer",
                buttons: [
                  {
                    type: "postback",
                    title: "Appertizers",
                    payload: "SHOW_APPETIZERS",
                  },
                ],
              },
              {
                title: "Salad",
                image_url: "https://bit.ly/imageSalad",
                buttons: [
                  {
                    type: "postback",
                    title: "Salad",
                    payload: "SALAD",
                  },
                ],
              },
              {
                title: "Western food",
                image_url: "https://bit.ly/imageFish",
                buttons: [
                  {
                    type: "postback",
                    title: "Western food",
                    payload: "WESTERN",
                  },
                ],
              },
              {
                title: "Classics",
                image_url: "https://bit.ly/imageClassics",
                buttons: [
                  {
                    type: "postback",
                    title: "Classics",
                    payload: "SHOW_CLASSICS",
                  },
                ],
              },
              {
                title: "Go back",
                image_url: "https://bit.ly/imageShowRooms",
                buttons: [
                  {
                    type: "postback",
                    title: "Back to main menu",
                    payload: "BACK_TO_MAIN_MENU",
                  },
                ],
              },
            ],
          },
        },
      };

      // send a message
      await sendMessage(sender_psid, response);
    } catch (e) {
      console.log(e);
    }
  });
};

let sendDinnerMenu = function (sender_psid) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Appetizers",
                image_url: "https://bit.ly/imageAppetizer",
                buttons: [
                  {
                    type: "postback",
                    title: "Appertizers",
                    payload: "SHOW_APPETIZERS",
                  },
                ],
              },
              {
                title: "Salad",
                image_url: "https://bit.ly/imageSalad",
                buttons: [
                  {
                    type: "postback",
                    title: "Salad",
                    payload: "SALAD",
                  },
                ],
              },

              {
                title: "Go back",
                image_url: "https://bit.ly/imageShowRooms",
                buttons: [
                  {
                    type: "postback",
                    title: "Back to main menu",
                    payload: "BACK_TO_MAIN_MENU",
                  },
                ],
              },
            ],
          },
        },
      };

      // send a message
      await sendMessage(sender_psid, response);
    } catch (e) {
      console.log(e);
    }
  });
};
let sendDrinksMenu = function (sender_psid) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Appetizers",
                image_url: "https://bit.ly/imageMenu",
                buttons: [
                  {
                    type: "postback",
                    title: "Appertizers",
                    payload: "SHOW_APPETIZERS",
                  },
                ],
              },
              {
                title: "Salad",
                image_url: "https://bit.ly/imageOpening",
                buttons: [
                  {
                    type: "postback",
                    title: "Salad",
                    payload: "SALAD",
                  },
                ],
              },
              {
                title: "Western food",
                image_url: "https://bit.ly/imageShowRooms",
                buttons: [
                  {
                    type: "postback",
                    title: "Western food",
                    payload: "WESTERN",
                  },
                ],
              },
              {
                title: "Classics",
                image_url: "https://bit.ly/imageShowRooms",
                buttons: [
                  {
                    type: "postback",
                    title: "Classics",
                    payload: "SHOW_CLASSICS",
                  },
                ],
              },
              {
                title: "Go back",
                image_url: "https://bit.ly/imageShowRooms",
                buttons: [
                  {
                    type: "postback",
                    title: "Back to main menu",
                    payload: "BACK_TO_MAIN_MENU",
                  },
                ],
              },
            ],
          },
        },
      };

      // send a message
      await sendMessage(sender_psid, response);
    } catch (e) {
      console.log(e);
    }
  });
};

let sendMessage = function (sender_psid, response) {
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
  sendMainMenu: sendMainMenu,
  sendLunchMenu: sendLunchMenu,
  sendDinnerMenu: sendDinnerMenu,
  sendDrinksMenu: sendDrinksMenu,
};
