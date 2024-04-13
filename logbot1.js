/*
	npm install dateformat discord.js tail
*/

const { token } = require("./private.json");

const Tail = require("tail").Tail;
const Discord = require("discord.js");
const dateformat = require("dateformat");
const fs = require("fs");

const { Intents } = Discord;
const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Add your allowed Discord user IDs in this array
const allowedUserIDsForMute = ["DiscordID1", "DiscordID2"]; // Add your allowed Discord user IDs here to mute players
const allowedMARKUserIDs = ["DiscordID1", "DiscordID2"]; // Add your allowed Discord user IDs here to mark/nick players

const markedSteamIDsPath = "./markedSteamIDs.json";
const nicknamesPath = "./nicknames.json";
const mutedPlayersPath = "./mutedPlayers.json";
const antiSpamPath = "./antiSpamData.json";
const notificationSubscribersPath = "./notificationSubscribers.json";


const allowedTags = [
  "MoneyBot",
  "Lmaobox",
  "Rijin",
  "Staging", // rijin staging
  "Nitro",
  "Cheater",
  "Furry",
  "Pedo",
  "Bot",
  "Hoster",
  "Brony",
  "Retard",
];
const tagToEmoji = {
  Moneybot: "💰",
  Lmaobox: "📦",
  Rijin: "🇷",
  Staging: "®️", // rijin staging
  Nitro: "🇳",
  Cheater: "⚠️",
  Furry: "🐾",
  Pedo: "🔞",
  Bot: "🤖",
  Hoster: "⭐",
  Brony: "🐎",
  Retard: "🧑‍🦽",
};

const NICKED_TAG = "Nicked"; // (TEMP DATA CAN BE REMOVED)
const NICKED_EMOJI = "🥷"; // (TEMP DATA CAN BE REMOVED)

// Function to read the file
function readFile() {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
    } else {
      console.log("File content:", data);
    }
  });
}

// Function to write to the file
function writeFile(content) {
  fs.writeFile(path, content, "utf8", (err) => {
    if (err) {
      console.error("Failed to write file:", err);
    }
  });
}

let markedSteamIDs = {}; // Initialize as an object

function loadMarkedSteamIDs() {
  fs.readFile(markedSteamIDsPath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        saveMarkedSteamIDs(); // Initialize file if it doesn't exist
      } else {
        console.error("Error reading marked SteamIDs file:", err);
      }
    } else {
      markedSteamIDs = JSON.parse(data);
    }
  });
}

function saveMarkedSteamIDs() {
  fs.writeFile(
    markedSteamIDsPath,
    JSON.stringify(markedSteamIDs, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving marked SteamIDs file:", err);
      }
    },
  );
}

let nicknames = {}; // This will store the nickname mapping

function loadNicknames() {
  fs.readFile(nicknamesPath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Nicknames file not found. Creating new one.");
        saveNicknames(); // Create the file if it doesn't exist
      } else {
        console.error("Error reading nicknames file:", err);
      }
    } else {
      nicknames = JSON.parse(data.toString()); // Parse the JSON data into the nicknames object
    }
  });
}

function saveNicknames() {
  fs.writeFile(nicknamesPath, JSON.stringify(nicknames, null, 2), (err) => {
    if (err) {
      console.error("Error saving nicknames file:", err);
    }
  });
}

function loadMutedPlayers() {
  fs.readFile(mutedPlayersPath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Muted players file not found. Creating new one.");
        saveMutedPlayers(); // Create the file if it doesn't exist
      } else {
        console.error("Error reading muted players file:", err);
      }
    } else {
      muted = JSON.parse(data.toString());
    }
  });
}

function saveMutedPlayers() {
  fs.writeFile(mutedPlayersPath, JSON.stringify(muted, null, 2), (err) => {
    if (err) {
      console.error("Error saving muted players file:", err);
    }
  });
}
function loadAntiSpamData() {
  fs.readFile(antiSpamPath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Anti-spam data file not found. Creating new one.");
        saveAntiSpamData();
      } else {
        console.error("Error reading anti-spam data file:", err);
      }
    } else {
      antiSpamData = JSON.parse(data.toString());
    }
  });
}

function saveAntiSpamData() {
  fs.writeFile(antiSpamPath, JSON.stringify(antiSpamData, null, 2), (err) => {
    if (err) {
      console.error("Error saving anti-spam data file:", err);
    }
  });
}

function saveNotificationSubscribers() {
    const subscribersToSave = {};
    for (const [steamID, userIDs] of Object.entries(notificationSubscribers)) {
        subscribersToSave[steamID] = Array.from(userIDs); // Convert Set to Array for JSON serialization
    }
    fs.writeFile("./notificationSubscribers.json", JSON.stringify(subscribersToSave, null, 2), (err) => {
        if (err) {
            console.error("Error saving notification subscribers:", err);
        }
    });
}


function loadNotificationSubscribers() {
    fs.readFile(notificationSubscribersPath, (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                console.log("Notification subscribers file not found. Creating new one.");
                saveNotificationSubscribers(); // Initialize file if it doesn't exist
            } else {
                console.error("Failed to load notification subscribers:", err);
            }
            return;
        }
        const loadedSubscribers = JSON.parse(data);
        notificationSubscribers = {};
        for (const [steamID, userIDs] of Object.entries(loadedSubscribers)) {
            notificationSubscribers[steamID] = new Set(userIDs); // Convert Array back to Set
        }
    });
}
function ensureNotificationsChannelExists(guild) {
    const channelName = "notifications";
    let channel = guild.channels.cache.find(ch => ch.name === channelName && ch.type === "text");

    if (!channel) {
        guild.channels.create(channelName, {
            type: 'text',
            topic: 'Notifications for user activities.'
        }).then(newChannel => {
            console.log(`Created notifications channel: ${newChannel.name}`);
        }).catch(console.error);
    }
}


loadMarkedSteamIDs();

client.on("ready", () => {
    client.guilds.cache.forEach(guild => {
        ensureNotificationsChannelExists(guild);
    });
  console.log(`Logged in as ${client.user.tag}!`);
  loadNicknames(); 
  loadAntiSpamData();
    loadMutedPlayers();
    ensureAntiSpamChannelExists();
    loadNotificationSubscribers(); 

});

client.login(token);

var queue = [];
var stack = [];

const stack_size = 10;
var stack_iterator = 0;

function splitCSV(csv) {
  let result = [];
  let current = "";
  let quotes = false;
  for (let i = 0; i < csv.length; ++i) {
    if (csv[i] == '"' && csv[i + 1] == '"') {
      current += '"';
      ++i;
      continue;
    }
    if (csv[i] == '"') {
      quotes = !quotes;
      continue;
    }
    if (csv[i] == "," && !quotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += csv[i];
  }
  result.push(current);
  return result;
}

let antiSpamData = {};
let muted = {};
let notificationSubscribers = {};  // This will store which Discord user wants notifications for which SteamID32


function ensureAntiSpamChannelExists() {
  const guild = client.guilds.cache.first(); // Adjust as needed to get the right guild
  const channelName = "antispam";
  const channel = guild.channels.cache.find(
    (ch) => ch.name === channelName && ch.type === "text",
  );

  if (!channel) {
    guild.channels
      .create(channelName, {
        type: "text",
        topic: "Notifications for users muted by anti-spam.",
      })
      .then((newChannel) => {
        newChannel.send(
          "This is where people that were muted by the anti-spam will show up.",
        );
      })
      .catch(console.error);
  }
}

function postAntiSpamAction(steamID) {
    const guild = client.guilds.cache.first(); // Adjust according to your setup
    const channel = guild.channels.cache.find(ch => ch.name === "antispam");
    if (channel) {
        let username = nicknames[steamID] || "Unknown User"; // Adjust "Unknown User" based on how you handle missing usernames
        let tagsDisplay = generateTagsDisplay(steamID);
        let message = `User [U:1:${steamID}] also known as (${username}) with tags ${tagsDisplay} was muted by anti-spam.`;
        channel.send(message);
    }
}


function generateTagsDisplay(steamID) {
  if (markedSteamIDs[steamID] && markedSteamIDs[steamID].length > 0) {
    return `[${markedSteamIDs[steamID].map((tag) => tagToEmoji[tag]).join(", ")}]`;
  }
  return "No Tags";
}

function antiSpam(data) {
  let steamID = data[1];
  if (muted[steamID]) return false; // Already muted
  if (!antiSpamData[steamID]) antiSpamData[steamID] = { count: 0, last: 0 };

  // Reset spam count after a timeout
  if (Date.now() - antiSpamData[steamID].last > 15 * 1000)
    antiSpamData[steamID].count = 0;

  // spam count 
  antiSpamData[steamID].count++;
  antiSpamData[steamID].last = Date.now();

  // Check if user has exceeded spam threshold
  if (antiSpamData[steamID].count > 25) {
    muted[steamID] = true; // Mute the user
    saveMutedPlayers(); // Save the updated mute status
    postAntiSpamAction(steamID); // Post the action to the anti-spam channel
    return false; // Stop processing further messages from this user
  }
  return true; // Continue processing messages if not muted
}

client.on("message", (msg) => {
  if (msg.content.startsWith("!mark")) {
    // Check if the user is allowed to use the command
    if (!allowedMARKUserIDs.includes(msg.author.id)) {
      msg.channel.send("You don't have permission to use this command.");
      return; // Stop the command here
    }

    const args = msg.content.split(" ");
    if (args.length < 3) {
      msg.channel.send("Usage: !mark [SteamID32] [tag]");
      return;
    }
    const steamID = args[1];
    const tag =
      args[2].charAt(0).toUpperCase() + args[2].slice(1).toLowerCase(); // fix for casing problem

    if (!Object.keys(tagToEmoji).includes(tag)) {
      msg.channel.send(
        `Invalid tag. Please use one of the following: ${Object.keys(tagToEmoji).join(", ")}`,
      );
      return;
    }

    if (!markedSteamIDs[steamID]) {
      markedSteamIDs[steamID] = [];
    }

    if (markedSteamIDs[steamID].includes(tag)) {
      msg.channel.send(`SteamID ${steamID} is already marked as ${tag}.`);
      return;
    }

    markedSteamIDs[steamID].push(tag);
    saveMarkedSteamIDs();
    msg.channel.send(
      `Marked SteamID32 ${steamID} with tag '${tag}'. Now tagged as: ${tagToEmoji[tag]}`,
    );
  }
});
client.on("message", (msg) => {
    if (msg.content.startsWith("!unmark")) {
        // Check if the user is allowed to use the command
        if (!allowedMARKUserIDs.includes(msg.author.id)) {
            msg.channel.send("You don't have permission to use this command.");
            return; // Stop the command here
        }

        const args = msg.content.split(" ");
        if (args.length < 3) {
            msg.channel.send("Usage: !unmark [SteamID32] [tag]");
            return;
        }
        const steamID = args[1];
        const tag = args[2].charAt(0).toUpperCase() + args[2].slice(1).toLowerCase(); // Normalize casing

        if (!Object.keys(tagToEmoji).includes(tag)) {
            msg.channel.send(`Invalid tag. Please use one of the following: ${Object.keys(tagToEmoji).join(", ")}`);
            return;
        }

        if (!markedSteamIDs[steamID] || !markedSteamIDs[steamID].includes(tag)) {
            msg.channel.send(`SteamID ${steamID} is not marked with tag '${tag}', or it does not exist.`);
            return;
        }

        // Remove the tag from the array
        markedSteamIDs[steamID] = markedSteamIDs[steamID].filter(t => t !== tag);

        // Optionally: If no more tags left for the SteamID, you might want to completely remove the entry
        if (markedSteamIDs[steamID].length === 0) {
            delete markedSteamIDs[steamID];
        }

        saveMarkedSteamIDs(); // Save changes
        msg.channel.send(`Removed tag '${tag}' from SteamID32 ${steamID}.`);
    }
});

client.on("message", (msg) => {
  if (msg.content.startsWith("!nick")) {
    if (!allowedMARKUserIDs.includes(msg.author.id)) {
      msg.channel.send("You don't have permission to use this command.");
      return;
    }

    const args = msg.content.split(" ");
    if (args.length < 3) {
      msg.channel.send("Usage: !nick [SteamID32] [nickname]");
      return;
    }
    const steamID = args[1];
    const nickname = args.slice(2).join(" "); // Get the nickname from the command

    // Set the nickname in the nicknames object
    nicknames[steamID] = nickname;

    // Save the updated nicknames
    saveNicknames();

    msg.channel.send(
      `Assigned nickname '${nickname}' to SteamID32 ${steamID}.`,
    );
  }
}); 
client.on("message", (msg) => {
    if (msg.content.startsWith("!notif")) {
        const args = msg.content.split(" ");
        if (args.length < 2) {
            msg.channel.send("Usage: !notif [SteamID32]");
            return;
        }
        const steamID = args[1];
        const userID = msg.author.id;

        if (!notificationSubscribers[steamID]) {
            notificationSubscribers[steamID] = new Set();
        }

        if (notificationSubscribers[steamID].has(userID)) {
            msg.channel.send("You are already subscribed to notifications for this SteamID.");
            return;
        }

        notificationSubscribers[steamID].add(userID);
        saveNotificationSubscribers();  // Function to save subscribers to a file
        msg.channel.send(`You will now receive notifications when SteamID32 ${steamID} sends a message.`);
    }
});
client.on("message", (msg) => {
    if (msg.content.startsWith("!unnotif")) {
        const args = msg.content.split(" ");
        if (args.length < 2) {
            msg.channel.send("Usage: !unnotif [SteamID32]");
            return;
        }
        const steamID = args[1];
        const userID = msg.author.id;

        // Check if the steamID is valid and if the user is subscribed
        if (notificationSubscribers[steamID] && notificationSubscribers[steamID].has(userID)) {
            notificationSubscribers[steamID].delete(userID); // Remove the user from the set
            saveNotificationSubscribers();  // Save changes to the JSON file
            msg.channel.send(`You will no longer receive notifications for SteamID32 ${steamID}.`);
        } else {
            msg.channel.send(`You are not subscribed to notifications for SteamID32 ${steamID}, or it does not exist.`);
        }
    }
});



function sanitizeUsername(username) {
  // Replace all emoji characters with a placeholder symbol to stop steam linking problems
  return username.replace(/[\p{Emoji}]/gu, "※");
}

function composeMessage(data) {
    let steamID32 = data[1];
    let rawUsername = nicknames[steamID32] || data[2]; 
    let username = sanitizeUsername(rawUsername); // Sanitize the username to remove emojis and special characters
    let message = data[3];
    let ipcID = data[4];
    let steamID64 = BigInt(steamID32) + 76561197960265728n;

    let tagsDisplay = ""; 
    let tagsList = []; 

    if (nicknames[steamID32]) {
        // Adds "Nicked" to users tag if player is nicked
        tagsList.push("🥷Nicked");
    }

    if (markedSteamIDs[steamID32]) {
        tagsList = tagsList.concat(
            markedSteamIDs[steamID32].map(tag => `${tagToEmoji[tag]} ${tag}`)
        );
    }

    // Formats the tags list if player has multiple
    if (tagsList.length === 1) {
        tagsDisplay = `[${tagsList[0]}] `;
    } else if (tagsList.length > 1) {
        tagsDisplay = `[${tagsList.join(", ")}] `;
    }
    // final message to be sent
    return ` \`[Mechinator ${ipcID}] [U:1:${steamID32}]\` **${tagsDisplay}[${username}](https://steamcommunity.com/profiles/${steamID64}):** ${message}`;
}


function sendNotifications(steamID, message, messageLink) {
    client.guilds.cache.forEach(guild => {
        const channel = guild.channels.cache.find(ch => ch.name === "notifications" && ch.type === "text");
        if (channel) {
            if (notificationSubscribers[steamID]) {
                let username = nicknames[steamID] || "Unknown User"; // Use the nickname if available, otherwise fallback to "Unknown User"
                let tags = markedSteamIDs[steamID];
                let tagsDisplay = generateTagsDisplay(steamID); 

                notificationSubscribers[steamID].forEach(userID => {
                    // Send the notification with username, tags, and message link
                    channel.send(`<@${userID}> New message from ${username} [${tagsDisplay}] (SteamID32 ${steamID}): ${message}\nCheck the message here: ${messageLink}`)
                        .catch(console.error);
                });
            }
        }
    });
}





// Kinda useless but ya
function composeMessageRaw(data) {
  let steamID = data[1];
  let username = data[2];
  let message = data[3];
  let ipcID = data[4];

  return `[Mechinator ${ipcID}] [U:1:${steamID}] ${username}: ${message}`;
}

function test_and_set(msg) {
  var j = stack_iterator;
  for (var i = 0; i < 10; i++) {
    if (stack[j] == msg) return false;
    j++;
    if (j >= stack_size) j = 0;
  }
  stack[stack_iterator++] = msg;
  if (stack_iterator >= stack_size) stack_iterator = 0;
  return true;
}

function onLine(data) {
  try {
    if (test_and_set(data)) {
      queue.push(data);
    }
  } catch (e) {}
}

client.on("message", (msg) => {
  if (msg.content.startsWith("!mute")) {
    // Permission check
    if (!allowedUserIDsForMute.includes(msg.author.id)) {
      msg.channel.send("You do not have permission to use this command.");
      return;
    }

    const args = msg.content.split(" ");
    if (args.length < 2) {
      msg.channel.send("Usage: !mute [SteamID32]");
      return;
    }
    const steamID = args[1];

    // Toggle mute
    muted[steamID] = !muted[steamID];
    saveMutedPlayers(); // Save changes
    const action = muted[steamID] ? "Muting" : "Unmuting";
    msg.channel.send(`${action} [U:1:${steamID}]`);
  }
});

function send() {
    try {
        let msg = "";
        let msgRaw = "";
        if (!queue.length) return;
        while (queue.length) {
            try {
                let csv = queue.shift();
                let data = splitCSV(csv);
                if (!antiSpam(data)) continue;
                let message = composeMessage(data);

                msg += message + "\n";
                msgRaw += composeMessageRaw(data) + "\n";

                let chans = client.channels.cache
                    .filter((channel) => channel.type === "text")
                    .filter((channel) => channel.name === "mechinator-chats")
                    .array();
                for (let channel of chans) {
                    channel.send(msg).then(sentMessage => {
                        // Creates the message to be sent
                        let messageLink = `https://discord.com/channels/${sentMessage.guild.id}/${sentMessage.channel.id}/${sentMessage.id}`;
                        sendNotifications(data[1], data[3], messageLink); // gives the message link to the notifications function
                    });
                }
            } catch (e) {
                console.log("error", e);
            }
        }
        if (msgRaw == "") return;
        try {
            process.stdout.write(msgRaw);
        } catch (e) { }
    } catch (e) { }
}



setInterval(send, 1000);

function onError(error) {
  console.log("ERROR:", error);
}

let watching = {};
var tails = [];

function locateLogs() {
  try {
    fs.readdir("/opt/cathook/data", (error, files) => {
      if (error) {
        console.log(error);
        return;
      }
      for (let file of files) {
        file = "/opt/cathook/data/" + file;
        if (!watching[file] && /chat-.+\.csv/.exec(file)) {
          console.log(`Found log file: ${file}`);
          let tail = new Tail(file);
          tail.on("line", onLine);
          tail.on("error", onError);
          tails.push(tail);
          watching[file] = true;
        }
      }
    });
  } catch (e) {}
}

client.on("ready", () => {
  client.user.setActivity("Mechinator Network", { type: "PLAYING" });
  client.guilds.cache.forEach((guild, str, map) => {
    var has_channel = guild.channels.cache
      .filter((channel) => channel.type === "text")
      .filter((channel) => channel.name === "mechinator-chats")
      .array().length;
    if (!has_channel)
      guild.channels
        .create("mechinator-chats", {
          reason: "Need somewhere to send the salt",
        })
        .then((channel) => {
          console.log("Created salt channel!");
          channel.send(
            "This channel will relay the chat of all bots.\n\nUse !mute (steamid32) in order to (un)mute a given player.\n\nThis command will work from any channel, as long as you have Guild Management permissions.\n\nI Also recommend setting up the permissions such that noone can talk in this channel.",
          );
        })
        .catch(console.error);
  });
});

locateLogs();
setInterval(locateLogs, 20000);
