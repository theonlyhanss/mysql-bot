const { REST, Routes } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const commands = [];
const commandFiles = fs
  .readdirSync("./command")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./command/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("Memulai proses register slash commands...");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Slash commands berhasil terdaftar.");
  } catch (error) {
    console.error("Gagal register slash commands:", error);
  }
})();
