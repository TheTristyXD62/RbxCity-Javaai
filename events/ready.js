const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const config = require("../config.json");
const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const chalk = require("chalk");

const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"]
  },
  partials: PARTIALS,
  retryLimit: 3
});

module.exports = async (client) => {
  const rest = new REST({ version: "10" }).setToken(config.bot.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (e) {
    console.error(e);
  }
  
  console.log(chalk.green("[BAŞLADI]", chalk.white(`${client.user.tag} bot aktif edildi.`)));

  setInterval(async () => {
    const x = ["Kalitenin Adresi RbxCity <3"]
        const random = x [
      Math.floor(Math.random() * x.length)];
      client.user.setPresence({
        activities: [{ name: `${random}`, tpye: ActivityType.Listening }],
        status: "dnd"
      })
  }, 15000);
};