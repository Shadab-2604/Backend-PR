#!/usr/bin/env node  // Shebang line to make the file executable

// Import the function to fetch GitHub activity
const fetchActivity = require('../src/fetchActivity');

// Read the GitHub username from command-line arguments
const username = process.argv[2];

// Check if a username is provided
if (!username) {
  console.error('Usage: github-activity <username>');
  process.exit(1); // Exit with an error if no username is provided
}

// Call the function to fetch and display activity
fetchActivity(username);
