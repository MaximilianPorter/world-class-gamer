const functions = require("firebase-functions");

const API_KEY = `7AE1DDAD7927C83EF0B9882528496E56`;
const ACCESS_TOKEN = `6f33493f823b8d7490a72ebb7394cf71`;
const PROFILE_ID = `76561198091780294`;

// deploy functions command: `firebase deploy --only "functions,hosting"`

const requestData = async function (req, res) {
  try {
    const response = await fetch(this);
    const data = await response.json();
    res.set("Access-Control-Allow-Origin", "*"); // allow all origins
    res.status(200).json(data);
  } catch (err) {
    console.error(`❌❌❌SOME ERROR HAPPENED: ${err}`);
    res.status(500).send("Error fetching data");
  }
};

exports.test = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*"); // allow all origins
  res.status(200).json({
    test: "test",
  });
});

exports.getUserSummary = functions.https.onRequest(
  requestData.bind(
    `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${PROFILE_ID}`
  )
);

// exports.bigben = functions.https.onRequest((req, res) => {
//   const hours = (new Date().getHours() % 12) + 1; // London is UTC + 1hr;
//   res.status(200).send(`<!doctype html>
//     <head>
//       <title>Time</title>
//     </head>
//     <body>
//       ${"BONG ".repeat(hours)}
//     </body>
//   </html>`);
// });
