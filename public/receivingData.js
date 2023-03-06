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
const fetchedData = new Map();

btnRequestData.addEventListener("click", () => {
  requestData();
});

function requestData() {
  Promise.all([
    getData(
      `${baseURL}/getUserGameData?gameId=${gameId_rocketLeague}`,
      "rocket league data: "
    ),
  ])
    .then((data) => {
      data.forEach((call) => {
        fetchedData.set(call.identifier, call.data);
      });
      console.log(fetchedData);
    })
    .catch((error) =>
      console.error(`❌❌❌Error happened in requestData(): ${error}`)
    );
}

async function getData(url, identifier) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { data, identifier };
  } catch (error) {
    throw error;
    console.error(
      `❌❌❌Error happened in getData(${url}, ${identifier}): ${error}`
    );
  }
}

export default { fetchedData };
