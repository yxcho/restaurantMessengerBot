require("dotenv").config();
import { name } from "ejs";
import request from "request";
import chatBotServices from "../services/chatBotServices";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let postWebhook = (req, res) => {
  // postwebhook receives every update from facebook
  // whenever a client sends a message to our facebook page,
  // fb will send signal to our node server telling the server to do something for the client
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = MY_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

// Handles messages events
// function handleMessage(sender_psid, received_message) {
//   let response;

//   // Check if the message contains text
//   if (received_message.text) {
//     // Create the payload for a basic text message
//     response = {
//       text: `You sent the message: "${received_message.text}". Now send me an image!`,
//     };
//   } else if (received_message.attachments) {
//     // Gets the URL of the message attachment
//     let attachment_url = received_message.attachments[0].payload.url;

//     response = {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "generic",
//           elements: [
//             {
//               title: "Is this the right picture?",
//               subtitle: "Tap a button to answer.",
//               image_url: attachment_url,
//               buttons: [
//                 {
//                   type: "postback",
//                   title: "Yes!",
//                   payload: "yes",
//                 },
//                 {
//                   type: "postback",
//                   title: "No!",
//                   payload: "no",
//                 },
//               ],
//             },
//           ],
//         },
//       },
//     };
//   }

//   // Sends the response message
//   callSendAPI(sender_psid, response);
// }

function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

let handleMessage = async function (sender_psid, message) {
  // checking quick reply
  if (message && message.quick_reply && message.quick_reply.payload) {
    if (
      message.quick_reply.payload === "QTY_ONE" ||
      message.quick_reply.payload === "QTY_TWO" ||
      message.quick_reply.payload === "QTY_FIVE"
    ) {
      //  asking about order item quantity
      await chatBotServices.sendMessageAskingPhoneNumber(sender_psid);
      return;
    }
    // payload is a phone number
    if (message.quick_reply.payload !== "") {
      // done
      await chatBotServices.sendMessageDoneReserveTable(sender_psid);
    }
    return;
  }

  // handle text message
  let entity = handleMessageWithEntities(message);

  if (entity.name === "wit$datetime:$datetime") {
    await chatBotServices.sendMessageAskingQuantity(sender_psid);
  } else if (entity.name === "wit$phone_number:phone_number") {
    await chatBotServices.sendMessageDoneReserveTable(sender_psid);
  } else {
  }
  // handle quick reply message

  // handle attachment message
  if (message && message.attachments && message.attachments[0].payload) {
    callSendAPI(sender_psid, "I like that!!!");
    callSendAPIWithTemplate(sender_psid);
    return;
  }
};

function handleMessageWithEntities(message) {
  let entityArray = [
    "wit$datetime:$datetime",
    "wit$phone_number:phone_number",
    "wit$greetings",
  ];
  let entityChosen = "";
  let data = {}; // object saving value and name of the entity chosen
  entityArray.forEach((name) => {
    let entity = firstTrait(message.nlp, name);
    if (entity && entity.confidence > 0.6) {
      entityChosen = name;

      data.value = entity.value;
    } else {
      console.log(`failed: ${entity}`);
    }
  });
  data.name = entityChosen;
  console.log(`ENTITY CHOSEN = ${entityChosen}`);
  return data;
}

// function firstEntity(nlp, name) {
//   return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
//   // return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
// }

let callSendAPIWithTemplate = (sender_psid) => {
  // document fb message template
  // https://developers.facebook.com/docs/messenger-platform/send-messages/templates
  let body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Want to build sth awesome?",
              image_url:
                "https://www.nexmo.com/wp-content/uploads/2018/10/build-bot-messages-api-768x384.png",
              subtitle: "Watch more videos on my youtube channel ^^",
              buttons: [
                {
                  type: "web_url",
                  url: "https://bit.ly/subscribe-haryphamdev",
                  title: "Watch now",
                },
              ],
            },
          ],
        },
      },
    },
  };
  request(
    {
      uri: "https://graph.facebook.com/v9.0/me/messages",
      qs: { access_token: process.env.FB_PAGE_TOKEN },
      method: "POST",
      json: body,
    },
    (err, res, body) => {
      if (!err) {
        // console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "GET_STARTED":
      // get user details
      let username = await chatBotServices.getFacebookUsername(sender_psid);
      await chatBotServices.sendResponseWelcomeNewCustomer(
        username,
        sender_psid
      );
      break;
    case "MAIN_MENU":
      await chatBotServices.sendMainMenu(sender_psid);
      break;
    case "LUNCH_MENU":
      await chatBotServices.sendLunchMenu(sender_psid);
      break;
    case "DINNER_MENU":
      await chatBotServices.sendDinnerMenu(sender_psid);
      break;
    case "DRINKS_MENU":
      await chatBotServices.sendDrinksMenu(sender_psid);
      break;
    case "SHOW_APPETIZERS":
      await chatBotServices.sendAppertizerMenu(sender_psid);
      break;
    case "BACK_TO_MAIN_MENU":
      await chatBotServices.goBackToMainMenu(sender_psid);
      break;
    case "BACK_TO_LUNCH_MENU":
      await chatBotServices.goBackToLunchMenu(sender_psid);
      break;
    case "MAKE_ORDER":
      await chatBotServices.handleMakeOrder(sender_psid);
      break;
    case "SHOW_ROOMS":
      response = { text: "Thanks!" };
      break;
    case "YES":
      response = { text: "Thanks!" };
      callSendAPI(sender_psid, response);
      break;
    case "NO":
      response = { text: "No worries!" };
      callSendAPI(sender_psid, response);
      break;

    default:
      console.log("ERROR with switch case payload");
  }
  // Send the message to acknowledge the postback
  //   callSendAPI(sender_psid, response);
};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
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
}

module.exports = {
  postWebhook: postWebhook,
  getWebhook: getWebhook,
};
