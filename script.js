"use strict";

//NOTE
// offer player a way to sell his property, maybe when he is about to lose?
// when player dies do not remove him from the board until the next turn
// CSS make it look nicer

// OPTIONS
const sidesOfDie = 4; // Do not increase to more than 4 -- // lap logic implemented only for up to 2x4 side die
const timesPenalty = 0.5;
const cheat = false;
const dieCheat = 3;
// OPTIONS
const playerInfo = document.getElementById("player-info");
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
const turn = document.getElementById("turn");
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
// global variables
let currentPlayer = 0; // define whose turn it is
let tempPosition; // players position before roll
let tempMovementPosition = 0; // players position after roll
let tempPositionInArray = 0; // players position in players array
let currentRoll = 0; //
let buyer = 0; // current player frozen in time when property buyout popup message appears, currentPlayer already changed its value to next player
let players = []; // will be filled with players object from collect names function
let winner = null;
let roll1 = 0;
let roll2 = 0;
let prisonRoll = 0; // if you rolled the same number twice the count goes up, at 2 you go to prison
let wait = 0;
// Empty messages
let soldMsg = "";
let buyMsg = "";
let communityMsg = "";
let postponedMovementMSG = "";
let prisonMsg = "";
let propertyPenaltyMsg = "";
let welcomeHomeMsg = "";
let startMoneyMsg = "";
let deathMsg = "";
let releasedPropertiesMsg = "";
let prisonRollMsg = "";
// Community shuffle
let generatedNumbers = [];
let communityAr = [1, 2, 3];

// Define every single field in the game, certain fields contain methods which are run once the player enters the field. Fields hold information about the streets, buyout price and penalty amount
let fields = [
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
    name: "Slum Street 1",
    rank: 0,
    set: 1,
    twin: 2,
    twinName: "Slum Street 2",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 150,
    penalty: 500 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 2,
    name: "Slum Street 2",
    rank: 0,
    set: 1,
    twin: 1,
    twinName: "Slum Street 1",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 200,
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
    oldNumber: 3,
    name: "Poor Street 1",
    rank: 0,
    set: 2,
    twin: 5,
    twinName: "Poor Street 2",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 300,
    penalty: 700 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 5,
    name: "Poor Street 2",
    rank: 0,
    set: 2,
    twin: 4,
    twinName: "Poor Street 1",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 400,
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
    oldNumber: 5,
    name: "Regular Street 1",
    rank: 0,
    set: 3,
    twin: 8,
    twinName: "Regular Street 2",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 500,
    penalty: 900 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 8,
    name: "Regular Street 2",
    rank: 0,
    set: 3,
    twin: 7,
    twinName: "Regular Street 1",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 600,
    penalty: 1000 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 9,
    oldNumber: 6,
    name: "Prison",
    occupied: [],
    owned: false,
    action: function () {},
    isPlayerDead: isPlayerDead,
  },
  {
    number: 10,
    oldNumber: 7,
    name: "Fancy Street 1",
    rank: 0,
    set: 4,
    twin: 11,
    twinName: "Fancy Street 2",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 700,
    penalty: 1200 * timesPenalty,
    action: streetAction,
    isPlayerDead: isPlayerDead,
  },
  {
    number: 11,
    name: "Fancy Street 2",
    rank: 0,
    set: 4,
    twin: 10,
    twinName: "Fancy Street 1",
    occupied: [],
    owned: false,
    ownedby: null,
    buyoutPrice: 800,
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
      ${updateFields(1, "Slum Street 1", "slumst")}
      ${updateFields(2, "Slum Street 2", "slumst")}
      ${updateFields(3, "Community Chest", "notastreet")}
    </div>

    <div class="row">
      ${updateFields(11, "Fancy Street 2", "fancyst")}
      <div class="fielddiv emptyfield">
      <p class="field-name" style="position:absolute; right:-10px;">MONO</p></div>
      <div class="fielddiv emptyfield">
      <p class="field-name" style="position:absolute; left:10px;">POLY</p></div>
      ${updateFields(4, "Poor Street 1", "poorst")}
    </div>

    <div class="row">
      ${updateFields(10, "Fancy Street 1", "fancyst")}
      <div class="fielddiv emptyfield">
      <p class="field-name"></p></div>
      <div class="fielddiv emptyfield">
      <p class="field-name"></p></div>
      ${updateFields(5, "Poor Street 2", "poorst")}
    </div>

    <div class="row">
      ${updateFields(9, "Prison", "notastreet")}
      ${updateFields(8, "Regular Street 2", "regularst")}
      ${updateFields(7, "Regular Street 1", "regularst")}
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
    buyPopup.classList.contains("hidden") &&
    modal.classList.contains("hidden") &&
    !winner &&
    movePlayer();
});
//
//NOTE Move player - most complex function that triggers other functions or methods
//
function movePlayer() {
  if (winner) {
    return;
  }
  // assign current position and roll outcome
  tempPosition = players[currentPlayer].position;

  currentRoll = rollTwoDice();
  // if two die show the same numbers on your second roll
  if (roll1 === roll2 && prisonRoll === 1) {
    // go to prison
    players[currentPlayer].prison = 2;
    fields[tempMovementPosition].occupied.pop();
    fields[9].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 9; // update player position
    prisonRollMsg = `<p class="red">${players[currentPlayer].name}, You rolled the same numbers again. You're going to prison for 2 turns!<p>`;
    prisonRoll = 0;
    //update current player
    if (currentPlayer === players.length - 1) {
      currentPlayer = 0;
      whoseTurn();
    } else {
      currentPlayer++;
      whoseTurn();
    }
    // no turn for dead or jailed players
    while (
      players[currentPlayer].money < 0 ||
      players[currentPlayer].prison > 0
    ) {
      skipTurn();
    }
    updateMap();
    updatePlayerInfo();
    updateLog("<p>-----------------------------------------</p>");
    updateLog(prisonRollMsg);
    prisonRollMsg = "";
    return;
  }

  tempPositionInArray = fields[tempPosition].occupied.indexOf(
    players[currentPlayer].name
  ); // What is players position in an array

  fields[tempPosition].occupied.splice(tempPositionInArray, 1); // remove that player

  // log player movement
  postponedMovementMSG = `<p>${
    players[currentPlayer].name
  } rolled ${currentRoll} and moved from ${fields[tempPosition].name} to ${
    fields[
      tempPosition + currentRoll >= 12
        ? tempPosition + currentRoll - 12
        : tempPosition + currentRoll
    ].name
  }.</p>`;

  //set buer
  buyer = currentPlayer;
  // if you reached the start
  if (tempPosition + currentRoll >= 12) {
    fields[tempPosition + currentRoll - 12].occupied.push(
      players[currentPlayer].name
    );
    tempMovementPosition = tempPosition + currentRoll - 12;
    // insert that player
    players[currentPlayer].position = tempMovementPosition; // update player position
    fields[0].action();
    fields[0].isPlayerDead();
    if (tempPosition + currentRoll - 12 !== 0) {
      fields[tempMovementPosition].action();
      fields[tempMovementPosition].isPlayerDead();
    }
  } else {
    tempMovementPosition = tempPosition + currentRoll;
    //if you have not reached the start
    fields[tempMovementPosition].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = tempMovementPosition; // update player position
    fields[tempMovementPosition].action(); // run a field specific function
    fields[tempMovementPosition].isPlayerDead();
  }
  updateLog("<p>-----------------------------------------</p>");
  updateLog(releasedPropertiesMsg);
  releasedPropertiesMsg = "";
  updateLog(deathMsg);
  deathMsg = "";
  updateLog(prisonMsg);
  prisonMsg = "";
  updateLog(communityMsg);
  communityMsg = "";
  updateLog(propertyPenaltyMsg);
  propertyPenaltyMsg = "";
  updateLog(welcomeHomeMsg);
  welcomeHomeMsg = "";
  updateLog(startMoneyMsg);
  startMoneyMsg = "";
  updateLog(postponedMovementMSG);
  postponedMovementMSG = "";
  updateMap();
  determineWinner();

  // If 2 die show same number on your first roll
  if (roll1 === roll2 && prisonRoll === 0) {
    // if you just went to prison through community chest action
    if (players[currentPlayer].prison !== 0) {
      //update current player
      if (currentPlayer === players.length - 1) {
        currentPlayer = 0;
        whoseTurn();
      } else {
        currentPlayer++;
        whoseTurn();
      }
      // no turn for dead or jailed players
      while (
        players[currentPlayer].money < 0 ||
        players[currentPlayer].prison > 0
      ) {
        skipTurn();
      }
      updatePlayerInfo();
      return;
    } else {
      prisonRoll = 1;
      prisonRollMsg = `<p class="green bold-upper">${players[currentPlayer].name} rolls again!</p>`;
      updateLog(prisonRollMsg);
      prisonRollMsg = "";
      updatePlayerInfo();
      return;
    }
  } else {
    prisonRoll = 0;
  }
  updateLog(prisonRollMsg);
  prisonRollMsg = "";

  //update current player
  if (currentPlayer === players.length - 1) {
    currentPlayer = 0;
    if (!wait) {
      whoseTurn();
    }
  } else {
    currentPlayer++;
    if (!wait) {
      whoseTurn();
    }
  }
  // no turn for dead or jailed players
  while (
    players[currentPlayer].money < 0 ||
    players[currentPlayer].prison > 0
  ) {
    skipTurn();
  }
  updatePlayerInfo();
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
      updateLog("<p>-----------------------------------------</p>");
      updateLog(
        `<p class="red">${players[currentPlayer].name}, you are still in prison. Turns to go free: ${players[currentPlayer].prison}</p>`
      );
    }
    // skip turn
    if (currentPlayer === players.length - 1) {
      currentPlayer = 0;
      whoseTurn();
    } else {
      currentPlayer++;
      whoseTurn();
    }
  }
}
// Update the player scoreboard and create buttons to trade streets
function updatePlayerInfo() {
  let moreHtml = "";
  for (let i = 0; i < players.length; i++) {
    let html = `<h3>Player ${i + 1}: ${players[i].name}</h3>
    <p>Money: $${players[i].money}</p>`;
    if (players[i].properties.length > 0) {
      html += `<p>Current properties:</p><ul>`;
      for (let j = 0; j < players[i].properties.length; j++) {
        html += `<li>

        <button class="${
          players[currentPlayer].properties.includes(players[i].properties[j])
            ? "buyButtonInactive"
            : "buyButtonActive"
        } ${players[i].properties[j].split(" ")[0]}" button${j} ${
          players[currentPlayer].properties.includes(players[i].properties[j])
            ? ""
            : ""
        }" data-ranked="${
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
      players[i].money < 0 ? `<p class="purple">PLAYER IS DEAD</p>` : ""
    }`;
    moreHtml += html;
  }

  playerInfo.innerHTML = moreHtml;
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
    if (button.dataset.suspended === "suspended") {
    } else {
      button.classList.toggle("graybg");
    }
    button.addEventListener("click", function (event) {
      // field that is being owned
      let fieldName = event.target.dataset.property;
      let field = fields.find((field) => field.name === fieldName);
      let msg = `${players[currentPlayer].name} you can suspend ${field.name} for $${field.buyoutPrice}`;
      toggleSuspendModal(msg);
      if (field.suspended) {
        btnSuspend.textContent = "Unsuspend";
        suspendPopupTxt.innerHTML = `${players[currentPlayer].name} you can unsuspend ${field.name} for $${field.buyoutPrice}`;
        suspend.EventListener = function () {
          players[currentPlayer].money -= field.buyoutPrice;
          field.suspended = false;
          let unsuspendMsg = `<p class="green">${players[currentPlayer].name} unsuspended ${fieldName}.</p>`;
          updateLog(unsuspendMsg);
          // update map/info
          updateMap();
          updatePlayerInfo();
          toggleSuspendModal();
        };
      } else {
        btnSuspend.textContent = "Suspend";
        suspend.EventListener = function () {
          // make the change if can afford
          players[currentPlayer].money += field.buyoutPrice;
          field.suspended = true;
          let suspendMsg = `<p class="red">${players[currentPlayer].name} suspended ${fieldName}.</p>`;
          updateLog(suspendMsg);
          // update map/info
          updateMap();
          updatePlayerInfo();
          toggleSuspendModal();
        };
      }

      btnSuspend.addEventListener("click", suspend.EventListener);
      noSuspend.EventListener = () => {
        toggleSuspendModal();
        updatePlayerInfo();
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

        // populate select with the player's properties
        players[currentPlayer]?.properties.forEach((propertyName) => {
          let option = document.createElement("option");
          option.value = propertyName;
          option.text = propertyName;
          selectElement.appendChild(option);
        });
        // SELL EVENT ONO CLICK
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
            soldMsg = `<p class="green">${
              players[currentPlayer].name
            } bought ${fieldName} from ${player.name} for ${
              !selectElement.value
                ? `$${moneyInput.value}`
                : `$${moneyInput.value || 0} and ${selectElement.value}`
            }.</p>`;
            moneyInput.value = "";
            updateLog(soldMsg);
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
function updateLog(msg) {
  log.insertAdjacentHTML(`afterbegin`, msg);
}
// Check if the current player has negative balance
function isPlayerDead() {
  if (players[currentPlayer].money < 0) {
    deathMsg = `<p class="purple">${players[currentPlayer].name} is so broke that he died!</p>`;
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
}
//
//NOTE 3 FIELD METHODS EXPORTED
//
// Award money when player crosses start
function startMoney() {
  players[currentPlayer].money = players[currentPlayer].money + 200;
  startMoneyMsg = `<p class="green">${players[currentPlayer].name} was awarded $200 for crossing the start field.</p>`;
}
// Community Chest with 3 cards/possibilities
function community() {
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
    communityMsg = `<p class="green">Congratulations ${players[currentPlayer].name}, you won a lottery $200 is yours!</p>`;
  } else if (randomNumber === 2) {
    players[currentPlayer].money =
      players[currentPlayer].money - 500 * timesPenalty;
    communityMsg = `<p class="red">${
      players[currentPlayer].name
    }, you were mugged and lost $${500 * timesPenalty}.</p>`;
  } else if (randomNumber === 3) {
    // set prison turns to 2
    players[currentPlayer].prison = 2;
    fields[3].occupied.pop();
    fields[9].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 9; // update player position
    communityMsg = `<p class="red">${players[currentPlayer].name}, you went through a red light. You're going to prison for 2 turns!<p>`;
  } else if (randomNumber === 4) {
    fields[3].occupied.pop();
    fields[11].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 11; // update player position
    tempMovementPosition = 11;
    fields[11].action(); // action
    fields[11].isPlayerDead(); // action
    communityMsg = `<p class="green">${players[currentPlayer].name}, you took a taxi to Fancy Street 2.<p>`;
  } else if (randomNumber === 5) {
    fields[3].occupied.pop();
    fields[0].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 0; // update player position
    tempMovementPosition = 0;
    fields[0].action(); // action
    fields[0].isPlayerDead(); // action
    communityMsg = `<p class="green">${players[currentPlayer].name}, you went straight to the start. Collect your cash!<p>`;
  }
}
// Buy the street, visit the street that you own or pay the penalty if you do not
function streetAction() {
  if (!this.owned && players[buyer].money >= this.buyoutPrice) {
    // Buy this field if criteria are met
    toggleModal();
    wait = 1;
    generatePopupMsg(
      `${players[currentPlayer].name}, you rolled ${currentRoll}, moved from ${fields[tempPosition].name} to ${this.name}. You have a chance to buy this property for $${this.buyoutPrice}.`
    );
    yes.eventListener = () => {
      toggleModal();
      this.owned = true;
      this.ownedby = players[buyer].name;
      players[buyer].money = players[buyer].money - this.buyoutPrice;
      // new code
      players[buyer].properties.push(this.name);

      updateLog(
        `<p class="green">${players[buyer].name} bought ${this.name} for ${this.buyoutPrice}.</p>`
      );
      updatePlayerInfo();
      updateMap();
      whoseTurn();
      wait = 0;
      yes.removeEventListener("click", yes.eventListener);
      no.removeEventListener("click", handleNoClick);
    };
    yes.addEventListener("click", yes.eventListener);
    function handleNoClick() {
      toggleModal();
      wait = 0;
      whoseTurn();
      // Remove the event listener
      no.removeEventListener("click", handleNoClick);
      yes.removeEventListener("click", yes.eventListener);
    }
    no.addEventListener("click", handleNoClick);
  } else if (this.ownedby === players[currentPlayer].name) {
    // If you own this street and visit it
    welcomeHomeMsg = "<p>Welcome home.</p>";
    upgradeProperty();
  } else if (this.suspended) {
    welcomeHomeMsg = "<p>This street has been suspended, lucky you!.</p>";
  } else {
    if (!players.find((player) => player.name === this.ownedby).prison) {
      propertyPenaltyMsg = `<p class="red">${players[currentPlayer].name}, you entered ${this.ownedby}'s property: ${this.name}, and had to pay ${this.penalty}.</p>`;
      // If the player cannot afford to pay the penalty in full only take his remaining money
      if (players[currentPlayer].money < this.penalty) {
        players.find((player) => player.name === this.ownedby).money +=
          players[currentPlayer].money;
      } else {
        // If player can afford the penalty substract the penalty amount from his account
        players.find((player) => player.name === this.ownedby).money +=
          this.penalty;
      }
      // Substract the penaly from the player even if it brings it below zero - display the final blow
      players[currentPlayer].money -= this.penalty;
    } else {
      propertyPenaltyMsg = `${players[currentPlayer].name} entered ${this.ownedby}'s property, lucky for you ${this.ownedby} is in prison and cannot collect payments.`;
    }
  }
}
// If you own a set of streets upgrade them when stepped on a given field
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
        players[buyer].money >= fields[tempMovementPosition].buyoutPrice
      ) {
        wait = 1;
        toggleModal();
        generatePopupMsg(
          `You can upgrade this ${fields[tempMovementPosition].name} for $${fields[tempMovementPosition].buyoutPrice}.`
        );
        yes.eventListener = () => {
          toggleModal();
          players[buyer].money =
            players[buyer].money - fields[tempMovementPosition].buyoutPrice;
          fields[tempMovementPosition].rank += 1;
          fields[tempMovementPosition].penalty *= 1.5;
          fields[tempMovementPosition].penalty = Math.floor(
            fields[tempMovementPosition].penalty
          );
          updateLog(
            `<p class="green">${players[buyer].name} upgraded ${fields[tempMovementPosition].name} for $${fields[tempMovementPosition].buyoutPrice} to rank ${fields[tempMovementPosition].rank}.</p>`
          );
          updatePlayerInfo();
          updateMap();
          whoseTurn();
          wait = 0;
          no.removeEventListener("click", handleNoClick2);
          yes.removeEventListener("click", yes.eventListener);
        };
        yes.addEventListener("click", yes.eventListener);
        function handleNoClick2() {
          toggleModal();
          wait = 0;
          whoseTurn();
          // Remove the event listener
          yes.removeEventListener("click", yes.eventListener);
          no.removeEventListener("click", handleNoClick2);
        }
        no.addEventListener("click", handleNoClick2);
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
    updateLog(`<p class="green bold-upper">Player ${winner} won the game!</p>`);
    yes.addEventListener("click", function () {
      location.reload();
    });
    no.addEventListener("click", toggleModal);
  }
}

// Start the game with default players. Press start game button and close the window
startGame("Filip", "Asia", "dasd", "dasdas");
// if (players.length > 0) btn1.style.display = "none";

function whoseTurn() {
  turn.innerHTML = `<p style="font-size: 20px;">It is ${players[currentPlayer].name}'s turn.</p>`;
  let turnWindow = document.getElementById("turn");
  turnWindow.style.display = "flex";
  turnWindow.style.opacity = 1;
  setTimeout(function () {
    turnWindow.style.opacity = 0;
    setTimeout(function () {
      turnWindow.style.display = "none";
    }, 350);
  }, 350);
}

// setInterval(whoseTurn, 100);
