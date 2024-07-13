import path from "path";

//Example backup file path, obviously this is going to be save in a more secure place
export const backupFilePath = path.join(__dirname, '../db/blockchain-backup.json');
//Example database file path, obviously this is going to be save in a more secure place
export const blockchainFilePath = path.join(__dirname, '../db/blockchain.json');