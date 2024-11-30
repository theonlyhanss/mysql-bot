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
    .setName("togbackup")
    .setDescription("Aktifkan atau nonaktifkan backup otomatis.")
    .addBooleanOption((option) =>
      option
        .setName("status")
        .setDescription(
          "Aktifkan (true) atau nonaktifkan (false) backup otomatis."
        )
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

    const status = interaction.options.getBoolean("status");
    const client = interaction.client;

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.enabled = status;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    if (!status) {
      stopAutoBackup();
    } else {
      const intervalConfig = config.interval;
      if (intervalConfig) {
        startAutoBackup(client, intervalConfig);
      } else {
        console.log(
          "Interval backup belum diatur. Tidak dapat memulai backup otomatis."
        );
      }
    }

    // Kirim balasan
    await interaction.reply(
      `Backup otomatis telah ${status ? "diaktifkan" : "dinonaktifkan"}.`
    );
  },
};
