const https = require('https'); // Use the HTTPS module to make API requests

// Function to fetch GitHub activity
function fetchActivity(username) {
  // GitHub API URL for user events
  const apiUrl = `https://api.github.com/users/${username}/events`;

  // Set the required HTTP headers
  const options = {
    headers: {
      'User-Agent': 'Node.js CLI', // User-Agent header to prevent API errors
    },
  };

  // Make a GET request to the API
  https
    .get(apiUrl, options, (res) => {
      let data = '';

      // Accumulate data chunks from the response
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Process the response once fully received
      res.on('end', () => {
        if (res.statusCode === 200) { // Check if the request was successful
          try {
            const events = JSON.parse(data); // Parse the JSON response

            // Handle case where no activity is found
            if (events.length === 0) {
              console.log(`No recent activity found for user "${username}".`);
              return;
            }

            console.log(`Recent activity for GitHub user "${username}":\n`);

            // Loop through the events and display relevant details
            events.forEach((event) => {
              switch (event.type) {
                case 'PushEvent': // For push events, show commit count and repo
                  console.log(
                    `- Pushed ${event.payload.commits.length} commits to ${event.repo.name}`
                  );
                  break;
                case 'IssuesEvent': // For issues, show action and repo
                  console.log(
                    `- ${event.payload.action} an issue in ${event.repo.name}`
                  );
                  break;
                case 'WatchEvent': // For watch events, show starred repo
                  console.log(`- Starred ${event.repo.name}`);
                  break;
                case 'ForkEvent': // For fork events, show forked repo
                  console.log(`- Forked ${event.repo.name}`);
                  break;
                default: // For other events, show the type and repo
                  console.log(`- ${event.type} in ${event.repo.name}`);
              }
            });
          } catch (error) {
            console.error('Error parsing response:', error.message);
          }
        } else if (res.statusCode === 404) {
          console.error(`User "${username}" not found.`);
        } else {
          console.error(`Failed to fetch activity: ${res.statusCode}`);
        }
      });
    })
    .on('error', (err) => {
      console.error('Error fetching data:', err.message);
    });
}

// Export the function so it can be used in other files
module.exports = fetchActivity;
