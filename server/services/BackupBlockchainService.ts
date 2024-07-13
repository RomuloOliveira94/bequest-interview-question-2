import { Block } from "../models/Block";
import * as fs from 'fs';

//Example backup file path, obviously this is going to be save in a more secure place
const backupFilePath = '../db/blockchain-backup.json';
//Example database file path, obviously this is going to be save in a more secure place
const databaseFilePath = '../db/blockchain.json';

export class BackupBlockchainService {
    public static createBackup(chain: Block[]): Block[] {
        try {
            fs.writeFileSync(backupFilePath, JSON.stringify(chain, null, 2));
            return chain;
        } catch (error) {
            console.error('Error create the Backup', error);
            return [];
        }
    }

    public static restoreBackup(): Block[] {
        try {
            const backupData = fs.readFileSync(backupFilePath, 'utf-8');
            const chain: Block[] = JSON.parse(backupData);
            fs.writeFileSync(databaseFilePath, JSON.stringify(chain, null, 2));
            return chain;
        } catch (error) {
            console.error('Error to restore the Backup', error);
            return [];
        }
    }
    
}