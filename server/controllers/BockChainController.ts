import { Request, Response } from 'express';
import { BlockchainService } from '../services/BlockchainService';
import { BackupBlockchainService } from '../services/BackupBlockchainService';
import { Block } from '../models/Block';

const blockchainService = new BlockchainService();

export const getBlockchain = (req: Request, res: Response): void => {
    try {
        res.status(200).json({ blockchain: blockchainService.getLatestBlock()});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar a blockchain.', error: error.message });
    }
};

export const addBlock = (req: Request, res: Response): void => {
    const { data } = req.body;
    blockchainService.addBlock(data);
    const newBlock = blockchainService.getLatestBlock();
    res.json({ message: 'Novo bloco adicionado à blockchain.', block: newBlock });
};