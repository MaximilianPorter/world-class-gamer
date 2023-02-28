let baseURL = "";
const location = window.location.hostname;
if (location === "localhost" || location === "127.0.0.1") {
  baseURL = "http://127.0.0.1:5001/world-class-gamer/us-central1";
} else {
  baseURL = "https://us-central1-world-class-gamer.cloudfunctions.net";
}
// start emulator command: `firebase emulators:start`

const btnRequestData = document.querySelector(".btn-request-data");

// steam api docs: https://developer.valvesoftware.com/wiki/Steam_Web_API#
// better steam api docs: https://steamapi.xpaw.me/#
// get app Ids from https://steamdb.info/apps/
const gameId_rocketLeague = 252950;

// const playerSummary = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${PROFILE_ID}`;
// const playerFriendList = `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${API_KEY}&steamid=${PROFILE_ID}&relationship=friend`;
// const playerOwnedGames = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${PROFILE_ID}&format=json`;
// const playerStatsForGame = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${gameId_rocketLeague}&key=${API_KEY}&steamid=${PROFILE_ID}`;
// const playerRecentGames = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${PROFILE_ID}&format=json`;

// const ownedGames = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?access_token=${ACCESS_TOKEN}&steamid=${PROFILE_ID}&include_appinfo=true&include_extended_appinfo=true`;

btnRequestData.addEventListener("click", () => {
  requestData();
});

function requestData() {
  Promise.all([getData(`${baseURL}/getUserSummary`, "test: ")]).then((data) =>
    data.forEach((call) => console.log(call.msgHeader, call.data))
  );
}

async function getData(url, msgHeader) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { data, msgHeader };
  } catch (error) {
    console.error(`❌❌❌SOME ERROR HAPPENED: ${error}`);
  }
}
