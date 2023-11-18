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

