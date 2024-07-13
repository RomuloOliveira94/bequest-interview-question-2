import { Request, Response } from 'express';
import { BlockchainService } from '../services/BlockchainService';

const blockchainService = new BlockchainService();

export const getBlockchain = (req: Request, res: Response): void => {
    try {
        res.status(200).json(blockchainService.getLatestBlock());
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar a blockchain.', error: error.message });
    }
};

export const addBlock = (req: Request, res: Response): void => {
    const { data } = req.body;
    blockchainService.addBlock(data);
    const newBlock = blockchainService.getLatestBlock();
    res.json({ message: 'Novo bloco adicionado à blockchain.', block: newBlock });
};