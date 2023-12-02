const { EmbedBuilder } = require("discord.js");
const db = require("croxydb");
const fs = require("fs");
const config = require("../config.json");
const chalk = require("chalk");
module.exports = async (client, interaction) => {

  if (interaction.isChatInputCommand()) {

    if (!interaction.guildId) return;

    fs.readdirSync("./commands").forEach(file => {

      const cmd = require(`../commands/${file}`);

      if (interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {
        return cmd.run(client, interaction, db);
      }
    });
  }
};