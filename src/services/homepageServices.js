import request from "request";

let setUpMessengerPlatform = function (PAGE_ACCESS_TOKEN) {
  return new Promise(async function (resolve, reject) {
    try {
      let data = {
        get_started: {
          payload: "GET_STARTED",
        },
        persistent_menu: [
          {
            locale: "default",
            composer_input_disabled: false,
            call_to_actions: [
              {
                type: "postback",
                title: "Talk to an agent",
                payload: "CARE_HELP",
              },
              {
                type: "postback",
                title: "Outfit suggestions",
                payload: "CURATION",
              },
              {
                type: "web_url",
                title: "Shop now",
                url: "https://www.originalcoastclothing.com/",
                webview_height_ratio: "full",
              },
            ],
          },
        ],
        whitelisted_domains: ["https://messenger-chatbot-yx.herokuapp.com"],
      };

      // Send the HTTP request to the Messenger Platform
      request(
        {
          uri: `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
          method: "POST",
          json: data,
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // Print out the response body
            // res.send(body);
            resolve("setup done!");
          } else {
            // TODO: Handle errors
            // res.send(body);
            reject(error);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

module.exports -
  {
    setUpMessengerPlatform: setUpMessengerPlatform,
  };
