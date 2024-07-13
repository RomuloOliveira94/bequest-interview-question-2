import * as crypto from 'crypto';


export class Block {

    index: number;
    timestamp: string;
    data: string;
    previousHash: string;
    hash: string;

    constructor(index: number, timestamp: string, data: string, previousHash: string, hash: string) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = hash;
    }

    static genesis() {
        return new Block(0, '0', 'Genesis', '0', '0');
    }

    static isValidStructure(block: Block) {
        return typeof block.index === 'number'
            && typeof block.timestamp === 'string'
            && typeof block.data === 'string'
            && typeof block.previousHash === 'string'
            && typeof block.hash === 'string';
    }

    static next(previousBlock: Block, data: string) {
        const index = previousBlock.index + 1;
        const timestamp = new Date().toISOString();
        const previousHash = previousBlock.hash;
        const hash = Block.calculateHash(index, timestamp, data, previousHash);
        return new Block(index, timestamp, data, previousHash, hash);
    }

    static calculateHash(index: number, timestamp: string, data: string, previousHash: string) {
        return crypto.createHash('sha256').update(index + timestamp + JSON.stringify(data) + previousHash).digest('hex');
    }

    static isValidBlock(currentBlock: Block, previousBlock: Block) {
        if (!Block.isValidStructure(currentBlock)) {
            console.log('Invalid structure');
            return false;
        }

        if (previousBlock.index + 1 !== currentBlock.index) {
            console.log('Invalid index');
            return false;
        } else if (previousBlock.hash !== currentBlock.previousHash) {
            console.log('Invalid previous hash');
            return false;
        } else if (Block.calculateHash(currentBlock.index, currentBlock.timestamp, currentBlock.data, currentBlock.previousHash) !== currentBlock.hash) {
            console.log('Invalid hash');
            return false;
        }

        return true;
    }
}