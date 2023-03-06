const functions = require("firebase-functions");

const API_KEY = `7AE1DDAD7927C83EF0B9882528496E56`;
const ACCESS_TOKEN = `6f33493f823b8d7490a72ebb7394cf71`;
const PROFILE_ID = `76561198091780294`;

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5001",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5001",
  "https://world-class-gamer.web.app",
  "https://world-class-gamer.firebaseapp.com",
  "https://world-class-gamer.firebaseapp.com/",
  "https://worldclassgamer.com",
];

// deploy functions command: `firebase deploy --only "functions,hosting"`

const requestData = async function (url, req, res) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    } else {
      res.status(403).send("Origin not allowed");
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    console.error(`❌❌❌SOME ERROR HAPPENED: ${err}`);
    res.status(500).send("Error fetching data");
  }
};

// exports.test = functions.https.onRequest((req, res) => {
//   res.set("Access-Control-Allow-Origin", "*"); // allow all origins
//   res.status(200).json({
//     test: "test",
//   });
// });

exports.getPlayerCountForGame = functions.https.onRequest((req, res) => {
  const gameId = req.query.gameId;

  requestData(
    `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/key=${API_KEY}&appid=${gameId}`,
    req,
    res
  );
});

exports.getGameInfo = functions.https.onRequest((req, res) => {
  const gameId = req.query.gameId;

  requestData(
    `https://store.steampowered.com/api/appdetails?appids=${gameId}&key=${API_KEY}`,
    req,
    res
  );
});

// just achievment stuff
exports.getUserGameData = functions.https.onRequest((req, res) => {
  const gameId = req.query.gameId;

  requestData(
    `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${gameId}&key=${API_KEY}&steamid=${PROFILE_ID}`,
    req,
    res
  );
});

exports.getUserSummary = functions.https.onRequest((req, res) => {
  requestData(
    `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${PROFILE_ID}`,
    req,
    res
  );
});

exports.getUserBackgroundImg = functions.https.onRequest((req, res) => {
  requestData(
    `https://api.steampowered.com/IPlayerService/GetProfileBackground/v1/?key=${API_KEY}&steamid=${PROFILE_ID}`,
    req,
    res
  );
});

exports.getUserFriends = functions.https.onRequest((req, res) => {
  requestData(
    `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${API_KEY}&steamid=${PROFILE_ID}`,
    req,
    res
  );
});

exports.getOwnedGames = functions.https.onRequest((req, res) => {
  requestData(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${API_KEY}&steamid=${PROFILE_ID}&include_appinfo=true&include_extended_appinfo=true`,
    req,
    res
  );
});

exports.getRecentGames = functions.https.onRequest((req, res) => {
  requestData(
    `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${PROFILE_ID}&format=json`,
    req,
    res
  );
});

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
