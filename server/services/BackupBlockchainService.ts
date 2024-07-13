import { Block } from "../models/Block";
import fs from 'fs';
import { backupFilePath, blockchainFilePath } from "../shared/consts";

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
            fs.writeFileSync(blockchainFilePath, JSON.stringify(chain, null, 2));
            return chain;
        } catch (error) {
            console.error('Error to restore the Backup', error);
            return [];
        }
    }
    
}