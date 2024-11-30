const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("paneldatabase")
      .setDescription(
        "Menampilkan panel untuk mengelola database, termasuk backup dan query SQL."
      ),
    async execute( interaction, client) {
      try {
        await interaction.deferReply({ ephemeral: false });
  
        const embed = new EmbedBuilder()
          .setTitle("📂 Panel Database")
          .setDescription(
            "**Panel Database** menyediakan dua fitur penting untuk pengelolaan database Anda:\n\n" +
              "🔒 **Backup Database**\n" +
              "Backup database adalah langkah penting untuk menjaga integritas dan keamanan data Anda. Dengan fitur ini, " +
              "sistem akan membuat file cadangan database terbaru dan mengirimkannya langsung ke DM Anda.\n\n" +
              "**Cara Penggunaan Backup:**\n" +
              "1. Tekan tombol **Backup** di bawah.\n" +
              "2. Tunggu beberapa saat hingga proses selesai.\n" +
              "3. File cadangan akan dikirim langsung melalui DM Anda.\n\n" +
              "🛠 **SQL Query Execution**\n" +
              "Fitur ini memungkinkan Anda menjalankan query SQL langsung pada database, seperti membuat, menghapus, atau memodifikasi tabel/data. " +
              "Gunakan fitur ini dengan hati-hati untuk menghindari perubahan data yang tidak disengaja.\n\n" +
              "**Cara Penggunaan Query:**\n" +
              "1. Tekan tombol **Query** di bawah.\n" +
              "2. Isi modal yang muncul dengan query SQL yang valid (contoh: `SELECT * FROM users;`).\n" +
              "3. Klik submit untuk menjalankan query, dan hasilnya akan dikirimkan langsung melalui balasan bot."
          )
          .setColor(0x2F3136)
          .setTimestamp()
          .setFooter({
            text: "Database System",
          });
  
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("backup")
            .setLabel("Backup Database")
            .setStyle(ButtonStyle.Success),
  
          new ButtonBuilder()
            .setCustomId("query_sql")
            .setLabel("📝 Query")
            .setStyle(ButtonStyle.Danger)
        );
  
        await interaction.editReply({ embeds: [embed], components: [row] });
      } catch (error) {
        console.error("Error saat menjalankan perintah paneldatabase:", error);
        await interaction.editReply({
          content:
            "Terjadi kesalahan saat menjalankan perintah ini. Silakan coba lagi nanti.",
          ephemeral: true,
        });
      }
    },
  };
  