// Getting references to DOM elements for displaying players and the new player form
const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Cohort name and API URL configuration
const cohortName = "2308-ACC-PT-WEB-PT";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// Function to fetch all players from the API
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}players`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const players = await response.json();
    return Array.isArray(players) ? players : [];
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
    return []; // Return an empty array in case of an error
  }
};

// Function to fetch a single player's details by their ID
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}players/${playerId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

// Function to add a new player to the database
const addNewPlayer = async (playerObj) => {
    try {
      const response = await fetch(`${APIURL}players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerObj),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error("Oops, something went wrong with adding that player!", err);
    }
  };
  
  // Function to remove a player from the database by their ID
  const removePlayer = async (playerId) => {
    try {
      const response = await fetch(`${APIURL}players/${playerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (err) {
      console.error(
        `Whoops, trouble removing player #${playerId} from the roster!`,
        err
      );
    }
  };
  
  // Function to render all players' details on the web page
  const renderAllPlayers = (playerList) => {
    try {
      if (!Array.isArray(playerList)) {
        throw new Error("playerList is not an array");
      }
  
      let playerContainerHTML = "";
      playerList.forEach((player) => {
        playerContainerHTML += `
                <div class="player-card">
                    <h3>${player.name}</h3>
                    <p>Position: ${player.position}</p>
                    <button onclick="fetchSinglePlayer(${player.id})">See details</button>
                    <button onclick="removePlayer(${player.id})">Remove from roster</button>
                </div>
            `;
      });
      playerContainer.innerHTML = playerContainerHTML;
    } catch (err) {
      console.error("Uh oh, trouble rendering players!", err);
    }
  };
  
  // Function to render a form for adding new players
  const renderNewPlayerForm = () => {
    try {
      const formHTML = `
            <form id="new-player-form">
                <input type="text" id="player-name" placeholder="Player Name" required>
                <input type="text" id="player-position" placeholder="Player Position" required>
                <button type="submit">Add Player</button>
            </form>
        `;
      newPlayerFormContainer.innerHTML = formHTML;
      document
        .getElementById("new-player-form")
        .addEventListener("submit", async (event) => {
          event.preventDefault();
          const playerName = document.getElementById("player-name").value;
          const playerPosition = document.getElementById("player-position").value;
          const newPlayer = { name: playerName, position: playerPosition };
          await addNewPlayer(newPlayer);
          const players = await fetchAllPlayers();
          renderAllPlayers(players);
        });
    } catch (err) {
      console.error("Uh oh, trouble rendering the new player form!", err);
    }
  };