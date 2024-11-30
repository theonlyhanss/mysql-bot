const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const { startAutoBackup, stopAutoBackup } = require("../functions/autoBackup");
require("dotenv").config();

const configPath = path.join(__dirname, "..", "config", "backupConfig.json");

const { ADMIN_ROLE_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("backuptime")
    .setDescription("Atur waktu backup otomatis.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Jenis waktu backup (minute, hour, day, date).")
        .setRequired(true)
        .addChoices(
          { name: "Minute", value: "minute" },
          { name: "Hour", value: "hour" },
          { name: "Day (per week)", value: "day" },
          { name: "Date (per month)", value: "date" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("value")
        .setDescription("Nilai interval untuk jenis waktu yang dipilih.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.guild.members.cache.get(interaction.user.id);

    if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
      return interaction.reply({
        content: "Kamu tidak memiliki izin untuk melakukan ini.",
        ephemeral: true,
      });
    }

    const type = interaction.options.getString("type");
    const value = interaction.options.getInteger("value");
    const client = interaction.client;

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.interval = { type, value };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    stopAutoBackup();
    if (config.enabled) {
      startAutoBackup(client, config.interval);
    }

    await interaction.reply(
      `Backup otomatis diatur ke setiap ${value} ${type}(s).`
    );
  },
};
