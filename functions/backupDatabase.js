const mysqldump = require("mysqldump");
const path = require("path");

module.exports = async function backupDatabase() {
  const backupFilePath = path.join(
    __dirname,
    `../backup_${new Date().toISOString().slice(0, 10)}.sql`
  );

  try {
    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
      dumpToFile: backupFilePath,
    });

    console.log(`Backup Created!`)
    return backupFilePath;
  } catch (error) {
    console.error(`Failed to create database backup: ${error.message}`);
    throw error;
  }
};
