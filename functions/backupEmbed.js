const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = async function sendBackupEmbed(user, backupFilePath, client) {
  const now = new Date();
  const backupTime = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const embed = new EmbedBuilder()
    .setTitle("Backup Completed")
    .setDescription(`Database berhasil di-backup pada **${backupTime}**.`)
    .setColor(0x00ae86)
    .setTimestamp()
    .setFooter({
      text: "Backup System",
      iconURL: client.user.displayAvatarURL(),
    });

  try {
    await user.send({
      content: "Berikut adalah file backup database Anda:",
      embeds: [embed],
      files: [backupFilePath],
    });

    console.log(`Backup file sent to user: ${user.username}`);
  } finally {
    if (fs.existsSync(backupFilePath)) {
      fs.unlinkSync(backupFilePath);
      console.log(`Backup file deleted: ${backupFilePath}`);
    }
  }
};
