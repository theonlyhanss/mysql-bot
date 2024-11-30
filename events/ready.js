const { startAutoBackup } = require("../functions/autoBackup");
const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`${client.user.tag} siap!`);
    startAutoBackup(client);
    
    client.user.setPresence({
  activities: [{ name: `mysql database`, type: ActivityType.Watching }],
  status: 'online',
});
  },
};
