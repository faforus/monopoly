"use strict";
// import "core-js/stable";
// import "regenerator-runtime/runtime";

// switch cases
// add favicon
// USE THE HASH LOADING FOR BUTTONS?
// PUBLISHER SUBSCRIBER

// OPTIONS
const sidesOfDie = 4; // Do not increase to more than 4 -- // lap logic implemented only for up to 2x4 side die
const timesPenalty = 1;
let cheat = false;
let dieCheat = 1;
// OPTIONS
const log = document.getElementById("log");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const modal = document.querySelector(".popups");
const overlay = document.querySelector(".overlay");
const popupMsg = document.querySelector(".popupmsg");
const yes = document.querySelector(".yes");
const no = document.querySelector(".no");
const map = document.getElementById("map");
const buyPopup = document.querySelector(".buyPopup");
const buyPopupTxt = document.querySelector(".buyPopupTxt");
const btnSell = document.getElementById("sell");
const btnNoSell = document.getElementById("noSell");
const buyButtonIctive = document.querySelector(".buyButtonIctive");
const moneyInput = document.querySelector(".moneyInput");
const buyPopupError = document.querySelector(".buyPopupError");
const selectElement = document.querySelector(".property-select");
const dieTable = document.getElementById("dieTable");
const suspendPopup = document.querySelector(".suspendPopup");
const suspendPopupTxt = document.querySelector(".suspendPopupTxt");
const selectSuspendElement = document.querySelector(".suspend-property-select");
const btnNoSuspend = document.getElementById("noSuspend");
const btnSuspend = document.getElementById("suspend");
const housesPopup = document.querySelector(".houses");
const btnLeft = document.querySelector(".left");
const btnRight = document.querySelector(".right");
const housestxt = document.querySelector(".housestxt");
const btnDeath = document.getElementById("death");
const housesError = document.querySelector(".houseserror");

// global variables state
const state = {
  fieldSize: 16, // how many fields does the game have
  players: [], // will be filled with players object from collect names function
  currentPlayer: 0, // define whose turn it is
  tempPosition: 0, // players position before roll
  tempMovementPosition: 0, // players position after roll
  tempPosInArray: 0, // players position in players array
  currentRoll: 0, //
  winner: null,
  roll1: 0,
  roll2: 0,
  prisonRoll: 0, // if you rolled the same number twice the count goes up, at 2 you go to prison
  postponedMSG: 0, // no postponed msg when player is making an action
  pendingPenalty: 0, // remaining of the penalty when player is selling streets to survive
  pendingPnltyBenefactor: null, // Person who is owned the money
  availableForTrade: [], // used for listing props for trade
  filtered: [], // used for listing filtered props for trade
  bank: false, // if player cannot afford the penalty which is not paid to a player but to a bank
  chairman: false, // similar to above but if chairman chance card
  // Empty messages
  soldMsg: "",
  communityMsg: "",
  postponedMovementMSG: "",
  propertyPenaltyMsgGood: "",
  prisonMsg: "",
  propertyPenaltyMsgBad: "",
  welcomeHomeMsg: "",
  startMoneyMsg: "",
  deathMsg: "",
  releasedPropertiesMsg: "",
  prsnRollMsg: "",
  // Community shuffle
  generatedNumbers: [],
};
// Define every single field in the game, certain fields contain methods which are run once the player enters the field. Fields hold information about the streets, buyout price and penalty amount
const fields = [
  {
    number: 0,
    name: "Start Field",
    occupied: [],
    owned: false,
    action: startMoney,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 1,
    name: "Old Kent Road",
    rank: 0,
    set: 1,
    total: 2,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 400,
    originalPenalty: 200 * timesPenalty,
    penalty: 200 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 2,
    name: "Whitechapel Road",
    rank: 0,
    set: 1,
    total: 2,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 450,
    originalPenalty: 225 * timesPenalty,
    penalty: 225 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 3,
    name: "Community Chest",
    occupied: [],
    ownedby: null,
    owned: false,
    action: community,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 4,
    name: "Go To Jail",
    occupied: [],
    owned: false,
    ownedby: null,
    action: goToJail,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 5,
    name: "The Angel",
    rank: 0,
    set: 2,
    total: 3,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 500,
    originalPenalty: 250 * timesPenalty,
    penalty: 250 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 6,
    name: "King's Cross",
    rank: 0,
    set: 2,
    total: 3,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 525,
    originalPenalty: 260 * timesPenalty,
    penalty: 260 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 7,
    name: "Euston Road",
    rank: 0,
    set: 2,
    total: 3,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 550,
    originalPenalty: 275 * timesPenalty,
    penalty: 275 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 8,
    name: "Free Parking",
    occupied: [],
    owned: false,
    action: function () {},
    isPlayerDead: isPlayerDead,
  },
  {
    number: 9,
    name: "Bow Street",
    rank: 0,
    set: 3,
    total: 2,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 600,
    originalPenalty: 300 * timesPenalty,
    penalty: 300 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 10,
    name: "Vine Street",
    rank: 0,
    set: 3,
    total: 2,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 650,
    originalPenalty: 325 * timesPenalty,
    penalty: 325 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 11,
    name: "Chance",
    occupied: [],
    owned: false,
    ownedby: null,
    action: community,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 12,
    name: "Prison",
    displayName: "HM Pentonville",
    occupied: [],
    owned: false,
    action: function () {},
    isPlayerDead: isPlayerDead,
  },
  {
    number: 13,
    name: "Park Lane",
    rank: 0,
    set: 4,
    total: 2,
    twinName: "Fancy Street 2",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 750,
    originalPenalty: 375 * timesPenalty,
    penalty: 375 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 14,
    name: "Mayfair",
    rank: 0,
    set: 4,
    total: 2,
    twinName: "Fancy Street 1",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 800,
    originalPenalty: 400 * timesPenalty,
    penalty: 400 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 15,
    name: "Tax Office",
    occupied: [],
    owned: false,
    ownedby: null,
    action: tax,
    isPlayerDead: isPlayerDead,
  },
];
// Generate the map on page load
updateMap();
// Generate the dice on page load
displayDie(4, "die1");
displayDie(4, "die2");
// if HTML module type
// if (module.hot) {
//   module.hot.accept();
// }

// Create and update the map
function updateMap() {
  map.innerHTML = `
    <div class="row">
      ${updateFields(0, "Start", "notastreet")}
      ${updateFields(1, "Old Kent Road", "slumst")}
      ${updateFields(2, "Whitechapel Road", "slumst")}
      ${updateFields(3, "Community Chest", "notastreet")}
      ${updateFields(4, "Go To Jail", "notastreet")}
    </div>

    <div class="row">
      ${updateFields(15, "Tax Office", "notastreet")}
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></p></div>
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></div>
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></p></div>
      ${updateFields(5, "The Angel", "poorst")}
    </div>

    <div class="row">
      ${updateFields(14, "Mayfair", "fancyst")}
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></div>
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></div>
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></div>
      ${updateFields(6, "King's Cross", "poorst")}
    </div>

    <div class="row">
     ${updateFields(13, "Park Lane", "fancyst")}
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></p></div>
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></p></div>
      <div id="fielddivempty" class="emptyfield">
      <p class="field-name"></p></div>
      ${updateFields(7, "Euston Road", "poorst")}
  </div>

    <div class="row">
      ${updateFields(12, "HM Pentonville", "notastreet")}
      ${updateFields(11, "Chance", "notastreet")}
      ${updateFields(10, "Vine Street", "regularst")}
      ${updateFields(9, "Bow Street", "regularst")}
      ${updateFields(8, "Free Parking", "notastreet")}
    </div>`;
}
// Update street and non street fields
function updateFields(fieldNum, fieldName, fieldStyle) {
  return `
  <div id="fielddiv" class="field-${fieldNum}">
    <p class="field-name">${fieldName}</p>
      <div class="pawnzone">
        <ul class="field-player">
        ${fields[fieldNum].occupied
          .map(
            (player) => `
          <li>${player}</li>`
          )
          .join("")}
        </ul>
      </div>
      
${
  fieldStyle === "notastreet"
    ? ""
    : `${`<div class="${
        fields[fieldNum].suspended ? `redsus` : `${fieldStyle} allStreets`
      }">
<p class="fieldinfoprice">Buyout: <b>$${
        fields[fieldNum].buyoutPrice
      }</b>, Penalty: <b>$${Math.floor(fields[fieldNum].penalty)}</b></p>
</div>
${
  fields[fieldNum].owned
    ? `<div class="ownedby"><p class="little">Owned by: ${
        fields[fieldNum].ownedby
      } ${
        fields[fieldNum].rank > 0 ? `Rank ${fields[fieldNum].rank}` : ""
      }</p></div>`
    : ""
}`}`
}
 </div>`;
}
// Collect player names and run startGame function with those names as arguments
function collectNames() {
  let names = [];
  let playerNumber = 1;
  // names need to meet certain criteria
  while (names.length < 4 && true) {
    let name = prompt(
      `Player ${playerNumber} enter a name (3 up to 10 characters, one digit only, no special characters or duplicate names).`
    );
    if (name && name.match(/^[\w ]{3,10}$/) && name.match(/^\D*\d?\D*$/)) {
      let lowerCaseName = name.toLowerCase();
      if (!names.map((n) => n.toLowerCase()).includes(lowerCaseName)) {
        names.push(name);
        playerNumber++;
      } else {
        alert("That name is already taken. Please enter a different name.");
      }
    } else if (!name) {
      break;
    } else {
      alert(
        "Please enter a valid name (3 up to 10 characters, one digit only, no special characters)."
      );
    }
  }

  startGame(...names);
}
// Name players and update players array, update player money, update fields array
function startGame(...args) {
  for (let i = 0; i < args.length; i++) {
    state.players.push({
      name: args[i],
      position: 0,
      money: 2000,
      prison: 0,
      properties: [],
    });
    // push state.players onto the START field
    fields[0].occupied.push(args[i]);
  }
  updatePlayerInfo();
  updateMap();
  return state.players;
}
// Start the game and collect up to 4 names
btn1.addEventListener("click", function () {
  collectNames();
  btn1.style.display = "none";
});
// Roll the dice button
dieTable.addEventListener("click", function () {
  btn1.style.display === "none" &&
    btnDeath.classList.contains("hidden") &&
    buyPopup.classList.contains("hidden") &&
    modal.classList.contains("hidden") &&
    !state.winner &&
    movePlayer();
});
// Roll the dice with r button
document.addEventListener("keydown", function (e) {
  e.key === "r" &&
    btn1.style.display === "none" &&
    btnDeath.classList.contains("hidden") &&
    buyPopup.classList.contains("hidden") &&
    modal.classList.contains("hidden") &&
    !state.winner &&
    movePlayer();
});
//
// Move player
async function movePlayer() {
  // reset certain values
  state.bank = false;
  state.chairman = false;
  log.scrollTop = 0;
  // return on state.winner
  if (state.winner) return;
  // get current position of a player
  state.tempPosition = state.players[state.currentPlayer].position;
  // roll the dice
  state.currentRoll = rollTwoDice();
  // if you rolled doubles on second roll PRISON TIME
  try {
    thirdDoubles();
  } catch {
    return;
  }
  // Find current player in the fields field occupied array
  state.tempPosInArray = fields[state.tempPosition].occupied.indexOf(
    state.players[state.currentPlayer].name
  );
  // Remove that player
  fields[state.tempPosition].occupied.splice(state.tempPosInArray, 1); // remove that player
  // generate log message for  player movement, do not display yet
  state.postponedMovementMSG = `<b>${
    state.players[state.currentPlayer].name
  }</b> rolled <b>${state.currentRoll}</b> and moved from <b>${
    fields[state.tempPosition].name
  }</b> to <b>${
    fields[
      state.tempPosition + state.currentRoll >= state.fieldSize
        ? state.tempPosition + state.currentRoll - state.fieldSize
        : state.tempPosition + state.currentRoll
    ].name
  }</b>.`;
  // if you reached the start
  if (state.tempPosition + state.currentRoll >= state.fieldSize) {
    // insert that player to the new field
    fields[
      state.tempPosition + state.currentRoll - state.fieldSize
    ].occupied.push(state.players[state.currentPlayer].name);
    // determine position for other actions
    state.tempMovementPosition =
      state.tempPosition + state.currentRoll - state.fieldSize;
    state.players[state.currentPlayer].position = state.tempMovementPosition; // update player position
    // run the field action + check if player is dead (dead = lost the game)
    await fields[0].action();
    await fields[0].isPlayerDead();
    if (state.tempPosition + state.currentRoll - state.fieldSize !== 0) {
      await fields[state.tempMovementPosition].action();
      await fields[state.tempMovementPosition].isPlayerDead();
    }
  } else {
    //if you have not reached the start
    state.tempMovementPosition = state.tempPosition + state.currentRoll;
    fields[state.tempMovementPosition].occupied.push(
      state.players[state.currentPlayer].name
    ); // insert that player
    state.players[state.currentPlayer].position = state.tempMovementPosition; // update player position
    await fields[state.tempMovementPosition].action(); // run a field specific function
    await fields[state.tempMovementPosition].isPlayerDead();
  }
  // LOG MESSAGES
  logUpdatePlayerMessages();
  updateMap();
  determineWinner();
  // If you rolled doubles on your first roll
  try {
    firstDoublesNSecond();
  } catch {
    return;
  }
  //update current player
  updateNextPlayer();
  updatePlayerInfo();
  whoseTurn();
}
// log move player messages
function logUpdatePlayerMessages() {
  updateLog(state.releasedPropertiesMsg, "tomato");
  state.releasedPropertiesMsg = "";
  updateLog(state.deathMsg, "violet");
  state.deathMsg = "";
  updateLog(state.prisonMsg, "tomato");
  state.prisonMsg = "";
  // these logs will be displayed straight away if the player is making a decision - buy property
  if (!state.postponedMSG) {
    updateLog(state.communityMsg, "orange");
    updateLog(state.propertyPenaltyMsgBad, "tomato");
    updateLog(state.propertyPenaltyMsgGood, "lightgreen");
    updateLog(state.welcomeHomeMsg, "lightgreen");
    updateLog(state.startMoneyMsg, "lightgreen");
    updateLog(state.postponedMovementMSG, "lightgray");
  }
  // reset the messeges
  state.postponedMSG = 0;
  state.communityMsg = "";
  state.propertyPenaltyMsgGood = "";
  state.postponedMovementMSG = "";
  state.propertyPenaltyMsgBad = "";
  state.startMoneyMsg = "";
  state.welcomeHomeMsg = "";
}
// Update current player + skip losers and prison
function updateNextPlayer() {
  if (state.currentPlayer === state.players.length - 1) {
    state.currentPlayer = 0;
  } else {
    state.currentPlayer++;
  }
  // no turn for dead or jailed state.players
  while (
    state.players[state.currentPlayer].money < 0 ||
    state.players[state.currentPlayer].prison > 0
  ) {
    skipTurn();
  }
}
// If you rolled doubles on your first roll
function firstDoublesNSecond() {
  if (
    state.roll1 === state.roll2 &&
    state.prisonRoll < 2 &&
    state.players[state.currentPlayer].money >= 0
  ) {
    // if you just went to prison through community chest action
    if (state.players[state.currentPlayer].prison !== 0) {
      //update current player
      updateNextPlayer();
      updatePlayerInfo();
      throw new Error("stop");
    } else {
      state.prisonRoll++;
      state.prsnRollMsg = `<b>${
        state.players[state.currentPlayer].name
      }</b> you rolled doubles, you get to <b>roll again</b>.`;
      updateLog(state.prsnRollMsg, "lightgreen");
      state.prsnRollMsg = "";
      updatePlayerInfo();
      throw new Error();
    }
  } else {
    state.prisonRoll = 0;
  }
  updateLog(state.prsnRollMsg, "lightgreen");
  state.prsnRollMsg = "";
}
// if you rolled doubles on second roll PRISON TIME
function thirdDoubles() {
  if (
    state.roll1 === state.roll2 &&
    state.prisonRoll === 2 &&
    state.players[state.currentPlayer].money >= 0
  ) {
    // get out of jail card
    if (state.players[state.currentPlayer].bribe) {
      state.players[state.currentPlayer].bribe = false;
      updateLog(
        `<b>${
          state.players[state.currentPlayer].name
        }</b> used <b>GET OUT OF JAIL CARD</b>.`,
        "orange"
      );
      return;
    }
    // go to prison
    state.players[state.currentPlayer].prison = 1;
    fields[state.tempMovementPosition].occupied.pop();
    fields[12].occupied.push(state.players[state.currentPlayer].name); // insert that player
    state.players[state.currentPlayer].position = 12; // update player position
    state.prsnRollMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b>, you rolled doubles again. You were caught speeding and you are going to jail for 2 turns!`;
    state.prisonRoll = 0;
    //update current player
    updateNextPlayer();
    updateMap();
    updatePlayerInfo();
    updateLog(state.prsnRollMsg, "tomato");
    state.prsnRollMsg = "";
    whoseTurn();
    throw new Error();
  }
}
// Roll 2 dice - run by another function
function rollTwoDice() {
  if (cheat) return dieCheat;

  state.roll1 = Math.floor(Math.random() * sidesOfDie) + 1;
  state.roll2 = Math.floor(Math.random() * sidesOfDie) + 1;
  let rollSum = state.roll1 + state.roll2;

  // display the dice function
  displayDie(state.roll1, "die1");
  displayDie(state.roll2, "die2");
  return rollSum;
}
// Display dice based on a case
function displayDie(num, dieDiv) {
  let die = document.getElementById(dieDiv);

  switch (num) {
    case 1:
      die.innerHTML = `
      <div class="dot" style="left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
      `;
      break;
    case 2:
      die.innerHTML = `
        <div class="dot"></div>
        <div class="dot" style="right: 0; bottom: 0;"></div>
      `;
      break;
    case 3:
      die.innerHTML = `
        <div class="dot"></div>
        <div class="dot" style="right: 0; bottom: 0;"></div>
        <div class="dot" style="left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
      `;
      break;
    case 4:
      die.innerHTML = `
        <div class="dot"></div>
        <div class="dot" style="right: 0; bottom: 0;"></div>
        <div class="dot" style="right: 0; top: 0;"></div>
        <div class="dot" style="left: 0; bottom: 0;"></div>
      `;
      break;
    case 5:
      die.innerHTML = `
        <div class="dot"></div>
        <div class="dot" style="right: 0; bottom: 0;"></div>
        <div class="dot" style="right: 0; top: 0;"></div>
        <div class="dot" style="left: 0; bottom: 0;"></div>
        <div class="dot" style="left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
      `;
      break;
    case 6:
      die.innerHTML = `
        <div class="dot"></div>
        <div class="dot" style="right: 0; bottom: 0;"></div>
        <div class="dot" style="right: 0; top: 0;"></div>
        <div class="dot" style="left: 0; bottom: 0;"></div>
        <div class="dot" style="left: 0; top: 0;"></div>
        <div class="dot" style="right: 0; top: 50%; transform: translate(0, -50%);"></div>
        <div class="dot" style="left: 0; top: 50%; transform: translate(0, -50%);"></div>
      `;
      break;
  }
}
// Skip turn for jailed or dead players
function skipTurn() {
  // is player is dead mone < 0 or is in prison
  if (
    state.players[state.currentPlayer].money < 0 ||
    state.players[state.currentPlayer].prison > 0
  ) {
    // if is in prison display message and -1 on prison
    if (state.players[state.currentPlayer].prison) {
      state.players[state.currentPlayer].prison =
        state.players[state.currentPlayer].prison - 1;
      updateLog(
        `<b>${
          state.players[state.currentPlayer].name
        }</b>, you are still in jail. ${
          state.players[state.currentPlayer].prison > 0
            ? `Your turns are suspended.`
            : `You will be free to go on your next turn.`
        }</b>`,
        "tomato"
      );
    }
    // skip turn
    if (state.currentPlayer === state.players.length - 1) {
      state.currentPlayer = 0;
    } else {
      state.currentPlayer++;
    }
  }
}
// Update the player scoreboard and create buttons to trade streets
function updatePlayerInfo() {
  // check if an element exists, if not create it
  if (document.getElementById("player-info") === null) {
    const newDiv = document.createElement("div");
    newDiv.style = "text-align: center";
    newDiv.id = "player-info";
    document.getElementById("view-port").append(newDiv);
  }
  const scoreboard = document.getElementById("player-info");
  // create HTML + buttons along with datasets and classes
  let moreHtml = "";
  for (let i = 0; i < state.players.length; i++) {
    let html = `<h3 ${
      state.currentPlayer === state.players.indexOf(state.players[i])
        ? 'class="highlight"'
        : ""
    }>Player ${i + 1}: ${state.players[i].name}</h3>
    <p>Money: <b style="color: #333">$${Math.floor(
      state.players[i].money
    )}</b></p>`;
    if (state.players[i].properties.length > 0) {
      html += `<p>Current properties:</p><ul>`;
      for (let j = 0; j < state.players[i].properties.length; j++) {
        html += `<li>

        <button class="${
          state.players[state.currentPlayer].properties.includes(
            state.players[i].properties[j]
          )
            ? "buyButtonInactive"
            : "buyButtonActive"
        } ${state.players[i].properties[j]
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase()}" button${j} ${
          state.players[state.currentPlayer].properties.includes(
            state.players[i].properties[j]
          )
            ? ""
            : ""
        }" data-streetset="${
          fields.find((field) => field.name === state.players[i].properties[j])
            .set
        }"
        data-ranked="${
          fields.find((field) => field.name === state.players[i].properties[j])
            .rank > 0
            ? "ranked"
            : "unranked"
        }" data-suspended="${
          fields.find((field) => field.name === state.players[i].properties[j])
            .suspended
            ? "suspended"
            : "notsuspended"
        }" data-player="${i}" data-property="${
          state.players[i].properties[j]
        }">${state.players[i].properties[j]}</button>
        
        </li>`;
      }
      html += `</ul>`;
    }
    html += `${
      state.players[i].prison
        ? `<p class="red">Turns left in prison ${state.players[i].prison}</p>`
        : ""
    }`;
    html += `${
      state.players[i].money < 0 ? `<p class="purple">PLAYER HAS LOST</p>` : ""
    }`;
    moreHtml += html;
  }

  scoreboard.innerHTML = moreHtml;
  sellButtons();
}
// create event listeners for the trade street buttons along with trade options
function sellButtons() {
  let buttonsAC = document.querySelectorAll(".buyButtonActive");
  let buttonsIA = document.querySelectorAll(".buyButtonInactive");
  let buttonsSUS = document.querySelectorAll("[data-suspended='suspended']");
  // IMPS FOR WHATEVER REASON THIS ABOVE AND BELOW NEED TO STAY HERE
  btnSell.removeEventListener("click", sell.EventListener);
  btnNoSell.removeEventListener("click", btnNoSell.EventListener);
  btnNoSuspend.removeEventListener("click", noSuspend.EventListener);
  btnSuspend.removeEventListener("click", suspend.EventListener);
  // IMPS SUSPENDED BUTTONS COLOR CHANGE ONLY
  buttonsSUS.forEach((button) => {
    button.classList.toggle("redbg");
  });

  // IMPS
  // IMPS CURRENT PLAYER'S BUTTONS (UPGRADE/SUSPEND)
  buttonsIA.forEach((button) => {
    if (button.dataset.suspended !== "suspended") {
      button.classList.toggle("buttonOpacity");
    }
    button.addEventListener("click", function (event) {
      // field that is being owned
      let fieldName = event.target.dataset.property;
      let field = fields.find((field) => field.name === fieldName);
      let msg = `${state.players[state.currentPlayer].name} you can mortgage ${
        field.name
      } for $${field.buyoutPrice}`;
      toggleSuspendModal(msg);

      if (determineAllFieldOwnership(fields[field.number])) {
        housesPopup.classList.toggle("hidden");
      }

      // IMPS DOWNGRADE RANK EVENTS
      let downEvent = function () {
        if (field.rank > 0 && determinePropertyUpgrade(field, 1)) {
          field.rank -= 1;
          field.penalty -= field.originalPenalty / 4;
          state.players[state.currentPlayer].money += field.buyoutPrice / 3;
          housestxt.textContent = `Rank: ${field.rank}`;
          updateMap();
          updatePlayerInfo();
          btnSuspend.addEventListener("click", suspend.EventListener);
          btnNoSuspend.addEventListener("click", noSuspend.EventListener);
          housesError.textContent = "";
        } else {
          housesError.textContent =
            "You either cannot do that, or you need to downgrade the properties simultaneously.";
        }
      };
      // IMPS UPGRADE RANK EVENTS
      let upEvent = function () {
        if (
          state.players[state.currentPlayer].money >= field.buyoutPrice / 2 &&
          field.rank < 4 &&
          determinePropertyUpgrade(field, -1)
        ) {
          // BUG sometimes state.players can go below $0. extra protection
          if (
            state.players[state.currentPlayer].money - field.buyoutPrice / 2 <
            0
          )
            return;
          field.rank += 1;
          field.penalty += field.originalPenalty / 4;
          state.players[state.currentPlayer].money -= field.buyoutPrice / 2;
          housestxt.textContent = `Rank: ${field.rank}`;
          updateMap();
          updatePlayerInfo();
          btnSuspend.addEventListener("click", suspend.EventListener);
          btnNoSuspend.addEventListener("click", noSuspend.EventListener);
          housesError.textContent = "";
        } else {
          housesError.textContent =
            "You either cannot afford that, or you need to upgrade the properties simultaneously.";
        }
      };
      // IMPS UPGRADES ONLY AVAILABLE WHEN...
      if (determineAllFieldOwnership(fields[field.number])) {
        housestxt.textContent = `Rank: ${field.rank}`;
        btnLeft.addEventListener("click", downEvent);
        btnRight.addEventListener("click", upEvent);
      }
      // IMPS UNSUSPEND
      if (
        field.suspended &&
        state.players[state.currentPlayer].money > field.buyoutPrice
      ) {
        btnSuspend.textContent = "Unmortgage";
        suspendPopupTxt.innerHTML = `${
          state.players[state.currentPlayer].name
        } you can unmortgage ${field.name} for $${field.buyoutPrice}`;
        suspend.EventListener = function () {
          btnRight.removeEventListener("click", upEvent);
          btnLeft.removeEventListener("click", downEvent);
          state.players[state.currentPlayer].money -= field.buyoutPrice;
          field.suspended = false;
          let unsuspendMsg = `${
            state.players[state.currentPlayer].name
          } unmortaged ${fieldName}.`;
          updateLog(unsuspendMsg, "lightgreen");
          // update map/info
          updateMap();
          updatePlayerInfo();
          toggleSuspendModal();
          if (!housesPopup.classList.contains("hidden")) {
            housesPopup.classList.toggle("hidden");
          }
          housesError.textContent = "";
        };
      } else if (
        field.suspended &&
        state.players[state.currentPlayer].money < field.buyoutPrice
      ) {
        toggleSuspendModal();
      } else {
        // IMPS SUSPEND
        btnSuspend.textContent = "Mortage";
        suspend.EventListener = function () {
          if (field.rank > 0) {
            housesError.textContent =
              "You cannot mortgage properties with rank other than 0.";
            return;
          }
          // make the change if can afford
          btnRight.removeEventListener("click", upEvent);
          btnLeft.removeEventListener("click", downEvent);
          state.players[state.currentPlayer].money += field.buyoutPrice;
          field.suspended = true;
          let suspendMsg = `${
            state.players[state.currentPlayer].name
          } mortgaged ${fieldName}.`;
          updateLog(suspendMsg, "tomato");
          // update map/info
          updateMap();
          updatePlayerInfo();
          toggleSuspendModal();
          if (!housesPopup.classList.contains("hidden")) {
            housesPopup.classList.toggle("hidden");
          }
          housesError.textContent = "";
        };
      }
      // IMPS ONLY SUSPEND FOR RANK 0
      if (field.rank === 0) {
        btnSuspend.addEventListener("click", suspend.EventListener);
      }
      noSuspend.EventListener = () => {
        btnRight.removeEventListener("click", upEvent);
        btnLeft.removeEventListener("click", downEvent);
        toggleSuspendModal();
        updatePlayerInfo();
        if (!housesPopup.classList.contains("hidden")) {
          housesPopup.classList.toggle("hidden");
        }
        housesError.textContent = "";
      };
      btnNoSuspend.addEventListener("click", noSuspend.EventListener);
    });
  });

  // IMPS
  // IMPS OTHER PLAYER BUTTONS (BUY)
  buttonsAC.forEach((button) => {
    let iFFieldIndex = fields.findIndex(
      (field) => field.name === button.dataset.property
    );

    if (
      // IMPS create event listeners only for properties that do not belong to the current player. Do not create event listeners for properties that have higher rank(houses) and the adjecent properties.
      button.dataset.player !== state.currentPlayer &&
      !fields[iFFieldIndex].suspended &&
      fields[iFFieldIndex].rank === 0 &&
      (fields[iFFieldIndex - 1]?.rank === 0 ||
        fields[iFFieldIndex + 1]?.rank === 0)
    ) {
      button.addEventListener("click", function (event) {
        toggleSellModal(
          `${
            state.players[state.currentPlayer].name
          }, how much do you want to pay for this property?`
        );
        // clear existing options
        selectElement.innerHTML = "<option disabled selected value></option>";
        // clear the arrays
        state.availableForTrade = [];
        state.filtered = [];
        // create objects from buttons so they can be sorted
        buttonsIA.forEach((button) => {
          if (button.dataset.suspended !== "suspended") {
            state.availableForTrade.push({
              name: button.dataset.property,
              rank: button.dataset.ranked,
              index: button.dataset.streetset,
            });
          }
        });
        state.filtered = state.availableForTrade.filter((obj) => {
          // Find all objects with the same index as the current object
          const sameIndexObjs = state.availableForTrade.filter(
            (o) => o.index === obj.index
          );
          // check if any of those objects is ranked
          const hasRanked = sameIndexObjs.some((o) => o.rank === "ranked");
          // Return if meets criteria
          return !hasRanked && obj.rank !== "ranked";
        });
        // map the objects into strings
        state.filtered = state.filtered.map((e) => e.name);
        // create new options for state.filtered streets
        state.players[state.currentPlayer]?.properties.forEach(
          (propertyName) => {
            if (state.filtered.includes(propertyName)) {
              let option = document.createElement("option");
              option.value = propertyName;
              option.text = propertyName;
              selectElement.appendChild(option);
            }
          }
        );
        // IMPS SELL BUTTON
        sell.EventListener = function () {
          // player who owns the property
          let playerIndex = event.target.dataset.player;
          let player = state.players[playerIndex];
          // field that is being owned
          let fieldName = event.target.dataset.property;
          let field = fields.find((field) => field.name === fieldName);
          // If player has enough money or selected his own street to trade
          if (
            (Number(moneyInput.value) <
              state.players[state.currentPlayer].money &&
              Number(moneyInput.value) >= field.buyoutPrice) ||
            selectElement.value
          ) {
            if (selectElement.value) {
              // Target current state.players property in player prop array to trade
              let sellerPropIndex = state.players[
                state.currentPlayer
              ].properties.indexOf(selectElement.value);
              let tradePropIndex = fields.find(
                (field) => field.name === selectElement.value
              );
              // Remove that property from state.players prop parray
              state.players[state.currentPlayer].properties.splice(
                sellerPropIndex,
                1
              );
              // push that property to new state.players prop array
              player.properties.push(selectElement.value);
              // change the owner in property field
              tradePropIndex.ownedby = player.name;
            }
            // trade money
            state.players[state.currentPlayer].money -= Number(
              moneyInput.value
            );
            player.money += Number(moneyInput.value);
            // update the owner of prop that was bought
            field.ownedby = state.players[state.currentPlayer].name;
            // push the new property into current state.players prop array
            state.players[state.currentPlayer].properties.push(field.name);
            let propIndex = player.properties.indexOf(fieldName);
            // remove that property from old owner
            player.properties.splice(propIndex, 1);
            state.soldMsg = `<b>${
              state.players[state.currentPlayer].name
            }</b> bought <b>${fieldName}</b> from <b>${
              player.name
            }</b> for <b>${
              !selectElement.value
                ? `$${moneyInput.value}`
                : `$${moneyInput.value || 0} and ${selectElement.value}`
            }</b>.`;
            moneyInput.value = "";
            updateLog(state.soldMsg, "lightgreen");
            // update map/info
            updateMap();
            updatePlayerInfo();
            toggleSellModal();
          } else {
            buyPopupError.innerHTML = `You need to be able to afford</br>the property and pay at least</br>the property's original price`;
          }
        };
        btnSell.addEventListener("click", sell.EventListener);
        // IMPS NO SELL BUTTON
        btnNoSell.EventListener = () => {
          toggleSellModal();
          updatePlayerInfo();
          moneyInput.value = "";
          buyPopupError.innerHTML = "";
        };
        btnNoSell.addEventListener("click", btnNoSell.EventListener);
      });
    }
  });
}
// Determine if player owns all field of a given set
function determineAllFieldOwnership(fieldWithIndex) {
  let filteredArray = [];
  fields.filter((field) => {
    if (field.set === fieldWithIndex.set) filteredArray.push(field);
  });
  let count = 0;
  filteredArray.forEach((field) => {
    if (
      field.ownedby !== null &&
      field.ownedby !== undefined &&
      field.ownedby === fieldWithIndex.ownedby
    ) {
      count++;
    }
  });
  return count === fieldWithIndex.total;
}
// Determine if player can upgrade or downgrade props
function determinePropertyUpgrade(fieldWithIndex, plusMinus) {
  // plusMinus +1 determinePropertyUpgrade
  // plusMinus -1 determinePropertyDowngrade
  let filteredArray = [];
  fields.filter((field) => {
    if (field.set === fieldWithIndex.set) filteredArray.push(field);
  });
  let indexToBeRemoved = filteredArray.indexOf(fieldWithIndex);
  filteredArray.splice(indexToBeRemoved, 1);
  let count = 0;
  filteredArray.forEach((field) => {
    if (
      fieldWithIndex.rank - field.rank === 0 ||
      fieldWithIndex.rank - field.rank === plusMinus
    ) {
      console.log();
      count++;
    }
  });
  return count === fieldWithIndex.total - 1;
}
// toggle the buy property or game finisehd popup
const toggleModal = function () {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};
// toggle the sell property popup
const toggleSellModal = function (msg) {
  buyPopup.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
  buyPopupTxt.innerHTML = msg;
};
// toggle the suspend property popup
const toggleSuspendModal = function (msg) {
  suspendPopup.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
  suspendPopupTxt.innerHTML = msg;
};
// Generate a popup message - buy property or game finisehd
function generatePopupMsg(msg) {
  popupMsg.innerHTML = msg;
}
// Update the game log
function updateLog(msg, bgColor) {
  if (msg === "") return;
  log.insertAdjacentHTML(
    `afterbegin`,
    `<p style="
    background-color: ${bgColor};
    padding: 15px;
    border-radius: 15px;
    ">${msg}</p>`
  );
}
// Check if the current player has negative balance and allow players to sell houses or mortgage properties to remain in the game
function isPlayerDead() {
  if (state.players[state.currentPlayer].money < 0) {
    if (state.players[state.currentPlayer].properties.length > 0) {
      return new Promise((resolve) => {
        updatePlayerInfo();
        state.postponedMSG = 1;
        btnDeath.classList.toggle("hidden");
        updateLog(
          `<b>${state.players[state.currentPlayer].name}</b>, you rolled <b>${
            state.currentRoll
          }</b> and entered <b>${this.name}</b>. You need to pay <b>${
            this.penalty
          }</b>, but cannot afford it. You are <b>${Math.floor(
            state.pendingPenalty
          )}</b> short and are about to <b>lose</b>, sell whatever you have got to stay in the game!`,
          "orangered"
        );
        const deathListener = () => {
          // if player will survive the penalty
          if (state.players[state.currentPlayer].money >= 0) {
            let count = 0;
            if (state.chairman) {
              // determine how many state.players are owed money
              state.players.forEach((e) => {
                if (
                  e === state.players[state.currentPlayer] ||
                  (e !== state.players[state.currentPlayer] && e.money < 0)
                ) {
                } else {
                  count++;
                }
              });
              // distribute the money
              state.players.forEach((e) => {
                if (
                  e === state.players[state.currentPlayer] ||
                  (e !== state.players[state.currentPlayer] && e.money < 0)
                ) {
                  // do nothign
                } else {
                  // if can afford
                  e.money += state.pendingPenalty / count;
                }
              });
            } else if (!state.bank) {
              state.pendingPnltyBenefactor.money += state.pendingPenalty;
              updateLog(
                `<b>${
                  state.players[state.currentPlayer].name
                }</b> managed to pay <b>${
                  this.ownedby
                }</b> the remaining <b>$${Math.floor(
                  state.pendingPenalty
                )}</b>.`,
                "tomato"
              );
            } else {
              updateLog(
                `<b>${
                  state.players[state.currentPlayer].name
                }</b> managed to pay <b>The state.Bank</b> the remaining <b>$${Math.floor(
                  state.pendingPenalty
                )}</b>.`,
                "tomato"
              );
            }
          } else {
            // if player will not be able to survive the penalty
            if (state.chairman) {
              // distribute the remaining money
              let count = 0;
              state.players.forEach((e) => {
                if (
                  e === state.players[state.currentPlayer] ||
                  (e !== state.players[state.currentPlayer] && e.money < 0)
                ) {
                } else {
                  count++;
                }
              });
              state.players.forEach((e) => {
                if (
                  e === state.players[state.currentPlayer] ||
                  (e !== state.players[state.currentPlayer] && e.money < 0)
                ) {
                  // do nothign
                } else {
                  // if cannot afford

                  if (
                    -state.pendingPenalty ===
                    state.players[state.currentPlayer].money
                  ) {
                    return;
                  } else {
                    let newPenalty =
                      (state.pendingPenalty +
                        state.players[state.currentPlayer].money) /
                      count;
                    e.money += newPenalty;
                  }
                }
              });
            } else if (!state.bank) {
              state.pendingPnltyBenefactor.money +=
                state.players[state.currentPlayer]?.money +
                state.pendingPenalty;
            }
            state.deathMsg = `<b>${
              state.players[state.currentPlayer].name
            }</b> lost all the money and is out of the game!`;
            releasePlayerProperties(state.players[state.currentPlayer], fields);
          }
          btnDeath.classList.toggle("hidden");
          btnDeath.removeEventListener("click", deathListener);
          resolve();
        };
        btnDeath.addEventListener("click", deathListener);
      });
    }
  }
  if (state.players[state.currentPlayer].money < 0) {
    state.deathMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b> lost all the money and is out of the game!`;
    releasePlayerProperties(state.players[state.currentPlayer], fields);
  }
}
// if player dies recirculate his properties
function releasePlayerProperties(player, fields) {
  if (player.properties.length > 0) {
    state.releasedPropertiesMsg = `These properties are available again: `;
    for (let i = 0; i < player.properties.length; i++) {
      const propertyName = player.properties[i];
      const fieldIndex = fields.findIndex(
        (field) => field.name === propertyName
      );
      fields[fieldIndex].owned = false;
      fields[fieldIndex].rank = 0;
      fields[fieldIndex].suspended = false;
      fields[fieldIndex].ownedby = null;
      fields[fieldIndex].penalty = fields[fieldIndex].originalPenalty;
      state.releasedPropertiesMsg += fields[fieldIndex].name;
      if (i !== player.properties.length - 1) {
        state.releasedPropertiesMsg += ", ";
      } else {
        state.releasedPropertiesMsg += ".";
      }
    }
  }
  state.players[state.currentPlayer].properties = [];
  // remove latest addition to the field, remove the pawn from the board
  fields[state.tempMovementPosition].occupied.pop();
  updateMap();
}
// Award money when player crosses start
function startMoney() {
  let startCash = 100;
  state.players[state.currentPlayer].money =
    state.players[state.currentPlayer].money + startCash;
  state.startMoneyMsg = `<b>${
    state.players[state.currentPlayer].name
  }</b> was awarded <b>$${startCash}</b< for crossing the start field.`;
}
// Community Chest with 3 cards/possibilities
async function community() {
  // generate number and shuffle cards
  let randomNumber = communityCardsShuffle();
  // the cards and what they do
  if (randomNumber === 1) {
    state.players[state.currentPlayer].money =
      state.players[state.currentPlayer].money + 200;
    state.communityMsg = `Congratulations <b>${
      state.players[state.currentPlayer].name
    }</b>, you won a lottery, <b>$200</b> is yours!`;
  } else if (randomNumber === 2) {
    let penalty = 200 * timesPenalty;
    state.bank = true;
    state.pendingPenalty = state.players[state.currentPlayer].money - penalty;
    state.players[state.currentPlayer].money =
      state.players[state.currentPlayer].money - penalty;
    state.communityMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b>, you were mugged and lost <b>$${penalty}</b>.`;
  } else if (randomNumber === 3) {
    // get out of jail card
    if (state.players[state.currentPlayer].bribe) {
      // get out of jail card
      state.players[state.currentPlayer].bribe = false;
      updateLog(
        `<b>${
          state.players[state.currentPlayer].name
        }</b> used <b>GET OUT OF JAIL CARD</b>.`,
        "orange"
      );
      return;
    }
    // set prison turns to 2
    state.players[state.currentPlayer].prison = 2;
    fields[state.tempMovementPosition].occupied.pop();
    fields[12].occupied.push(state.players[state.currentPlayer].name); // insert that player
    state.players[state.currentPlayer].position = 12; // update player position
    state.tempMovementPosition = 12;
    state.communityMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b>, you went through a red light. You're going to jail for 2 turns!`;
  } else if (randomNumber === 4) {
    fields[state.tempMovementPosition].occupied.pop();
    fields[14].occupied.push(state.players[state.currentPlayer].name); // insert that player
    state.players[state.currentPlayer].position = 14; // update player position
    state.tempMovementPosition = 14;
    state.communityMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b>, you took a taxi to <b>${fields[14].name}.</b>`;
    await fields[14].action(); // action
    await fields[14].isPlayerDead(); // action
  } else if (randomNumber === 5) {
    fields[state.tempMovementPosition].occupied.pop();
    fields[0].occupied.push(state.players[state.currentPlayer].name); // insert that player
    state.players[state.currentPlayer].position = 0; // update player position
    state.tempMovementPosition = 0;
    state.communityMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b>, you went straight to the start. <b>Collect your cash!</b>`;
    await fields[0].action(); // action
    await fields[0].isPlayerDead(); // action
  } else if (randomNumber === 6) {
    fields[state.tempMovementPosition].occupied.pop();
    fields[state.tempMovementPosition + 2].occupied.push(
      state.players[state.currentPlayer].name
    ); // insert that player
    state.players[state.currentPlayer].position =
      state.tempMovementPosition + 2; // update player position
    state.tempMovementPosition = state.tempMovementPosition + 2;
    state.communityMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b>, go 2 fields forward to <b>${
      fields[state.tempMovementPosition].name
    }.</b>`;
    await fields[state.tempMovementPosition].action(); // action
    await fields[state.tempMovementPosition].isPlayerDead(); // action
  } else if (randomNumber === 7) {
    state.players[state.currentPlayer].bribe = true;
    state.communityMsg = `<b>${
      state.players[state.currentPlayer].name
    }</b>, you received <b>GET OUT OF JAIL CARD</b>.`;
  } else if (randomNumber === 8) {
    state.chairman = true;
    let penalty = 100;
    // calcs amount of state.players that need to be paid
    let count = 0;
    state.players.forEach((e) => {
      if (
        e === state.players[state.currentPlayer] ||
        (e !== state.players[state.currentPlayer] && e.money < 0)
      ) {
        // do nothign
      } else {
        count++;
      }
    });
    // distribute cash
    state.players.forEach((e) => {
      if (
        e === state.players[state.currentPlayer] ||
        (e !== state.players[state.currentPlayer] && e.money < 0)
      ) {
        // do nothign
      } else {
        if (count * penalty > state.players[state.currentPlayer].money) {
          let newPenalty = state.players[state.currentPlayer].money / count;
          e.money += newPenalty;
        } else {
          e.money += penalty;
        }
      }
    });
    state.players[state.currentPlayer].money -= penalty * count;
    state.pendingPenalty = -(
      state.players[state.currentPlayer].money -
      count * state.pendingPenalty
    );
    state.communityMsg = `${
      state.players[state.currentPlayer].name
    }, you have been elected state.Chairman of the Board. Pay each player <b>$100</b>`;
  }
}
// geneerate random number for community chest/chance + shuffle cards
function communityCardsShuffle() {
  let numOfCards = 8;
  state.communityMsg = "";
  // Reset the array once all cards were used up - shuffle cards
  if (state.generatedNumbers.length === numOfCards) {
    state.generatedNumbers = [];
  }
  // Generate random number
  let randomNumber = 8;
  // Math.floor(Math.random() * numOfCards) + 1;
  // Keep generating if the card was already used
  while (state.generatedNumbers.includes(randomNumber)) {
    randomNumber = Math.floor(Math.random() * numOfCards) + 1;
  }
  // Update the array with used numbers/cards
  state.generatedNumbers.push(randomNumber);
  return randomNumber;
}
// tax field action
function tax() {
  state.bank = true;
  let tax = (state.players[state.currentPlayer].money * 15) / 100;
  state.players[state.currentPlayer].money -= tax;
  state.communityMsg = `<b>${
    state.players[state.currentPlayer].name
  }</b>, you got in trouble with HMRC. You need to pay <b>15%</b> TAX <b>$${Math.floor(
    tax
  )}.</b>`;
}
// Go to jail field action
function goToJail() {
  if (state.players[state.currentPlayer].bribe) {
    state.players[state.currentPlayer].bribe = false;
    updateLog(
      `<b>${
        state.players[state.currentPlayer].name
      }</b> used <b>GET OUT OF JAIL CARD</b>.`,
      "orange"
    );
    return;
  }
  state.players[state.currentPlayer].prison = 1;
  fields[4].occupied.pop();
  fields[12].occupied.push(state.players[state.currentPlayer].name); // insert that player
  state.players[state.currentPlayer].position = 12; // update player position
  state.tempMovementPosition = 12;
  state.communityMsg = `<b>${
    state.players[state.currentPlayer].name
  }</b>, go straight to jail for 1 turn!`;
}
// Buy the street, visit the street that you own or pay the penalty if you do not
async function streetAction() {
  updateMap();
  if (
    !this.owned &&
    state.players[state.currentPlayer].money >= this.buyoutPrice
  ) {
    updateLog(state.communityMsg, "orange");
    updateLog(state.propertyPenaltyMsgBad, "tomato");
    updateLog(state.propertyPenaltyMsgGood, "lightgreen");
    updateLog(state.welcomeHomeMsg, "lightgreen");
    updateLog(state.startMoneyMsg, "lightgreen");
    updateLog(state.postponedMovementMSG, "lightgray");
    return new Promise((resolve) => {
      // Buy this field if criteria are met
      toggleModal();
      generatePopupMsg(
        `<b>${state.players[state.currentPlayer].name}</b>, you rolled <b>${
          state.currentRoll
        }</b>, moved from <b>${fields[state.tempPosition].name}</b> to <b>${
          this.name
        }</b>. You have a chance to buy this property for <b>$${
          this.buyoutPrice
        }</b>.`
      );
      yes.eventListener = () => {
        toggleModal();
        this.owned = true;
        this.ownedby = state.players[state.currentPlayer].name;
        state.players[state.currentPlayer].money =
          state.players[state.currentPlayer].money - this.buyoutPrice;
        // new code
        state.players[state.currentPlayer].properties.push(this.name);

        updateLog(
          `<b>${state.players[state.currentPlayer].name}</b> bought <b>${
            this.name
          }</b> for <b>$${this.buyoutPrice}</b>.`,
          "lightgreen"
        );
        updatePlayerInfo();
        updateMap();
        yes.removeEventListener("click", yes.eventListener);
        no.removeEventListener("click", handleNoClick);
        state.postponedMSG = 1;
        resolve();
      };
      yes.addEventListener("click", yes.eventListener);
      function handleNoClick() {
        toggleModal();
        // Remove the event listener
        no.removeEventListener("click", handleNoClick);
        yes.removeEventListener("click", yes.eventListener);
        state.postponedMSG = 1;
        resolve();
      }
      no.addEventListener("click", handleNoClick);
    });
  } else if (
    !this.owned &&
    state.players[state.currentPlayer].money < this.buyoutPrice
  ) {
    state.propertyPenaltyMsgBad = `<b>${
      state.players[state.currentPlayer].name
    }</b> you cannot afford to buy ${this.name}.`;
  } else if (this.ownedby === state.players[state.currentPlayer].name) {
    // If you own this street and visit it
    state.welcomeHomeMsg = "Welcome home.";
    // await upgradeProperty();
    // if the street is suspended
  } else if (this.suspended) {
    state.welcomeHomeMsg = "This street has been mortaged, lucky you!.";
    // if you have to pay
  } else {
    if (!state.players.find((player) => player.name === this.ownedby)?.prison) {
      state.propertyPenaltyMsgBad = `<b>${
        state.players[state.currentPlayer].name
      }</b>, you entered <b>${this.ownedby}</b>'s property: <b>${
        this.name
      }</b>, and had to pay <b>$${Math.floor(this.penalty)}</b>.`;
      // If the player cannot afford to pay the penalty in full only take his remaining money
      if (state.players[state.currentPlayer].money < this.penalty) {
        state.pendingPnltyBenefactor = state.players.find(
          (player) => player.name === this.ownedby
        );
        state.pendingPenalty =
          this.penalty - state.players[state.currentPlayer].money;
        state.pendingPnltyBenefactor.money +=
          state.players[state.currentPlayer].money;
        state.players[state.currentPlayer].money -= this.penalty;
        updatePlayerInfo();
      } else {
        // If player can afford the penalty substract the penalty amount from his account
        state.players.find((player) => player.name === this.ownedby).money +=
          this.penalty;
        state.players[state.currentPlayer].money -= this.penalty;
      }
      // if the owner is in jail
    } else {
      state.propertyPenaltyMsgGood = `<b>${
        state.players[state.currentPlayer].name
      }</b> entered <b>${this.ownedby}</b>'s property, lucky for you <b>${
        this.ownedby
      }</b> is in prison and cannot collect payments.`;
    }
  }
}
// Check if only one player is left with money
function determineWinner() {
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].money >= 0) {
      // only state.players with money are taken into consideration
      // the first player with money becomes a temporary state.winner
      // if there is anotehr player found with money the state.winner is remved and the function terminates
      if (state.winner) {
        state.winner = null;
        break;
      } else {
        state.winner = state.players[i].name;
      }
    }
  }
  // Once the state.winner is determined the game ends
  if (state.winner) {
    toggleModal();
    generatePopupMsg(
      `Player ${state.winner} won! Do you want to start another game?`
    );
    updateLog(`Player ${state.winner} won the game!`, "green");
    yes.addEventListener("click", function () {
      location.reload();
    });
    no.addEventListener("click", toggleModal);
  }
}
// display quick message whose turn it is
function whoseTurn() {
  if (document.getElementById("turn") === null) {
    const turn = document.createElement("div");
    turn.id = "turn";
    document.body.append(turn);
  }
  const turn = document.getElementById("turn");
  turn.innerHTML = `<p style="font-size: 20px;">It is ${
    state.players[state.currentPlayer].name
  }'s turn.</p>`;
  turn.style.display = "flex";
  turn.style.opacity = 1;
  turn.style.marginTop = "-205px";
  setTimeout(function () {
    turn.style.opacity = 0;
    setTimeout(function () {
      turn.style.display = "none";
    }, 350);
  }, 350);
}
// Start the game with default players. Press start game button and close the window
startGame("Filip", "Asia", "Michał", "Magda");
if (state.players.length > 0) btn1.style.display = "none";
