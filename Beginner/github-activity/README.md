# GitHub Activity CLI

A simple command-line interface (CLI) tool to fetch and display recent GitHub activity for a user.

---

## Features

- Fetch recent GitHub activity using the GitHub API.
- Display events such as:
  - Pushes
  - Issues
  - Stars
  - Forks
- Handle errors gracefully (e.g., invalid usernames, API failures).
- Provides meaningful output for various GitHub event types.

---

## Installation

### Prerequisites
- **Node.js** (Ensure Node.js is installed. Check using `node -v` and `npm -v`.)

### Steps

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd github-activity
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Link the CLI globally for development:
    ```bash
    npm link
    ```

---

## Usage

Run the CLI tool by passing a GitHub username as an argument:

```bash
github-activity <username>
```

### Example:

```bash
github-activity octocat
```

Output:

```
Recent activity for GitHub user "octocat":

- Pushed 3 commits to octocat/Hello-World
- Opened an issue in octocat/Hello-World
- Starred octocat/Spoon-Knife
- Forked octocat/Spoon-Knife
```

---

## File Structure

```plaintext
github-activity/
├── bin/
│   └── github-activity.js   # CLI entry point
├── src/
│   └── fetchActivity.js     # Logic for making API requests and processing data
├── package.json             # Metadata and dependencies
├── README.md                # Instructions for the tool
└── .gitignore               # Ignored files (e.g., node_modules)
```

---

## Development

### Make CLI Executable

Ensure the CLI is executable by adding a shebang (`#!/usr/bin/env node`) to `bin/github-activity.js` and running:

```bash
chmod +x bin/github-activity.js
```

### Add CLI Command to `package.json`

```json
"bin": {
  "github-activity": "./bin/github-activity.js"
}
```

---

## Error Handling

The CLI handles the following scenarios:

1. **Missing Username**: If no username is provided, the tool shows usage instructions.
   ```bash
   Usage: github-activity <username>
   ```

2. **Invalid Username**: If the username is not found, it notifies the user.
   ```bash
   User "invalidusername" not found.
   ```

3. **API Errors**: If the GitHub API fails or returns an error, the CLI displays an appropriate message.
   ```bash
   Failed to fetch activity: 500
   ```

---

## Future Enhancements

- Add support for GitHub API authentication (to handle rate limits).
- Filter events by type (e.g., `--push`, `--issues`).
- Cache results locally to improve performance.
- Display additional user details, such as repositories and followers.

---

## License

This project is open source and available under the [MIT License](LICENSE).

