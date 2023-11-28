const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById(
  "new-player-form-container"
);

// Replace 'YOUR COHORT NAME HERE' with your actual cohort name
const cohortName = "2308-ACC-PT-WEB-PT";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */


const fetchAllPlayers = async () => {
  try {
      // Replace 'COHORT-NAME' in the URL with your actual cohort name
      const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      // Return the array of players
      return result.data.players;
  } catch (err) {
      console.error('Uh oh, trouble fetching players!', err);
  }
};


const fetchSinglePlayer = async (playerId) => {
  try {
      // Construct the URL with the cohort name and player ID
      const url = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/${playerId}`;

      // Fetch the player data
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      // Return the player object
      return result.data.player;
  } catch (err) {
      console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};


const addNewPlayer = async (playerObj) => {
  try {
      const url = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;
      const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(playerObj)
      };

      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);

      // Append the new player to the current list without fetching all players again
      renderAllPlayers([...await fetchAllPlayers(), result.data.newPlayer]);
  } catch (err) {
      console.error('Oops, something went wrong with adding that player!', err);
  }
};

const removePlayer = async (playerId) => {
  try {
      const url = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/${playerId}`;
      const options = { method: 'DELETE' };

      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the player's card from the DOM directly
      document.getElementById(`player-${playerId}`).remove();
  } catch (err) {
      console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

const renderAllPlayers = (playerList) => {
  console.log('Rendering players', playerList);
  try {
    const playerContainer = document.getElementById("all-players-container");
    if (!playerContainer) throw new Error("Player container not found");

    // Clear the existing content
    playerContainer.innerHTML = '';

    // Create new HTML for the players and add it to the container
    let playerContainerHTML = playerList.map(player => `
      <div class="player-card" id="player-${player.id}">
        <img src="${player.imageUrl}" alt="${player.name}">
        <h3>${player.name}</h3>
        <p>Breed: ${player.breed}</p>
        <p>Status: ${player.status}</p>
        <button class="details-button" data-player-id="${player.id}">See Details</button>
        <button class="remove-button" data-player-id="${player.id}">Remove from Roster</button>
      </div>
    `).join('');

    playerContainer.innerHTML = playerContainerHTML;

    // Add event listeners to the buttons
    playerContainer.querySelectorAll('.details-button').forEach(button => {
      button.addEventListener('click', () => handleSeeDetails(button.dataset.playerId));
    });

    playerContainer.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', () => handleRemovePlayer(button.dataset.playerId));
    });

  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};


function handleSeeDetails(playerId) {
  fetchSinglePlayer(playerId)
    .then(playerDetails => {
        // Logic to display the player details
        console.log(playerDetails); // Placeholder for actual implementation
    })
    .catch(err => {
        console.error('Error fetching player details:', err);
    });
}

function handleRemovePlayer(playerId) {
  removePlayer(playerId)
    .then(() => {
        console.log(`Player ${playerId} removed`);
        // Re-fetch the list of players to update the UI
        fetchAllPlayers().then(renderAllPlayers);
    })
    .catch(err => {
        console.error('Error removing player:', err);
    });
}

const renderNewPlayerForm = () => {
  try {
    const formContainer = document.getElementById('new-player-form-container');
    if (!formContainer) throw new Error("Form container not found");

    formContainer.innerHTML = `
      <form id="new-player-form">
        <input type="text" id="player-name" placeholder="Player Name" required>
        <input type="text" id="player-breed" placeholder="Breed" required>
        <select id="player-status">
          <option value="field">Field</option>
          <option value="bench">Bench</option>
        </select>
        <input type="url" id="player-image-url" placeholder="Image URL">
        <button type="submit">Add Player</button>
      </form>
    `;

    document.getElementById('new-player-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPlayer = {
        name: document.getElementById('player-name').value,
        breed: document.getElementById('player-breed').value,
        status: document.getElementById('player-status').value,
        imageUrl: document.getElementById('player-image-url').value
      };
      await addNewPlayer(newPlayer);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering the new player form!', err);
  }
};

const init = async () => {
  try {
      const playerList = await fetchAllPlayers();
      renderAllPlayers(playerList);
      renderNewPlayerForm();

  } catch (err) {
      console.error('Initialization error:', err);
  }
};

document.addEventListener('DOMContentLoaded', (event) => {
  init();
});
