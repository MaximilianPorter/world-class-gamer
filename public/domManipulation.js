import * as receivedData from "./receivingData.js";

const cookieForm = document.querySelector(".cookies-request-form ");
// const btnRequestData = document.querySelector(".btn-request-data");
let cookiesAccepted = localStorage.getItem("cookiesAccepted");

// USER DATA
const usernameEl = document.querySelector(".my-name");
const onlineIndicatorEl = document.querySelector(".online-indicator");
const accountCreatedEl = document.querySelector(".account-created");

// TOP GAMES
const topGamesSection = document.querySelector(".section--games-list");

// COOKIES ________________________________________________________________
manageCookies();

// limited by server side calls
console.log("retrieving data...");
getData();

// btnRequestData.addEventListener("click", () => {
//   console.log("retrieving data...");
//   if (canRefreshData) getData();
// });

async function getData() {
  try {
    await receivedData.requestData();
    fillData();
  } catch (error) {
    console.error(
      `❌❌❌Error happened in domManipulation.getData(): ${error}`
    );
  }
}

function fillData() {
  console.log(receivedData.fetchedData);
  const data = receivedData.fetchedData;

  const {
    avatarfull: avatar,
    lastlogoff: lastLogoff,
    personaname: username,
    personastate: status, // 0 (offline), 1 (online), 2 (busy), 3 (away), 4 (snooze), and 5 (looking to trade), 6 (looking to play), 7 (ingame)
    profilestate: profileState,
    profileurl: profileUrl,
    realname: realName,
    steamid: steamId,
    timecreated: timeCreated,
    gameid: gameId,
    gameextrainfo: gameName,
  } = data.get("userInfo").response.players[0];

  const intlDateTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
    // timeZoneName: "short",
  });

  usernameEl.textContent = username;
  manageAccountCreated(timeCreated);
  const lastLoggedOffEnding = getSteamDates(status, lastLogoff);
  const statusText = getStatusText(status, gameName);

  onlineIndicatorEl.textContent =
    status === 0
      ? `${statusText} - last online ${lastLoggedOffEnding}`
      : statusText;

  fillTopGames(data);
}

function getSteamDates(status, lastLogoff) {
  // last online and account created

  if (status !== 0) return;

  return getTimeAgo(lastLogoff);
}

function manageAccountCreated(timeCreated) {
  const yearsAgo = (
    (Date.now() - new Date(timeCreated * 1000)) /
    1000 /
    60 /
    60 /
    24 /
    365
  ).toFixed(1);

  accountCreatedEl.textContent = `Account created ${yearsAgo} year${
    yearsAgo > 1 ? "s" : ""
  } ago.`;
}

function getStatusText(status, gameName = null) {
  onlineIndicatorEl.ariaDisabled = status === 0 ? "true" : "false";

  if (gameName) {
    return `🟢 playing ${gameName}`;
  }

  switch (status) {
    case 0:
      return "🔴 offline";
      break;
    case 1:
      return "🟢 online";
      break;
    case 2:
      return "🟡 busy";
      break;
    case 3:
      return "🟡 away";
      break;
    case 4:
      return "🟡 snooze";
      break;
    case 5:
      return "🟢 looking to trade";
      break;
    case 6:
      return "🟢 looking to play";
      break;
    default:
      return "🔴 offline";
      break;
  }
}

function fillTopGames(data) {
  // fill top games
  const topGames = data.get("topGames");
  topGamesSection.innerHTML = "";
  topGames.forEach((game) => {
    const {
      appid: gameId,
      name: gameName,
      gameInfo,
      playtime_2weeks: playtime2WeeksMinutes,
      playtime_forever: playtimeMinutes,
      img_icon_url: iconUrl,
      rtime_last_played: lastPlayed,
    } = game;

    const timePlayedHours =
      (playtimeMinutes / 60).toFixed(0) <= 0
        ? ""
        : `${(playtimeMinutes / 60).toFixed(0)} hours`;
    // const timePlayedMinutes =
    //   (playtimeMinutes % 60).toFixed(0) <= 0
    //     ? ""
    //     : `${(playtimeMinutes % 60).toFixed(0)} minutes`;

    const bgImg =
      gameId === 646570 ? gameInfo.background : gameInfo.background_raw;

    const markup = `
    <div class="game-item">
      <img
        class="game-item--bg-img"
        src="${bgImg}"
        alt="game image"
      />
      <h3 class="game-title">${gameName}</h3>
      <div class="more-game-info">
        <p class="info-game-playtime">${timePlayedHours}</p>
        <p class="info-game-last-played">Last played <strong>${getTimeAgo(
          lastPlayed
        )}</strong></p>
        <p class="info-game-description">
          ${gameInfo.short_description}
        </p>
        <a
          rel="noreferrer noopener"
          href="https://store.steampowered.com/app/${gameId}"
          class="info-game-storepage"
          target="_blank"
          >Store Page</a
        >
      </div>
    </div>
    `;
    topGamesSection.insertAdjacentHTML("beforeend", markup);
  });
}

function getTimeAgo(dateInSeconds) {
  const yearsAgo = (
    (Date.now() - new Date(dateInSeconds * 1000)) /
    1000 /
    60 /
    60 /
    24 /
    365
  ).toFixed(0);

  const daysAgo = (
    (Date.now() - new Date(dateInSeconds * 1000)) /
    1000 /
    60 /
    60 /
    24
  ).toFixed(0);

  const hoursAgo = (
    (Date.now() - new Date(dateInSeconds * 1000)) /
    1000 /
    60 /
    60
  ).toFixed(0);

  const minutesAgo = (
    (Date.now() - new Date(dateInSeconds * 1000)) /
    1000 /
    60
  ).toFixed(0);
  let agoEnding = "";

  if (yearsAgo < 1) {
    if (daysAgo < 1) {
      if (hoursAgo < 1) {
        agoEnding = `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
      } else {
        agoEnding = `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
      }
    } else {
      agoEnding = `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    }
  } else {
    agoEnding = `over ${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago`;
  }

  return agoEnding;
}

function storeData(key, value) {
  if (!cookiesAccepted) return;
  localStorage.setItem(key, value);
}

function manageCookies() {
  if (cookiesAccepted) {
    cookieForm.ariaHidden = true;
  }

  cookieForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (e.submitter.name === "accept") {
      localStorage.setItem("cookiesAccepted", true);
      cookiesAccepted = true;
    } else if (e.submitter.name === "decline") {
      // nothing really happens
    }

    cookieForm.ariaHidden = true;
  });
}
