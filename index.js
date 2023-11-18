const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = '2308-ACC-PT-WEB-PT';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const state = {
    players: [],
};

// Fetch All Players
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        if (!response.ok) {
            throw new Error('Failed to fetch players');
        }
        const result = await response.json();
        state.players = result.data.players;
        renderAllPlayers();
    } catch (error) {
        console.error('Error fetching players:', error);
    }
};

// Fetch Single Player
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const playerData = await response.json();
        // Display player details as needed
        alert(`Player Details: \nName: ${playerData.name}\nBreed: ${playerData.breed}`);
    } catch (err) {
        console.error(`Error fetching player #${playerId}`, err);
    }
};

// Add New Player
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        await fetchAllPlayers(); // Refresh the player list
    } catch (err) {
        console.error('Error adding new player', err);
    }
};

// Remove Player
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        await fetchAllPlayers(); // Refresh the player list
    } catch (err) {
        console.error(`Error removing player #${playerId}`, err);
    }
};

// Render All Players
const renderAllPlayers = () => {
    let playerContainerHTML = '';
    state.players.forEach(player => {
        playerContainerHTML += `
            <div class="player-card">
                <h3>${player.name}</h3>
                <button onclick="fetchSinglePlayer(${player.id})">See details</button>
                <button onclick="removePlayer(${player.id})">Remove from roster</button>
            </div>`;
    });
    playerContainer.innerHTML = playerContainerHTML || '<p>No players to display.</p>';
};

// Render New Player Form
const renderNewPlayerForm = () => {
    newPlayerFormContainer.innerHTML = `
        <form id="newPlayerForm">
            <input type="text" id="playerName" placeholder="Player Name" required>
            <button type="submit">Add Player</button>
        </form>
    `;
    document.getElementById('newPlayerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const playerName = document.getElementById('playerName').value;
        await addNewPlayer({ name: playerName });
        document.getElementById('playerName').value = ''; // Clear the input field
    });
};

const init = async () => {
    await fetchAllPlayers();
    renderNewPlayerForm();
};

init();
