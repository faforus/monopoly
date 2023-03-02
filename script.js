"use strict";

//NOTE
//SUICIDE INCREASE RANK
// IS PLAYER DEAD , WHAT IF PERSON OWNED IS THE COMMUNITY CHEST?
// when player dies do not remove him from the board until the next turn
// CSS make it look nicer
// implement protected fields
// MAYBE USE SIMILAR METHODS TO MANAGE MONEY PROPS ETC? along with new array method to sum all values

// players can probably trade properties with houses on?

/*
class Account {
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.pin = pin;
    this.movements = [];
    this.locale = navigator.language;
  }
  deposit(value) {
    this.movements.push(value);
  }
  withdraw(value) {
    this.deposit(-value);
  }
}

const acc1 = new Account('Jonas', 'EUR', 1111);

acc1.deposit(250);
acc1.withdraw(140);
console.log(acc1);
*/

// OPTIONS
const sidesOfDie = 4; // Do not increase to more than 4 -- // lap logic implemented only for up to 2x4 side die
const timesPenalty = 0.5;
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
// global variables
const players = []; // will be filled with players object from collect names function
let currentPlayer = 0; // define whose turn it is
let tempPosition; // players position before roll
let tempMovementPosition = 0; // players position after roll
let tempPositionInArray = 0; // players position in players array
let currentRoll = 0; //
let winner = null;
let roll1 = 0;
let roll2 = 0;
let prisonRoll = 0; // if you rolled the same number twice the count goes up, at 2 you go to prison
let postponedMSG = 0; // no postponed msg when player is making an action
let pendingPenalty = 0; // remaining of the penalty when player is selling streets to survive
let pendingPenaltyBenefactor; // Person who is owned the money
let availableForTrade = []; // used for listing props for trade
let filtered = []; // used for listing filtered props for trade
// Empty messages
let soldMsg = "";
let buyMsg = "";
let communityMsg = "";
let postponedMovementMSG = "";
let propertyPenaltyMsgGood = "";
let prisonMsg = "";
let propertyPenaltyMsg = "";
let welcomeHomeMsg = "";
let startMoneyMsg = "";
let deathMsg = "";
let releasedPropertiesMsg = "";
let prisonRollMsg = "";
// Community shuffle
let generatedNumbers = [];
let tempArray;
let communityAr = [1, 2, 3];

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
    team: 2,
    name: "Old Kent Road",
    rank: 0,
    set: 1,
    twin: 2,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 150,
    originalPenalty: 500 * timesPenalty,
    penalty: 500 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 2,
    team: 1,
    name: "Whitechapel Road",
    rank: 0,
    set: 1,
    twin: 1,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 200,
    originalPenalty: 600 * timesPenalty,
    penalty: 600 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 3,
    oldNumber: 2,
    name: "Community Chest",
    occupied: [],
    owned: false,
    ownedby: null,
    action: community,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 4,
    team: 5,
    oldNumber: 3,
    name: "The Angel",
    rank: 0,
    set: 2,
    twin: 5,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 300,
    originalPenalty: 700 * timesPenalty,
    penalty: 700 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 5,
    team: 4,
    name: "Euston Road",
    rank: 0,
    set: 2,
    twin: 4,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 400,
    originalPenalty: 800 * timesPenalty,
    penalty: 800 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 6,
    oldNumber: 4,
    name: "Parking Lot",
    occupied: [],
    owned: false,
    action: function () {},
    isPlayerDead: isPlayerDead,
  },
  {
    number: 7,
    team: 8,
    oldNumber: 5,
    name: "Bow Street",
    rank: 0,
    set: 3,
    twin: 8,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 500,
    originalPenalty: 900 * timesPenalty,
    penalty: 900 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 8,
    team: 7,
    name: "Vine Street",
    rank: 0,
    set: 3,
    twin: 7,
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 600,
    originalPenalty: 1000 * timesPenalty,
    penalty: 1000 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 9,
    oldNumber: 6,
    name: "Prison",
    displayName: "HM Pentonville",
    occupied: [],
    owned: false,
    action: function () {},
    isPlayerDead: isPlayerDead,
  },
  {
    number: 10,
    team: 11,
    oldNumber: 7,
    name: "Park Lane",
    rank: 0,
    set: 4,
    twin: 11,
    twinName: "Fancy Street 2",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 700,
    originalPenalty: 120 * timesPenalty,
    penalty: 1200 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 11,
    team: 10,
    name: "Mayfair",
    rank: 0,
    set: 4,
    twin: 10,
    twinName: "Fancy Street 1",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 800,
    originalPenalty: 1400 * timesPenalty,
    penalty: 1400 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
];
// Generate the map on page load
updateMap();
// Generate the dice on page load
displayDie(4, "die1");
displayDie(4, "die2");
// Create and update the map
function updateMap() {
  map.innerHTML = `
    <div class="row">
      ${updateFields(0, "Start", "notastreet")}
      ${updateFields(1, "Old Kent Road", "slumst")}
      ${updateFields(2, "Whitechapel Road", "slumst")}
      ${updateFields(3, "Community Chest", "notastreet")}
    </div>

    <div class="row">
      ${updateFields(11, "Mayfair", "fancyst")}
      <div class="fielddiv emptyfield">
      <p class="field-name" style="position:absolute; right:-10px;">MONO</p></div>
      <div class="fielddiv emptyfield">
      <p class="field-name" style="position:absolute; left:10px;">POLY</p></div>
      ${updateFields(4, "The Angel", "poorst")}
    </div>

    <div class="row">
      ${updateFields(10, "Park Lane", "fancyst")}
      <div class="fielddiv emptyfield">
      <p class="field-name"></p></div>
      <div class="fielddiv emptyfield">
      <p class="field-name"></p></div>
      ${updateFields(5, "Euston Road", "poorst")}
    </div>

    <div class="row">
      ${updateFields(9, "HM Pentonville", "notastreet")}
      ${updateFields(8, "Vine Street", "regularst")}
      ${updateFields(7, "Bow Street", "regularst")}
      ${updateFields(6, "Parking", "notastreet")}
    </div>`;
}
// Update street and non street fields
function updateFields(fieldNum, fieldName, fieldStyle) {
  return `
  <div class="field-${fieldNum} fielddiv">
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
      }</b>, Penalty: <b>$${fields[fieldNum].penalty}</b></p>
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
    players.push({
      name: args[i],
      position: 0,
      money: 2000,
      prison: 0,
      properties: [],
    });
    // push players onto the START field
    fields[0].occupied.push(args[i]);
  }
  updatePlayerInfo();
  updateMap();
  return players;
}
// button cooldown
// let canClick = true;
// const handleClick = () => {
//   if (canClick) {
//     movePlayer();
//     canClick = false;
//     setTimeout(() => {
//       canClick = true;
//     }, 1000);
//   }
// };

// Start the game and collect up to 4 names
btn1.addEventListener("click", function () {
  collectNames();
  btn1.style.display = "none";
});
// Roll the dice button
dieTable.addEventListener("click", movePlayer);
// Roll the dice with r button
document.addEventListener("keydown", function (e) {
  e.key === "r" &&
    btnDeath.classList.contains("hidden") &&
    buyPopup.classList.contains("hidden") &&
    modal.classList.contains("hidden") &&
    !winner &&
    movePlayer();
});
//
// Move player
async function movePlayer() {
  log.scrollTop = 0;
  if (winner) {
    return;
  }
  // get current position of a player
  tempPosition = players[currentPlayer].position;
  // roll the dice
  currentRoll = rollTwoDice();
  // if you rolled doubles on second roll PRISON TIME
  try {
    secondDoubles();
  } catch (e) {
    return;
  }
  // Find current player in the fields field occupied array
  tempPositionInArray = fields[tempPosition].occupied.indexOf(
    players[currentPlayer].name
  );
  // Remove that player
  fields[tempPosition].occupied.splice(tempPositionInArray, 1); // remove that player
  // log player movement but do not display yet
  postponedMovementMSG = `<b>${
    players[currentPlayer].name
  }</b> rolled <b>${currentRoll}</b> and moved from <b>${
    fields[tempPosition].name
  }</b> to <b>${
    fields[
      tempPosition + currentRoll >= 12
        ? tempPosition + currentRoll - 12
        : tempPosition + currentRoll
    ].name
  }</b>.`;
  // IMPORTANT ERRORS OCCUR HERE. REWRITE?
  // if you reached the start
  if (tempPosition + currentRoll >= 12) {
    fields[tempPosition + currentRoll - 12].occupied.push(
      players[currentPlayer].name
    );
    tempMovementPosition = tempPosition + currentRoll - 12;
    // insert that player
    players[currentPlayer].position = tempMovementPosition; // update player position
    await fields[0].action();
    await fields[0].isPlayerDead();
    if (tempPosition + currentRoll - 12 !== 0) {
      await fields[tempMovementPosition].action();
      await fields[tempMovementPosition].isPlayerDead();
    }
  } else {
    tempMovementPosition = tempPosition + currentRoll;
    //if you have not reached the start
    fields[tempMovementPosition].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = tempMovementPosition; // update player position
    await fields[tempMovementPosition].action(); // run a field specific function
    await fields[tempMovementPosition].isPlayerDead();
  }
  // IMPORTANT ERRORS OCCUR HERE. REWRITE?
  // LOG MESSAGES
  logUpdatePlayerMessages();
  updateMap();
  determineWinner();
  // If you rolled doubles on your first roll
  try {
    firstDoubles();
  } catch (e) {
    return;
  }
  //update current player
  updateNextPlayer();
  updatePlayerInfo();
  whoseTurn();
}
// log move player messages
function logUpdatePlayerMessages() {
  updateLog(releasedPropertiesMsg, "tomato");
  releasedPropertiesMsg = "";
  updateLog(deathMsg, "violet");
  deathMsg = "";
  updateLog(prisonMsg, "tomato");
  prisonMsg = "";
  // these logs will be displayed straight away if the player is making a decision - buy property
  if (!postponedMSG) {
    updateLog(communityMsg, "orange");
    updateLog(propertyPenaltyMsg, "tomato");
    updateLog(propertyPenaltyMsgGood, "lightgreen");
    updateLog(welcomeHomeMsg, "lightgreen");
    updateLog(startMoneyMsg, "lightgreen");
    updateLog(postponedMovementMSG, "lightgray");
  }
  // reset the messeges
  postponedMSG = 0;
  communityMsg = "";
  propertyPenaltyMsgGood = "";
  postponedMovementMSG = "";
  propertyPenaltyMsg = "";
  startMoneyMsg = "";
  welcomeHomeMsg = "";
}
// Update current player + skip losers and prison
function updateNextPlayer() {
  if (currentPlayer === players.length - 1) {
    currentPlayer = 0;
  } else {
    currentPlayer++;
  }
  // no turn for dead or jailed players
  while (
    players[currentPlayer].money < 0 ||
    players[currentPlayer].prison > 0
  ) {
    skipTurn();
  }
}
// If you rolled doubles on your first roll
function firstDoubles() {
  if (roll1 === roll2 && prisonRoll === 0 && players[currentPlayer].money > 0) {
    // if you just went to prison through community chest action
    if (players[currentPlayer].prison !== 0) {
      //update current player
      updateNextPlayer();
      updatePlayerInfo();
      throw new Error("stop");
    } else {
      prisonRoll = 1;
      prisonRollMsg = `<b>${players[currentPlayer].name}</b> you rolled doubles, you get to <b>roll again</b>.`;
      updateLog(prisonRollMsg, "lightgreen");
      prisonRollMsg = "";
      updatePlayerInfo();
      throw new Error();
    }
  } else {
    prisonRoll = 0;
  }
  updateLog(prisonRollMsg, "lightgreen");
  prisonRollMsg = "";
}
// if you rolled doubles on second roll PRISON TIME
function secondDoubles() {
  if (roll1 === roll2 && prisonRoll === 1 && players[currentPlayer].money > 0) {
    // go to prison
    players[currentPlayer].prison = 2;
    fields[tempMovementPosition].occupied.pop();
    fields[9].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 9; // update player position
    prisonRollMsg = `<b>${players[currentPlayer].name}</b>, you rolled doubles again. You were caught speeding and you are going to jail for 2 turns!`;
    prisonRoll = 0;
    //update current player
    updateNextPlayer();
    updateMap();
    updatePlayerInfo();
    updateLog(prisonRollMsg, "tomato");
    prisonRollMsg = "";
    whoseTurn();
    throw new Error();
  }
}
// Roll 2 dice - run by another function
function rollTwoDice() {
  if (cheat) {
    return dieCheat;
  }
  roll1 = Math.floor(Math.random() * sidesOfDie) + 1;
  roll2 = Math.floor(Math.random() * sidesOfDie) + 1;
  let rollSum = roll1 + roll2;

  // display the dice function
  displayDie(roll1, "die1");
  displayDie(roll2, "die2");
  return rollSum;
  // return 1;
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
  if (players[currentPlayer].money < 0 || players[currentPlayer].prison > 0) {
    // if is in prison display message and -1 on prison
    if (players[currentPlayer].prison) {
      players[currentPlayer].prison = players[currentPlayer].prison - 1;
      updateLog(
        `<b>${players[currentPlayer].name}</b>, you are still in jail. Turns to go free: <b>${players[currentPlayer].prison}</b>`,
        "tomato"
      );
    }
    // skip turn
    if (currentPlayer === players.length - 1) {
      currentPlayer = 0;
    } else {
      currentPlayer++;
    }
  }
}
// Update the player scoreboard and create buttons to trade streets
function updatePlayerInfo() {
  if (document.getElementById("player-info") === null) {
    const scoreboard = document.createElement("div");
    scoreboard.style = "text-align: center";
    scoreboard.id = "player-info";
    document.body.append(scoreboard);
  }

  const scoreboard = document.getElementById("player-info");

  let moreHtml = "";
  for (let i = 0; i < players.length; i++) {
    let html = `<h3 ${
      currentPlayer === players.indexOf(players[i]) ? 'class="highlight"' : ""
    }>Player ${i + 1}: ${players[i].name}</h3>
    <p>Money: <b style="color: #333">$${players[i].money}</b></p>`;
    if (players[i].properties.length > 0) {
      html += `<p>Current properties:</p><ul>`;
      for (let j = 0; j < players[i].properties.length; j++) {
        html += `<li>

        <button class="${
          players[currentPlayer].properties.includes(players[i].properties[j])
            ? "buyButtonInactive"
            : "buyButtonActive"
        } ${players[i].properties[j]
          .replace(/\s+/g, "-")
          .toLowerCase()}" button${j} ${
          players[currentPlayer].properties.includes(players[i].properties[j])
            ? ""
            : ""
        }" data-streetset="${
          fields.find((field) => field.name === players[i].properties[j]).set
        }"
        data-ranked="${
          fields.find((field) => field.name === players[i].properties[j]).rank >
          0
            ? "ranked"
            : "unranked"
        }" data-suspended="${
          fields.find((field) => field.name === players[i].properties[j])
            .suspended
            ? "suspended"
            : "notsuspended"
        }" data-player="${i}" data-property="${players[i].properties[j]}">${
          players[i].properties[j]
        }</button>
        
        </li>`;
      }
      html += `</ul>`;
    }
    html += `${
      players[i].prison
        ? `<p class="red">Turns left in prison ${players[i].prison}</p>`
        : ""
    }`;
    html += `${
      players[i].money < 0 ? `<p class="purple">PLAYER HAS LOST</p>` : ""
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

  // SUSPENDED BUTTONS
  buttonsSUS.forEach((button) => {
    button.classList.toggle("redbg");
  });

  btnSell.removeEventListener("click", sell.EventListener);
  btnNoSell.removeEventListener("click", btnNoSell.EventListener);
  btnNoSuspend.removeEventListener("click", noSuspend.EventListener);
  btnSuspend.removeEventListener("click", suspend.EventListener);

  // CURRENT PLAYER'S BUTTONS
  buttonsIA.forEach((button) => {
    if (button.dataset.suspended !== "suspended") {
      button.classList.toggle("buttonOpacity");
    }
    button.addEventListener("click", function (event) {
      // field that is being owned
      let fieldName = event.target.dataset.property;
      let field = fields.find((field) => field.name === fieldName);
      let msg = `${players[currentPlayer].name} you can mortgage ${field.name} for $${field.buyoutPrice}`;
      toggleSuspendModal(msg);

      if (
        fields[field.number].ownedby === fields[field.number - 1]?.ownedby ||
        fields[field.number].ownedby === fields[field.number + 1]?.ownedby
      ) {
        housesPopup.classList.toggle("hidden");
      }

      // DOWNGRADE RANK
      let downEvent = function () {
        if (
          (field.rank > 0 &&
            (field.rank === fields[field.number - 1]?.rank ||
              field.rank === fields[field.number + 1]?.rank)) ||
          field.rank - fields[field.number - 1]?.rank === 1 ||
          field.rank - fields[field.number + 1]?.rank === 1
        ) {
          field.rank -= 1;
          field.penalty = (field.penalty / 3) * 2;
          players[currentPlayer].money += field.buyoutPrice;
          housestxt.textContent = `Rank: ${field.rank}`;
          updateMap();
          updatePlayerInfo();
          btnSuspend.addEventListener("click", suspend.EventListener);
          btnNoSuspend.addEventListener("click", noSuspend.EventListener);
        }
      };
      // UPGRADE RANK
      let upEvent = function () {
        if (
          (players[currentPlayer].money >= field.buyoutPrice &&
            field.rank < 4 &&
            (field.rank === fields[field.number - 1]?.rank ||
              field.rank === fields[field.number + 1]?.rank)) ||
          field.rank - fields[field.number - 1]?.rank === -1 ||
          field.rank - fields[field.number + 1]?.rank === -1
        ) {
          field.rank += 1;
          field.penalty *= 1.5;
          players[currentPlayer].money -= field.buyoutPrice;
          housestxt.textContent = `Rank: ${field.rank}`;
          updateMap();
          updatePlayerInfo();
          btnSuspend.addEventListener("click", suspend.EventListener);
          btnNoSuspend.addEventListener("click", noSuspend.EventListener);
        }
      };

      if (
        field.ownedby === fields[field.number - 1]?.ownedby ||
        field.ownedby === fields[field.number + 1]?.ownedby
      ) {
        housestxt.textContent = `Rank: ${field.rank}`;
        btnLeft.addEventListener("click", downEvent);
        btnRight.addEventListener("click", upEvent);
      }

      /////////////////////////////////////////////////

      if (field.suspended && players[currentPlayer].money > field.buyoutPrice) {
        btnSuspend.textContent = "Unmortgage";
        suspendPopupTxt.innerHTML = `${players[currentPlayer].name} you can unmortgage ${field.name} for $${field.buyoutPrice}`;
        suspend.EventListener = function () {
          btnRight.removeEventListener("click", upEvent);
          btnLeft.removeEventListener("click", downEvent);
          players[currentPlayer].money -= field.buyoutPrice;
          field.suspended = false;
          let unsuspendMsg = `${players[currentPlayer].name} unmortaged ${fieldName}.`;
          updateLog(unsuspendMsg, "lightgreen");
          // update map/info
          updateMap();
          updatePlayerInfo();
          toggleSuspendModal();
          if (!housesPopup.classList.contains("hidden")) {
            housesPopup.classList.toggle("hidden");
          }
        };
      } else if (
        field.suspended &&
        players[currentPlayer].money < field.buyoutPrice
      ) {
        toggleSuspendModal();
      } else {
        btnSuspend.textContent = "Mortage";
        suspend.EventListener = function () {
          // make the change if can afford
          btnRight.removeEventListener("click", upEvent);
          btnLeft.removeEventListener("click", downEvent);
          players[currentPlayer].money += field.buyoutPrice;
          field.suspended = true;
          let suspendMsg = `${players[currentPlayer].name} mortgaged ${fieldName}.`;
          updateLog(suspendMsg, "tomato");
          // update map/info
          updateMap();
          updatePlayerInfo();
          toggleSuspendModal();
          if (!housesPopup.classList.contains("hidden")) {
            housesPopup.classList.toggle("hidden");
          }
        };
      }
      // BUG when in one go you upgrade the street and then click mortgage it does not work. You need to leave the window first and come back
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
      };

      btnNoSuspend.addEventListener("click", noSuspend.EventListener);
    });
  });

  // AVAILABLE FOR SELL BUTTONS
  buttonsAC.forEach((button) => {
    let iFFieldIndex = fields.findIndex(
      (field) => field.name === button.dataset.property
    );

    if (
      // create event listeners only for properties that do not belong to the current player. Do not create event listeners for properties that have higher rank(houses) and the adjecent properties.
      button.dataset.player !== currentPlayer &&
      !fields[iFFieldIndex].suspended &&
      fields[iFFieldIndex].rank === 0 &&
      (fields[iFFieldIndex - 1]?.rank === 0 ||
        fields[iFFieldIndex + 1]?.rank === 0)
    ) {
      button.addEventListener("click", function (event) {
        toggleSellModal(
          `${players[currentPlayer].name}, how much do you want to pay for this property?`
        );

        // clear existing options
        selectElement.innerHTML = "<option disabled selected value></option>";
        // clear the arrays
        availableForTrade = [];
        filtered = [];
        // create objects from buttons so they can be sorted
        buttonsIA.forEach((button) => {
          if (button.dataset.suspended !== "suspended") {
            availableForTrade.push({
              name: button.dataset.property,
              rank: button.dataset.ranked,
              index: button.dataset.streetset,
            });
          }
        });
        filtered = availableForTrade.filter((obj) => {
          // Find all objects with the same index as the current object
          const sameIndexObjs = availableForTrade.filter(
            (o) => o.index === obj.index
          );
          // check if any of those objects is ranked
          const hasRanked = sameIndexObjs.some((o) => o.rank === "ranked");
          // Return if meets criteria
          return !hasRanked && obj.rank !== "ranked";
        });
        // map the objects into strings
        filtered = filtered.map((e) => e.name);
        // create new options for filtered streets
        players[currentPlayer]?.properties.forEach((propertyName) => {
          if (filtered.includes(propertyName)) {
            let option = document.createElement("option");
            option.value = propertyName;
            option.text = propertyName;
            selectElement.appendChild(option);
          }
        });
        // SELL EVENT ON CLICK
        sell.EventListener = function () {
          // player who owns the property
          let playerIndex = event.target.dataset.player;
          let player = players[playerIndex];
          // field that is being owned
          let fieldName = event.target.dataset.property;
          let field = fields.find((field) => field.name === fieldName);
          // If player has enough money or selected his own street to trade
          if (
            (Number(moneyInput.value) < players[currentPlayer].money &&
              Number(moneyInput.value) >= field.buyoutPrice) ||
            selectElement.value
          ) {
            if (selectElement.value) {
              // Target current players property in player prop array to trade
              let sellerPropIndex = players[currentPlayer].properties.indexOf(
                selectElement.value
              );
              let tradePropIndex = fields.find(
                (field) => field.name === selectElement.value
              );
              // Remove that property from players prop parray
              players[currentPlayer].properties.splice(sellerPropIndex, 1);
              // push that property to new players prop array
              player.properties.push(selectElement.value);
              // change the owner in property field
              tradePropIndex.ownedby = player.name;
            }
            // trade money
            players[currentPlayer].money -= Number(moneyInput.value);
            player.money += Number(moneyInput.value);
            // update the owner of prop that was bought
            field.ownedby = players[currentPlayer].name;
            // push the new property into current players prop array
            players[currentPlayer].properties.push(field.name);
            let propIndex = player.properties.indexOf(fieldName);
            // remove that property from old owner
            player.properties.splice(propIndex, 1);
            soldMsg = `<b>${
              players[currentPlayer].name
            }</b> bought <b>${fieldName}</b> from <b>${
              player.name
            }</b> for <b>${
              !selectElement.value
                ? `$${moneyInput.value}`
                : `$${moneyInput.value || 0} and ${selectElement.value}`
            }</b>.`;
            moneyInput.value = "";
            updateLog(soldMsg, "lightgreen");
            // update map/info
            updateMap();
            updatePlayerInfo();
            toggleSellModal();
          } else {
            buyPopupError.innerHTML = `You need to be able to afford the property and pay at least the property's original price`;
          }
        };
        btnSell.addEventListener("click", sell.EventListener);

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
  if (players[currentPlayer].money < 0) {
    if (players[currentPlayer].properties.length > 0) {
      return new Promise((resolve) => {
        postponedMSG = 1;
        btnDeath.classList.toggle("hidden");
        updateLog(
          `<b>${players[currentPlayer].name}</b>, you rolled <b>${currentRoll}</b> and entered <b>${this.name}</b>. You need to pay <b>${this.penalty}</b>, but cannot afford it. You are <b>${pendingPenalty}</b> short and are about to <b>lose</b>, sell whatever you have got to stay in the game!`,
          "orangered"
        );
        const deathListener = () => {
          // if player will survive the penalty
          if (players[currentPlayer].money >= pendingPenalty) {
            pendingPenaltyBenefactor.money += pendingPenalty;
            players[currentPlayer].money -= pendingPenalty;
            players[currentPlayer].money += 1;
            updateLog(
              `<b>${players[currentPlayer].name}</b> managed to pay <b>${this.ownedby}</b> the remaining <b>$${pendingPenalty}</b>.`,
              "tomato"
            );
          } else {
            // if player will not be able to survive the penalty
            pendingPenaltyBenefactor.money += players[currentPlayer]?.money;
            pendingPenaltyBenefactor.money += 1;
            players[currentPlayer].money -= pendingPenalty;
            players[currentPlayer].money += 1;
            deathMsg = `<b>${players[currentPlayer].name}</b> lost all the money and is out of the game!`;
            releasePlayerProperties(players[currentPlayer], fields);
          }
          btnDeath.classList.toggle("hidden");
          btnDeath.removeEventListener("click", deathListener);
          resolve();
        };
        btnDeath.addEventListener("click", deathListener);
      });
    }
  }
  if (players[currentPlayer].money < 0) {
    deathMsg = `<b>${players[currentPlayer].name}</b> lost all the money and is out of the game!`;
    releasePlayerProperties(players[currentPlayer], fields);
  }
}
// if player dies recirculate his properties
function releasePlayerProperties(player, fields) {
  if (player.properties.length > 0) {
    releasedPropertiesMsg = `These properties are available again: `;
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
      releasedPropertiesMsg += fields[fieldIndex].name;
      if (i !== player.properties.length - 1) {
        releasedPropertiesMsg += ", ";
      } else {
        releasedPropertiesMsg += ".";
      }
    }
  }
  players[currentPlayer].properties = [];
  // remove latest addition to the field, remove the pawn from the board
  fields[tempMovementPosition].occupied.pop();
  updateMap();
}
// Award money when player crosses start
function startMoney() {
  let startCash = 200;
  players[currentPlayer].money = players[currentPlayer].money + startCash;
  startMoneyMsg = `<b>${players[currentPlayer].name}</b> was awarded <b>$${startCash}</b< for crossing the start field.`;
}
// Community Chest with 3 cards/possibilities
async function community() {
  communityMsg = "";
  // Reset the array once all cards were used up - shuffle cards
  if (generatedNumbers.length === 5) {
    generatedNumbers = [];
  }
  // Generate random number
  let randomNumber = Math.floor(Math.random() * 5) + 1;
  // Keep generating if the card was already used
  while (generatedNumbers.includes(randomNumber)) {
    randomNumber = Math.floor(Math.random() * 5) + 1;
  }
  // Update the array with used numbers/cards
  generatedNumbers.push(randomNumber);
  // the cards and what they do
  if (randomNumber === 1) {
    players[currentPlayer].money = players[currentPlayer].money + 200;
    communityMsg = `Congratulations <b>${players[currentPlayer].name}</b>, you won a lottery, <b>$200</b> is yours!`;
  } else if (randomNumber === 2) {
    players[currentPlayer].money =
      players[currentPlayer].money - 500 * timesPenalty;
    communityMsg = `<b>${
      players[currentPlayer].name
    }</b>, you were mugged and lost <b>$${500 * timesPenalty}</b>.`;
  } else if (randomNumber === 3) {
    // set prison turns to 2
    players[currentPlayer].prison = 2;
    fields[3].occupied.pop();
    fields[9].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 9; // update player position
    communityMsg = `<b>${players[currentPlayer].name}</b>, you went through a red light. You're going to jail for 2 turns!`;
  } else if (randomNumber === 4) {
    fields[3].occupied.pop();
    fields[11].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 11; // update player position
    tempMovementPosition = 11;
    communityMsg = `<b>${players[currentPlayer].name}</b>, you took a taxi to <b>Fancy Street 2.</b>`;
    await fields[11].action(); // action
    await fields[11].isPlayerDead(); // action
  } else if (randomNumber === 5) {
    fields[3].occupied.pop();
    fields[0].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 0; // update player position
    tempMovementPosition = 0;
    communityMsg = `<b>${players[currentPlayer].name}</b>, you went straight to the start. <b>Collect your cash!</b>`;
    await fields[0].action(); // action
    await fields[0].isPlayerDead(); // action
  }
}
// Buy the street, visit the street that you own or pay the penalty if you do not
async function streetAction() {
  updateMap();
  if (!this.owned && players[currentPlayer].money >= this.buyoutPrice) {
    updateLog(communityMsg, "orange");
    updateLog(propertyPenaltyMsg, "tomato");
    updateLog(propertyPenaltyMsgGood, "lightgreen");
    updateLog(welcomeHomeMsg, "lightgreen");
    updateLog(startMoneyMsg, "lightgreen");
    updateLog(postponedMovementMSG, "lightgray");
    return new Promise((resolve) => {
      // Buy this field if criteria are met
      toggleModal();
      generatePopupMsg(
        `<b>${players[currentPlayer].name}</b>, you rolled <b>${currentRoll}</b>, moved from <b>${fields[tempPosition].name}</b> to <b>${this.name}</b>. You have a chance to buy this property for <b>$${this.buyoutPrice}</b>.`
      );
      yes.eventListener = () => {
        toggleModal();
        this.owned = true;
        this.ownedby = players[currentPlayer].name;
        players[currentPlayer].money =
          players[currentPlayer].money - this.buyoutPrice;
        // new code
        players[currentPlayer].properties.push(this.name);

        updateLog(
          `<b>${players[currentPlayer].name}</b> bought <b>${this.name}</b> for <b>$${this.buyoutPrice}</b>.`,
          "lightgreen"
        );
        updatePlayerInfo();
        updateMap();
        yes.removeEventListener("click", yes.eventListener);
        no.removeEventListener("click", handleNoClick);
        postponedMSG = 1;
        resolve();
      };
      yes.addEventListener("click", yes.eventListener);
      function handleNoClick() {
        toggleModal();
        // Remove the event listener
        no.removeEventListener("click", handleNoClick);
        yes.removeEventListener("click", yes.eventListener);
        postponedMSG = 1;
        resolve();
      }
      no.addEventListener("click", handleNoClick);
    });
  } else if (this.ownedby === players[currentPlayer].name) {
    // If you own this street and visit it
    welcomeHomeMsg = "Welcome home.";
    // await upgradeProperty();
    // if the street is suspended
  } else if (this.suspended) {
    welcomeHomeMsg = "This street has been mortaged, lucky you!.";
    // if you have to pay
  } else {
    if (!players.find((player) => player.name === this.ownedby)?.prison) {
      propertyPenaltyMsg = `<b>${players[currentPlayer].name}</b>, you entered <b>${this.ownedby}</b>'s property: <b>${this.name}</b>, and had to pay <b>$${this.penalty}</b>.`;
      // If the player cannot afford to pay the penalty in full only take his remaining money
      if (players[currentPlayer].money < this.penalty) {
        players.find((player) => player.name === this.ownedby).money +=
          players[currentPlayer].money;
        pendingPenaltyBenefactor = players.find(
          (player) => player.name === this.ownedby
        );
        pendingPenalty = this.penalty - players[currentPlayer].money;
        players[currentPlayer].money = -1;
        updatePlayerInfo();
      } else {
        // If player can afford the penalty substract the penalty amount from his account
        players.find((player) => player.name === this.ownedby).money +=
          this.penalty;
        players[currentPlayer].money -= this.penalty;
      }
      // if the owner is in jail
    } else {
      propertyPenaltyMsgGood = `<b>${players[currentPlayer].name}</b> entered <b>${this.ownedby}</b>'s property, lucky for you <b>${this.ownedby}</b> is in prison and cannot collect payments.`;
    }
  }
}
// If you own a set of streets upgrade them when stepped on a given field
// OBSOLETE REPLACED BY INTERFACE UPGRADE PROPERTY
function upgradeProperty() {
  //If player owns this field and adjecent and that field is part of a set...
  if (
    fields[tempMovementPosition].set === fields[tempMovementPosition - 1].set ||
    fields[tempMovementPosition].set === fields[tempMovementPosition + 1].set
  ) {
    if (
      fields[tempMovementPosition].ownedby ===
        fields[tempMovementPosition - 1]?.ownedby ||
      fields[tempMovementPosition].ownedby ===
        fields[tempMovementPosition + 1]?.ownedby
    ) {
      if (
        fields[tempMovementPosition].rank < 4 &&
        players[currentPlayer].money >= fields[tempMovementPosition].buyoutPrice
      ) {
        return new Promise((resolve) => {
          toggleModal();
          generatePopupMsg(
            `You can upgrade this <b>${fields[tempMovementPosition].name}<b> for <b>$${fields[tempMovementPosition].buyoutPrice}<b>.`
          );
          yes.eventListener = () => {
            toggleModal();
            players[currentPlayer].money =
              players[currentPlayer].money -
              fields[tempMovementPosition].buyoutPrice;
            fields[tempMovementPosition].rank += 1;
            fields[tempMovementPosition].penalty *= 1.5;
            fields[tempMovementPosition].penalty = Math.floor(
              fields[tempMovementPosition].penalty
            );
            updateLog(
              `<b>${players[currentPlayer].name}<b> upgraded <b>${fields[tempMovementPosition].name}</b> for <b>$${fields[tempMovementPosition].buyoutPrice}</b> to rank <b>${fields[tempMovementPosition].rank}</b>.`,
              "lightgreen"
            );
            updatePlayerInfo();
            updateMap();
            no.removeEventListener("click", handleNoClick2);
            yes.removeEventListener("click", yes.eventListener);
            postponedMSG = 1;
            resolve();
          };
          yes.addEventListener("click", yes.eventListener);
          function handleNoClick2() {
            toggleModal();
            // Remove the event listener
            yes.removeEventListener("click", yes.eventListener);
            no.removeEventListener("click", handleNoClick2);
            postponedMSG = 1;
            resolve();
          }
          no.addEventListener("click", handleNoClick2);
        });
      }
    }
  }
}
// Check if only one player is left with money
function determineWinner() {
  for (let i = 0; i < players.length; i++) {
    if (players[i].money > 0) {
      // only players with money are taken into consideration
      // the first player with money becomes a temporary winner
      // if there is anotehr player found with money the winner is remved and the function terminates
      if (winner) {
        winner = null;
        break;
      } else {
        winner = players[i].name;
      }
    }
  }
  // Once the winner is determined the game ends
  if (winner) {
    toggleModal();
    generatePopupMsg(
      `Player ${winner} won! Do you want to start another game?`
    );
    updateLog(`Player ${winner} won the game!`, "green");
    yes.addEventListener("click", function () {
      location.reload();
    });
    no.addEventListener("click", toggleModal);
  }
}
function whoseTurn() {
  if (document.getElementById("turn") === null) {
    const turn = document.createElement("div");
    turn.id = "turn";
    document.body.append(turn);
  }
  const turn = document.getElementById("turn");
  turn.innerHTML = `<p style="font-size: 20px;">It is ${players[currentPlayer].name}'s turn.</p>`;
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
if (players.length > 0) btn1.style.display = "none";
