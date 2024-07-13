import { Request, Response } from 'express';
import { BlockchainService } from '../services/BlockchainService';

const blockchainService = new BlockchainService();

export const getBlockchain = (req: Request, res: Response): void => {
    if(blockchainService.isValidChain() === false) {
        blockchainService.restoreChain();
    }

    if(!blockchainService.isValidChain()) {
        res.status(500).json({ message: 'Invalid Data' });
        return;
    }

    res.status(200).json(blockchainService.getLatestBlock());
};

export const addBlock = (req: Request, res: Response): void => {
    const { data } = req.body;
    blockchainService.addBlock(data);
    const newBlock = blockchainService.getLatestBlock();
    res.json({ message: 'Data updated Sucefully', block: newBlock });
};