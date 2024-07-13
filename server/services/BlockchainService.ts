import fs from 'fs';
import { Block } from '../models/Block';
import { BackupBlockchainService } from './BackupBlockchainService';
import { blockchainFilePath } from '../shared/consts';

export class BlockchainService{

    private chain: Block[] = [];

    constructor() {
        this.chain = this.readBlockchainFromFile();
    }

    private readBlockchainFromFile(): Block[] {
        try {
            const data = fs.readFileSync(blockchainFilePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error to read the chain', error);
            return [];
        }
    }

    getLatestBlock() {
        if(!this.isValidChain()) {
            this.restoreChain();
        }

        return this.chain[0];
    }

    addBlock(data: string) {
        if(!this.isValidChain()) {
            this.restoreChain();
        }        
        const newBlock = Block.next(this.chain[this.chain.length - 1], data);
        this.chain.push(newBlock);
    }

    isValidChain() {
        if(!this.chain.length) return false;
        if (JSON.stringify(this.chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        if (this.chain.length === 1) return true;

        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!Block.isValidBlock(block, previousBlock)) {
                return false;
            }
        }

        return true;
    }

    restoreChain() {
        this.chain = BackupBlockchainService.restoreBackup();
    }
}