# Mechbot-Logbot

Mechbot-Logbot is a Discord bot designed to manage and monitor chat interactions within your Catbots. It features robust chat log management tools, including spam control, user notifications, and message tracking, all designed to enhance the server management experience.

## Features

- **Tag Management**: Assign tags to SteamIDs for easy identification and filtering.
- **Nickname Management**: Assign and manage nicknames for users, overriding their default Steam usernames.
- **Mute Functionality**: Mute users based on their SteamID to prevent their messages from being processed or shown.
- **Anti-Spam Measures**: Automatically detect and manage spammy behavior.
- **Notification System**: Allows users to subscribe to notifications for messages from specific SteamIDs.
- **Persistent Storage**: Utilizes JSON files to persistently store user data, tags, mute status, and more.

## Installation on Arch Linux

### Prerequisites

- You should have Node.js and npm installed. If not, they can be installed from the Arch repository using pacman:
  ```bash
  sudo pacman -S nodejs npm

- Clone the Mechbot-Logbot repository to your local machine using git. If git is not installed, first install it using pacman:
  ```bash
  sudo pacman -S git

- Then clone the repository:
  ```
  git clone https://github.com/Mechinator/Mechbot-Logbot/
  cd Mechbot-Logbot
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
  pm2 start logbot1.js --name "Mechbot-Logbot"

- To automate the startup of PM2 and your bot on system reboot:
  ```bash
  pm2 startup
  pm2 save
  
## Usage Documentation for Mechbot-Logbot Commands
1. !mark [SteamID32] [tag] <br>
Purpose: Assigns a predefined tag to a specific SteamID32 to categorize users based on behavior or characteristics.
**Usage**:
   ```bash
   !mark [SteamID32] [tag]
   ```
    Note: Tags must be one of the predefined options in the bot's configuration. (More can be added by the user)

2. !unmark [SteamID32] [tag] <br>
Purpose: Removes a previously assigned tag from a SteamID32. <br>
 **Usage**:
    ```bash
    !unmark [SteamID32] [tag]
    ```

3. !nick [SteamID32] [nickname] <br>
Purpose: Assigns a custom nickname to a SteamID32, which will be used in place of their original username in bot communications. <br>
**Usage**:
    ```bash
    !nick [SteamID32] [nickname]
    ```

4. !mute [SteamID32] <br>
Purpose: Toggles the mute status of a SteamID32, preventing or allowing their messages from being processed by the bot.  <br>
 **Usage**:
   ```bash
   !mute [SteamID32]
   ```

5. !notif [SteamID32] <br>
Purpose: Subscribes the user to notifications for messages from a specified SteamID32. <br>
**Usage**:
   ```bash
   !notif [SteamID32]
   ```
   Note: This command can be used by all discord users.

6. !unnotif [SteamID32] <br>
Purpose: Unsubscribes the user from notifications for messages from a specified SteamID32. <br>
**Usage**:
   ```bash
   !unnotif [SteamID32]
   ```
   Note: This command can be used by all discord users.

### General Notes

- **Permissions**: Some commands might require the user to have permissions. Ensure you communicate these requirements in your command descriptions or bot help text.
- **Error Handling**: Clearly inform users of common errors, such as entering an invalid SteamID or a tag that doesn't exist.

By providing detailed usage instructions for each command, users can interact with Mechbot-Logbot more effectively and with less confusion, enhancing their overall experience. <br>
`!help command coming soon`

## To-Dos
- Move Discord UserID permissions into a .json file. (Completed on private version)
- Add !help
- Add !permission mute/mark/nick/admin add/remove (Discord UserID) (Completed on private version)
- Auto keyword pinning
- Relay filtering
- Figure out how to log killfeed on Deltatronics request 😭
- Optimize Performance: Enhance the efficiency and responsiveness of the bot.
- Code Cleanup: Identify and remove obsolete or redundant code segments.
- Bug Fixes: Regularly update the bot to fix bugs and improve functionality.
- Feature Expansion: Continuously add new features based on community feedback.
- Store Usernames: Implement functionality to fetch and store actual usernames from Steam for display purposes.

## User Issues
- If you type the command in a channel and the bot dose not respond you probably didn't set up guild permissions properly, try to dm the bot with the commands.
