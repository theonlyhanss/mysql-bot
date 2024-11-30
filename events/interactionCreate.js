const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const backupDatabase = require("../functions/backupDatabase");
const sendBackupEmbed = require("../functions/backupEmbed");
const executeSQLQuery = require("../functions/executeSQLQuery");
require("dotenv").config();

const { ADMIN_ROLE_ID } = process.env;

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Terjadi kesalahan saat mengeksekusi perintah ini!",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === "backup") {
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
          return interaction.reply({
            content: "Kamu tidak memiliki izin untuk melakukan backup.",
            ephemeral: true,
          });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
          const backupFilePath = await backupDatabase();
          await sendBackupEmbed(
            interaction.user,
            backupFilePath,
            interaction.client
          );
          await interaction.editReply({
            content: "Backup selesai! File telah dikirim ke DM Anda.",
            ephemeral: true,
          });
        } catch (error) {
          console.error(error);
          await interaction.editReply({
            content: "Terjadi kesalahan saat melakukan backup.",
            ephemeral: true,
          });
        }
      } else if (interaction.customId === "query_sql") {
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
          return interaction.reply({
            content: "Kamu tidak memiliki izin untuk melakukan ini.",
            ephemeral: true,
          });
        }
        const modal = new ModalBuilder()
          .setCustomId("sql_modal")
          .setTitle("Eksekusi Query SQL");

        const sqlInput = new TextInputBuilder()
          .setCustomId("sql_query")
          .setLabel("Masukkan Query SQL")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Contoh: SELECT * FROM `banneds` WHERE 1")
          .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(sqlInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "sql_modal") {
        const sqlQuery = interaction.fields.getTextInputValue("sql_query");

        await interaction.deferReply({ ephemeral: true });

        try {
          const result = await executeSQLQuery(sqlQuery);
          await interaction.editReply({
            content: `Query berhasil dijalankan. Hasil:\n\`\`\`\n${result}\n\`\`\``,
            ephemeral: true,
          });
        } catch (error) {
          console.error(error);
          await interaction.editReply({
            content: `Terjadi kesalahan saat menjalankan query:\n\`\`\`\n${error.message}\n\`\`\``,
            ephemeral: true,
          });
        }
      }
    }
  },
};
