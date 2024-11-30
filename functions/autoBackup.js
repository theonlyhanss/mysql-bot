const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const backupDatabase = require("./backupDatabase");
require("dotenv").config();

let backupInterval = null;

const CHANNEL_ID = process.env.BACKUP_CHANNEL_ID;
const configPath = path.join(__dirname, "..", "config", "backupConfig.json");

async function startAutoBackup(client) {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        { enabled: false, interval: { type: "hour", value: 1 } },
        null,
        2
      )
    );
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  if (!config.enabled || !config.interval) {
    console.log("Backup otomatis tidak aktif atau interval tidak diatur.");
    return;
  }

  console.log(
    `Backup otomatis dimulai dengan interval ${config.interval.value} ${config.interval.type}(s).`
  );

  const intervalMs = calculateIntervalInMilliseconds(config.interval);

  if (!intervalMs) {
    console.error("Interval tidak valid. Backup otomatis tidak dapat dimulai.");
    return;
  }

  stopAutoBackup();

  backupInterval = setInterval(async () => {
    try {
      const currentConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (!currentConfig.enabled) {
        console.log("Backup otomatis dinonaktifkan. Interval akan dihentikan.");
        stopAutoBackup();
        return;
      }

      const now = new Date();

      if (
        currentConfig.interval.type === "minute" ||
        currentConfig.interval.type === "hour" ||
        (currentConfig.interval.type === "day" &&
          now.getDay() === currentConfig.interval.value) ||
        (currentConfig.interval.type === "date" &&
          now.getDate() === currentConfig.interval.value)
      ) {
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (!channel) {
          console.error("Channel backup tidak ditemukan.");
          return;
        }

        const backupFilePath = await backupDatabase();

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
          .setColor(0x1e90ff)
          .setTitle("Automatic Backup Successful")
          .setDescription(`Backup berhasil dibuat pada **${backupTime}**.`)
          .setTimestamp(now)
          .setFooter({ text: "Backup System" });

        await channel.send({
          embeds: [embed],
          files: [backupFilePath],
        });

        console.log("Backup otomatis berhasil dijalankan.");
      }
    } catch (error) {
      console.error("Error saat menjalankan backup otomatis:", error);
    }
  }, intervalMs);
}

/**
 * Menghitung interval dalam milidetik berdasarkan jenis dan nilai interval.
 * @param {Object} interval
 * @returns {Number|null} Interval dalam milidetik, atau null jika tidak valid.
 */

function calculateIntervalInMilliseconds(interval) {
  const typesToMilliseconds = {
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    date: 86400000,
  };

  return typesToMilliseconds[interval.type]
    ? interval.value * typesToMilliseconds[interval.type]
    : null;
}

function stopAutoBackup() {
  if (backupInterval) {
    clearInterval(backupInterval);
    backupInterval = null;
    console.log("Backup otomatis dihentikan.");
  } else {
    // console.log("Tidak ada backup otomatis yang sedang berjalan.");
  }
}

module.exports = {
  startAutoBackup,
  stopAutoBackup,
};
