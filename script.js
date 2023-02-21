"use strict";

// NEW BRANCH

//BUG when 2 players were in prison skipturn triggered undefined on another field where penalty was supposed to be paid
//NOTE

//create button that triggers popup that covers whole map.
//use similar logic and display player properties
//loop through the properties and on click trigger another popup
// in that popup input an amount and transfer the property and update. or close modal

// offer player a way to sell his property, maybe when he is about to lose?
// when player dies do not remove him from the board until the next turn
// CSS make it look nicer
//NOTE

// OPTIONS
const sidesOfDie = 3; // Do not increase to more than 4 -- // lap logic implemented only for up to 2x4 side die
const timesPenalty = 0.5;
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
const buyPopup = document.getElementById("buyPopup");

let currentPlayer = 0; // define whose turn it is
let tempPosition; // players position before roll
let tempMovementPosition = 0; // players position after roll
let tempPositionInArray = 0; // players position in players array
let currentRoll = 0; //
let buyer = 0; // current player frozen in time when property buyout popup message appears, currentPlayer already changed its value to next player
let players = []; // will be filled with players object
let winner = null;
let roll1 = 0;
let roll2 = 0;
let prisonRoll = 0; // if you rolled the same number twice the count goes up, at 2 you go to prison
// Empty messages
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
// let fields = [
//   {
//     number: 0,
//     name: "Start Field",
//     occupied: [],
//     owned: false,
//     action: startMoney,
//     isPlayerDead: isPlayerDead,
//   },
//   {
//     number: 1,
//     name: "Slum Street",
//     occupied: [],
//     owned: false,
//     ownedby: null,
//     buyoutPrice: 100,
//     penalty: 500 * timesPenalty,
//     action: streetAction,
//     isPlayerDead: isPlayerDead,
//   },
//   {
//     number: 2,
//     name: "Community Chest",
//     occupied: [],
//     owned: false,
//     ownedby: null,
//     action: community,
//     isPlayerDead: isPlayerDead,
//   },
//   {
//     number: 3,
//     name: "Poor Street",
//     occupied: [],
//     owned: false,
//     ownedby: null,
//     buyoutPrice: 400,
//     penalty: 700 * timesPenalty,
//     action: streetAction,
//     isPlayerDead: isPlayerDead,
//   },
//   {
//     number: 4,
//     name: "Parking Lot",
//     occupied: [],
//     owned: false,
//     action: function () {},
//     isPlayerDead: isPlayerDead,
//   },
//   {
//     number: 5,
//     name: "Regular Street",
//     occupied: [],
//     owned: false,
//     ownedby: null,
//     buyoutPrice: 500,
//     penalty: 800 * timesPenalty,
//     action: streetAction,
//     isPlayerDead: isPlayerDead,
//   },
//   {
//     number: 6,
//     name: "Prison",
//     occupied: [],
//     owned: false,
//     action: function () {},
//     isPlayerDead: isPlayerDead,
//   },
//   {
//     number: 7,
//     name: "Fancy Street",
//     occupied: [],
//     owned: false,
//     ownedby: null,
//     buyoutPrice: 400,
//     penalty: 1000 * timesPenalty,
//     action: streetAction,
//     isPlayerDead: isPlayerDead,
//   },
// ];

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
// Create and update the map based on the fields array and the occupied property
function updateMap() {
  map.innerHTML = `
  <div class="row">

  <div class="field-0 fielddiv">
  <p class="field-name">Start</p>
  <div class="pawnzone">
  <ul class="field-player">${fields[0].occupied
    .map((player) => `<li>${player}</li>`)
    .join("")}</ul>
  </div>
  </div>
  
  <div class="field-1 fielddiv">
  <p class="field-name">Slum Street 1</p>
  <div class="pawnzone">
    <ul class="field-player">${fields[1].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul>
      </div>
    <div class="slumst"><p class="fieldinfoprice">Buyout: $${
      fields[1].buyoutPrice
    }, Penalty: $${fields[1].penalty}</p></div>
${
  fields[1].owned
    ? `<div class="ownedby"><p class="little">Owned by: ${fields[1].ownedby}</p></div>`
    : ""
}
  </div>
  
  <div class="field-2 fielddiv"><p class="field-name">Slum Street 2</p>
  <div class="pawnzone">
  <ul class="field-player">${fields[2].occupied
    .map((player) => `<li>${player}</li>`)
    .join("")}</ul>
    </div>
  <div class="slumst"><p class="fieldinfoprice">Buyout: $${
    fields[2].buyoutPrice
  }, Penalty: $${fields[2].penalty}</p></div>
${
  fields[2].owned
    ? `<div class="ownedby"><p class="little">Owned by: ${fields[2].ownedby}</p></div>`
    : ""
}
</div>

<div class="field-3 fielddiv"><p class="field-name">Community Chest</p>
<div class="pawnzone">
  <ul class="field-player">${fields[3].occupied
    .map((player) => `<li>${player}</li>`)
    .join("")}</ul>
    </div>
</div>
</div>

<div class="row">

  <div class="field-11 fielddiv">
  <p class="field-name">Fancy Street 2</p>
  <div class="pawnzone">
    <ul class="field-player">${fields[11].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul>
      </div>
    <div class="fancyst"><p class="fieldinfoprice">Buyout: $${
      fields[11].buyoutPrice
    }, Penalty: $${fields[11].penalty}</p></div>
  ${
    fields[11].owned
      ? `<div class="ownedby"><p class="little">Owned by: ${fields[11].ownedby}</p></div>`
      : ""
  }
  </div>
  

  <div class=" fielddiv">
  <p class="field-name">MONOPOLY</p></div>

  <div class=" fielddiv">
  <p class="field-name">MONOPOLY</p></div>

  <div class="field-4 fielddiv">
  <p class="field-name">Poor Street 1<p>
  <div class="pawnzone">
    <ul class="field-player">${fields[4].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul></p>    
      </div>    
    <div class="poorst"><p class="fieldinfoprice">Buyout: $${
      fields[4].buyoutPrice
    }, Penalty: $${fields[4].penalty}</p></div>
  ${
    fields[4].owned
      ? `<div class="ownedby"><p class="little">Owned by: ${fields[4].ownedby}</p></div>`
      : ""
  }
  </div>
</div>

<div class="row">

  <div class="field-10 fielddiv">
  <p class="field-name">Fancy Street</p>
  <div class="pawnzone">
    <ul class="field-player">${fields[10].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul>
      </div>
    <div class="fancyst"><p class="fieldinfoprice">Buyout: $${
      fields[10].buyoutPrice
    }, Penalty: $${fields[10].penalty}</p></div>
  ${
    fields[10].owned
      ? `<div class="ownedby"><p class="little">Owned by: ${fields[10].ownedby}</p></div>`
      : ""
  }
  </div>
  

  <div class="fielddiv">
  <p class="field-name">MONOPOLY</p></div>

  <div class="fielddiv">
  <p class="field-name">MONOPOLY</p></div>

  <div class="field-5 fielddiv">
  <p class="field-name">Poor Street 2<p>
  <div class="pawnzone">
    <ul class="field-player">${fields[5].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul></p>    
      </div>    
    <div class="poorst"><p class="fieldinfoprice">Buyout: $${
      fields[5].buyoutPrice
    }, Penalty: $${fields[5].penalty}</p></div>
  ${
    fields[5].owned
      ? `<div class="ownedby"><p class="little">Owned by: ${fields[5].ownedby}</p></div>`
      : ""
  }
  </div>
</div>

<div class="row">

<div class="field-9 fielddiv">
<p class="field-name">Prison</p>
<div class="pawnzone">
  <ul class="field-player">${fields[9].occupied
    .map((player) => `<li>${player}</li>`)
    .join("")}</ul>
    </div>
</div>

<div class="field-8 fielddiv">
  <p class="field-name">Regular Street 2</p>
  <div class="pawnzone">
    <ul class="field-player">${fields[8].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul>
      </div>
    <div class="regularst"><p class="fieldinfoprice">Buyout: $${
      fields[8].buyoutPrice
    }, Penalty: $${fields[8].penalty}</p></div>
  ${
    fields[8].owned
      ? `<div class="ownedby"><p class="little">Owned by: ${fields[8].ownedby}</p></div>`
      : ""
  }
  </div>


  <div class="field-7 fielddiv">
  <p class="field-name">Regular Street</p>
  <div class="pawnzone">
    <ul class="field-player">${fields[7].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul>
      </div>
    <div class="regularst"><p class="fieldinfoprice">Buyout: $${
      fields[7].buyoutPrice
    }, Penalty: $${fields[7].penalty}</p></div>
  ${
    fields[7].owned
      ? `<div class="ownedby"><p class="little">Owned by: ${fields[7].ownedby}</p></div>`
      : ""
  }
  </div>

  <div class="field-6 fielddiv">
  <p class="field-name">Parking Lot</p>
  <div class="pawnzone">
    <ul class="field-player">${fields[6].occupied
      .map((player) => `<li>${player}</li>`)
      .join("")}</ul>
      </div>
  </div>
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
  btn2.style.display = "block";
});
// Roll the dice button
btn2.addEventListener("click", movePlayer);
// Roll the dice with r button
document.addEventListener("keydown", function (e) {
  e.key === "r" &&
    btn2.style.display === "block" &&
    modal.classList.contains("hidden") &&
    !winner &&
    movePlayer();
});
//
//NOTE Move player - most complex function that triggers other functions or methods
//
function movePlayer() {
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
    players[currentPlayer].position =
      players[currentPlayer].position + currentRoll - 12; // update player position
    fields[0].action();
    fields[0].isPlayerDead();
    if (tempPosition + currentRoll - 12 !== 0) {
      tempMovementPosition = tempPosition + currentRoll - 12;
      fields[tempPosition + currentRoll - 12].action();
      fields[tempPosition + currentRoll - 12].isPlayerDead();
    }
  } else {
    tempMovementPosition = tempPosition + currentRoll;
    //if you have not reached the start
    fields[tempPosition + currentRoll].occupied.push(
      players[currentPlayer].name
    ); // insert that player
    players[currentPlayer].position =
      players[currentPlayer].position + currentRoll; // update player position
    fields[tempPosition + currentRoll].action(); // run a field specific function
    fields[tempPosition + currentRoll].isPlayerDead();
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
  updatePlayerInfo();
}
// Roll 2 dice - run by another function
function rollTwoDice() {
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

  document.getElementById("dieBorder1").style.display = "block";
  document.getElementById("dieBorder2").style.display = "block";

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
    } else {
      currentPlayer++;
    }
  }
}
// Update the player scoreboard

function updatePlayerInfo() {
  let moreHtml = "";
  for (let i = 0; i < players.length; i++) {
    let html = `<h3>Player ${i + 1}: ${players[i].name}</h3>
    <p>Money: $${players[i].money}</p>`;
    if (players[i].properties.length > 0) {
      html += `<p>Current properties:</p><ul>`;
      for (let j = 0; j < players[i].properties.length; j++) {
        html += `<li><button class="buyButton button${j}" data-player="${i}">${players[i].properties[j]}</button></li>`;
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

  let buttons = document.querySelectorAll(".buyButton");
  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      let playerIndex = event.target.dataset.player;
      let player = players[playerIndex];
      // Do something with player object
      console.log(player);
    });
  });
}
// toggle the buy property or game finisehd popup
const toggleModal = function () {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
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
  if (generatedNumbers.length === 3) {
    generatedNumbers = [];
  }
  // Generate random number
  let randomNumber = Math.floor(Math.random() * 3) + 1;
  // Keep generating if the card was already used
  while (generatedNumbers.includes(randomNumber)) {
    randomNumber = Math.floor(Math.random() * 3) + 1;
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
    communityMsg = `<p class="red">${players[currentPlayer].name}, you were mugged and lost $500.</p>`;
  } else if (randomNumber === 3) {
    // set prison turns to 2
    players[currentPlayer].prison = 2;
    fields[3].occupied.pop();
    fields[9].occupied.push(players[currentPlayer].name); // insert that player
    players[currentPlayer].position = 9; // update player position
    communityMsg = `<p class="red">${players[currentPlayer].name}, you went through a red light. You're going to prison for 2 turns!<p>`;
  }
}
// Buy the street, visit the street that you own or pay the penalty if you do not
function streetAction() {
  if (!this.owned && players[buyer].money >= this.buyoutPrice) {
    // Buy this field if criteria are met
    toggleModal();
    generatePopupMsg(
      `${players[currentPlayer].name}, you rolled ${currentRoll}, moved from ${fields[tempPosition].name} to ${this.name}. You have a chance to buy this property for $${this.buyoutPrice}.`
    );
    yes.removeEventListener("click", yes.eventListener);
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
    };
    yes.addEventListener("click", yes.eventListener);
    no.removeEventListener("click", toggleModal);
    no.addEventListener("click", toggleModal);
  } else if (this.ownedby === players[currentPlayer].name) {
    // If you own this street and visit it
    welcomeHomeMsg = "<p>Welcome home.</p>";
    upgradeProperty();
  } else {
    propertyPenaltyMsg = `<p class="red">${players[currentPlayer].name}, you entered ${this.ownedby}'s property: ${this.name}, and had to pay ${this.penalty}.</p>`;
    // If the player cannot afford to pay the penalty in full only take his remaining money
    //IMPORTANT BUG doesnt work
    if (players[currentPlayer].money < this.penalty) {
      players.find((player) => player.name === this.ownedby).money =
        players.find((player) => player.name === this.ownedby).money +
        players[currentPlayer].money;
    } else {
      // If player can afford the penalty substract the penalty amount from his account
      players.find((player) => player.name === this.ownedby).money =
        players.find((player) => player.name === this.ownedby).money +
        this.penalty;
    }
    // Substract the penaly from the player even if it brings it below zero - display the final blow
    players[currentPlayer].money = players[currentPlayer].money - this.penalty;
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
    yes.removeEventListener("click", yes.eventListener);
    yes.addEventListener("click", function () {
      location.reload();
    });
    generatePopupMsg(
      `Player ${winner} won! Do you want to start another game?`
    );
    btn2.style.display = "none";
    updateLog(`<p class="green bold-upper">Player ${winner} won the game!</p>`);
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
        fields[tempMovementPosition - 1].ownedby ||
      fields[tempMovementPosition].ownedby ===
        fields[tempMovementPosition + 1].ownedby
    ) {
      if (
        fields[tempMovementPosition].rank < 4 &&
        players[buyer].money >= fields[tempMovementPosition].buyoutPrice
      ) {
        toggleModal();
        generatePopupMsg(
          `You can upgrade this property for $${fields[tempMovementPosition].buyoutPrice}.`
        );
        yes.removeEventListener("click", yes.eventListener);
        yes.eventListener = () => {
          toggleModal();
          players[buyer].money =
            players[buyer].money - fields[tempMovementPosition].buyoutPrice;
          fields[tempMovementPosition].rank += 1;
          fields[tempMovementPosition].penalty *= 1.25;
          fields[tempMovementPosition].penalty = Math.floor(
            fields[tempMovementPosition].penalty
          );
          updateLog(
            `<p class="green">${players[buyer].name} upgraded ${fields[tempMovementPosition].name} for $${fields[tempMovementPosition].buyoutPrice} to rank ${fields[tempMovementPosition].rank}.</p>`
          );
          updatePlayerInfo();
          updateMap();
        };
        yes.addEventListener("click", yes.eventListener);
        no.removeEventListener("click", toggleModal);
        no.addEventListener("click", toggleModal);
      }
    }
  }
}

// Start the game with default players. Press start game button and close the window
// startGame("1Filip", "2Asia", "3Wojtek", "4Joanna");
startGame("1Filip", "2Asia");
