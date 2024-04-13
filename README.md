# Mechbot-Logbot

Mechbot-Lobot is a Discord bot designed to manage and monitor chat interactions within gaming communities, specifically tailored for Steam-based game servers. It features robust chat management tools, including spam control, user notifications, and message tracking, all designed to enhance the server management experience.

## Features

- **Tag Management**: Assign tags to SteamIDs for easy identification and filtering.
- **Nickname Management**: Assign and manage nicknames for users, overriding their default Steam usernames.
- **Mute Functionality**: Mute users based on their SteamID to prevent their messages from being processed or shown.
- **Anti-Spam Measures**: Automatically detect and manage spammy behavior.
- **Notification System**: Allows users to subscribe to notifications for messages from specific SteamIDs.
- **Persistent Storage**: Utilizes JSON files to persistently store user data, tags, mute status, and more.

## Installation and Usage on Arch Linux

### Prerequisites

- You should have Node.js and npm installed. If not, they can be installed from the Arch repository using pacman:
  ```bash
  sudo pacman -S nodejs npm

- Clone the Mechbot-Lobot repository to your local machine using git. If git is not installed, first install it using pacman:
  ```bash
  sudo pacman -S git

- Then clone the repository:
  ```
  git clone https://github.com/yourusername/Mechbot-Lobot.git
  cd Mechbot-Lobot
- Install the necessary Node.js dependencies specified in the package.json file:
  ```bash
  npm install

- Create a private.json file in the root directory to store sensitive configuration details such as your Discord bot token:
  ```json
  {
    "token": "YOUR_BOT_TOKEN_HERE"
  }
  ```
- Open logbot1.js and go to line 18/19 and add your Discord UserID so you have accses to commands
  ```javascript
  const allowedUserIDsForMute = ["DiscordID1", "DiscordID2"]; // Add your allowed Discord user IDs here to mute players
  const allowedMARKUserIDs = ["DiscordID1", "DiscordID2"]; // Add your allowed Discord user IDs here to mark/nick players
  ```
- PM2 is a process manager for Node.js applications and can be used to easily manage your bot's lifecycle. Install PM2 via npm:

  ```bash
  sudo npm install pm2 -g

- Start the bot using PM2 to ensure it runs in the background:

  ```bash
  pm2 start logbot.js --name "Mechbot-Lobot"

- To automate the startup of PM2 and your bot on system reboot:
  ```bash
  pm2 startup
  pm2 save

## To-Dos
- Move Discord UserID permissions into a .json file.
- Optimize Performance: Enhance the efficiency and responsiveness of the bot.
- Code Cleanup: Identify and remove obsolete or redundant code segments.
- Bug Fixes: Regularly update the bot to fix bugs and improve functionality.
- Feature Expansion: Continuously add new features based on community feedback.
- Store Usernames: Implement functionality to fetch and store actual usernames from Steam for display purposes.
