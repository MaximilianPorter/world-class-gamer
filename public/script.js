const API_KEY = `7AE1DDAD7927C83EF0B9882528496E56`;
const ACCESS_TOKEN = `6f33493f823b8d7490a72ebb7394cf71`;
const PROFILE_ID = `76561198091780294`;

// enable cors-anywhere automatically
// instead of going to the url and clicking 'request temporary access to the demo server'
(function () {
  var cors_api_host = "cors-anywhere.herokuapp.com";
  var cors_api_url = "https://" + cors_api_host + "/";
  var slice = [].slice;
  var origin = window.location.protocol + "//" + window.location.host;
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    if (
      targetOrigin &&
      targetOrigin[0].toLowerCase() !== origin &&
      targetOrigin[1] !== cors_api_host
    ) {
      args[1] = cors_api_url + args[1];
    }
    return open.apply(this, args);
  };
})();

const btnRequestData = document.querySelector(".btn-request-data");

// steam api docs: https://developer.valvesoftware.com/wiki/Steam_Web_API#
// get app Ids from https://steamdb.info/apps/
const gameId_rocketLeague = 252950;

const playerSummary = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${PROFILE_ID}`;
const playerFriendList = `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${API_KEY}&steamid=${PROFILE_ID}&relationship=friend`;
const playerOwnedGames = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${PROFILE_ID}&format=json`;
const playerStatsForGame = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${gameId_rocketLeague}&key=${API_KEY}&steamid=${PROFILE_ID}`;
const playerRecentGames = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${PROFILE_ID}&format=json`;

const ownedGames = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?access_token=${ACCESS_TOKEN}&steamid=${PROFILE_ID}&include_appinfo=true&include_extended_appinfo=true`;

btnRequestData.addEventListener("click", () => {
  requestData();
});

function requestData() {
  Promise.all([
    // getData(playerSummary, "key player summary: "),
    getData(
      `https://api.steampowered.com/IPlayerService/SetProfileTheme/v1/?key=${API_KEY}&theme=1`,
      "other: "
    ),
  ]).then((data) =>
    data.forEach((call) => console.log(call.msgHeader, call.data))
  );
  // Promise.all([
  //   getData(playerSummary, "Summary: "),
  //   getData(playerFriendList, "Friends List: "),
  //   getData(playerOwnedGames, "Games: "),
  //   getData(playerStatsForGame, "Stats for RL: "),
  //   getData(playerRecentGames, "Recent Games: "),
  // ]).then((data) => {
  //   data.forEach((call) => console.log(call.msgHeader, call.data))
  // });
}

async function getData(url, msgHeader) {
  try {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
      headers: {
        Origin: window.location.origin,
      },
    });
    const data = await response.json();
    // console.log(msgHeader, data);
    return { data, msgHeader };
  } catch (error) {
    console.error(`❌❌❌SOME ERROR HAPPENED: ${error}`);
  }
}
