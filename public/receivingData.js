let baseURL = "";
const location = window.location.hostname;
if (location === "localhost" || location === "127.0.0.1") {
  baseURL = "http://127.0.0.1:5001/world-class-gamer/us-central1";
} else {
  baseURL = "https://us-central1-world-class-gamer.cloudfunctions.net";
}
// start emulator command: `firebase emulators:start`

// steam api docs: https://developer.valvesoftware.com/wiki/Steam_Web_API#
// better steam api docs: https://steamapi.xpaw.me/#
// get app Ids from https://steamdb.info/apps/

const gameId_rocketLeague = 252950;
const fetchedData = new Map();

async function requestData() {
  try {
    const data = await Promise.all([
      // getData(
      //   `${gameId_rocketLeague}_gameData`,
      //   `${baseURL}/getUserGameData?gameId=${gameId_rocketLeague}`
      // ),
      getData("userInfo", `${baseURL}/getUserSummary`),
      getData("ownedGames", `${baseURL}/getOwnedGames`),
      // getData(
      //   `${gameId_rocketLeague}_gameInfo`,
      //   `${baseURL}/getGameInfo?gameId=${gameId_rocketLeague}`
      // ),
    ]);

    data.forEach((call) => {
      fetchedData.set(call.identifier, call.data);
    });

    const topGames = fetchedData
      .get("ownedGames")
      .response.games.sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 12);

    const gameData = await Promise.all(
      topGames.map((game) =>
        getData(
          `${game.appid}_gameInfo`,
          `${baseURL}/getGameInfo?gameId=${game.appid}`
        )
      )
    );
    // gameData.forEach((gameResult) => {
    //   topGames.find((game) => game.appid === gameResult.steam_appid).gameInfo =
    //     gameResult.data[game.appid].data;
    // });

    console.log(gameData);
    let i = 0;
    for (const game of topGames) {
      // get more info about game
      game.gameInfo = gameData[i].data[game.appid].data;
      i++;
    }

    fetchedData.set("topGames", topGames);
  } catch (error) {
    console.error(`❌❌❌Error happened in requestData(): ${error}`);
    throw error;
  }
}

async function getData(identifier, url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { identifier, data };
  } catch (error) {
    console.error(
      `❌❌❌ Error happened in getData(${url}, ${identifier}): ${error}`
    );
    throw error;
  }
}

export { requestData, fetchedData };
