const { Client, GatewayIntentBits, InteractionType, IntentsBitField, Partials, PermissionsBitField, EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AuditLogEvent, ActionRowBuilder, messageLink, ChannelType, ButtonComponent, ButtonStyle } = require("discord.js");
const fs = require("fs");

    const client = new Client({
        intents: Object.values(IntentsBitField.Flags),
        partials: Object.values(Partials)
    });

const db = require("croxydb");
const config = require("./config.json");
const chalk = require("chalk");

global.client = client;
client.commands = (global.commands = []);

fs.readdirSync("./commands").forEach(file => {
    if (!file.endsWith(".js")) return;

    const commands = require(`./commands/${file}`);

    client.commands.push({
        name: commands.name.toLowerCase(),
        description: commands.description,
        options: commands.options,
        dm_permission: false,
        type: 1
    });
    console.log(chalk.red("[KOMUTLAR]", chalk.white(`${commands.name} komutunu yükledim.`)))
});

fs.readdirSync("./events").forEach(event => {

    const eve = require(`./events/${event}`);
    const name = event.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(chalk.blue("[EVENTLER]", chalk.white(`${name} eventini yükledim.`)))
});

process.on("unhandledRejection", async (error) => {
    return console.log(chalk.red("[HATA]"), chalk.white(`Bir hata ile karşılaştım!\n\n${error}`))
});

client.login(config.bot.token);

const modal = new ModalBuilder()
  .setCustomId("form")
  .setTitle("Rbx City | Yapay Zeka Soru");
const a1 = new TextInputBuilder()
  .setCustomId("a1")
  .setLabel("Soru")
  .setStyle(TextInputStyle.Paragraph)
  .setPlaceholder("Sorunuzu giriniz.")
  .setRequired(true);

const row = new ActionRowBuilder().addComponents(a1);
modal.addComponents(row);

client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName === "soru") {
    await interaction.showModal(modal);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === "form") {
      const { Hercai } = require("hercai");
      const herc = new Hercai();
      const soru_data = interaction.fields.getTextInputValue("a1");
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("Yükleniyor")
        .setDescription("Cevap yükleniyor.");

      const load = await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });

      try {
        const sorus = await herc.question({
          model: "v3-beta",
          content: soru_data,
        });
        setTimeout(() => {
          const txt = sorus.reply || "Soru alınamadı.";

          const asd = txt.slice(0, 4000);
          const embeds = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Rbx City | Yapay Zeka Sohbet")
            .setDescription(`**${asd}**`);

          load.edit({
            embeds: [embeds],
            ephemeral: true,
          });
        }, 3000);
      } catch (slenzy) {
        console.error(slenzy);
      }
    }
  }
});