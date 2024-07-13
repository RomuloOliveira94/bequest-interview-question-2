import { Request, Response } from "express";
import { BlockchainService } from "../services/BlockchainService";
import { BackupBlockchainService } from "../services/BackupBlockchainService";

export const getBlockchain = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();

  try {
    /* if (blockchainService.isValidChain() === false) {
      res.status(406).json({
        message: "Invalid Data",
        status: 406
      });
      return;
    } */

    res.status(200).json({block: blockchainService.getLatestBlock(), status: 200});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!", status: 500 });
    return;
  }
};

export const addBlock = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();
  const { data } = req.body;

  if (!data) {
    res.status(400).json({ message: "Data is required", status: 400 });
    return;
  }

  if (blockchainService.isValidChain() === false) {
    res.status(406).json({ message: "Invalid data", status: 406 });
    return;
  }

  try {
    blockchainService.addBlock(data);
    const newBlock = blockchainService.getLatestBlock();
    res.json({ message: "Data updated Sucefully", block: newBlock, status: 200 });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

export const verifyChain = (req: Request, res: Response): void => {
    const { data } = req.body;

  const blockchainService = new BlockchainService();

  try {
    const validate = blockchainService.isValidChain(data);

    if (validate === false) {
      res.status(406).json({
        message: "Invalid Data",
        status: 406
      });
      return;
    }

    res.status(200).json({ message: "Your data is valid!", status: 200 });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

export const restoreChain = (req: Request, res: Response): void => {
    const { backupKey } = req.body;

  const blockchainService = new BlockchainService();

  if(!backupKey || backupKey !== blockchainService.checkBackupKey(backupKey)) {
    res.status(401).json({ message: "Unauthorized", status: 401 });
    return;
  }

  try {
    blockchainService.restoreChain();
    res.status(200).json({ message: "Data restored successfully", status: 200 });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};
