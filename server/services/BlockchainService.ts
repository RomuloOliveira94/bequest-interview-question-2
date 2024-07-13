import * as fs from 'fs';
import { Block } from '../models/Block';
import { BackupBlockchainService } from './BackupBlockchainService';

const blockchainFilePath = './src/data/blockchain.json';

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
        if(!this.checkBlockChainIntegrity()){
            this.restoreChain();
        }
        return this.chain[this.chain.length - 1];
    }

    addBlock(data: string) {
        if(!this.isValidChain(this.chain)){
            this.restoreChain();
        }        
        const newBlock = Block.next(this.chain[this.chain.length - 1], data);
        this.chain.push(newBlock);
    }

    isValidChain(chain: any[]) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const previousBlock = chain[i - 1];

            if (!Block.isValidNewBlock(block, previousBlock)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(newChain: any[]) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain.');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('The received chain is not valid.');
            return;
        }

        console.log('Replacing blockchain with the new chain.');
        this.chain = newChain;
    }

    private restoreChain() {
        this.chain = BackupBlockchainService.restoreBackup();
    }

    private checkBlockChainIntegrity() {
        return this.isValidChain(this.chain);
    }
}