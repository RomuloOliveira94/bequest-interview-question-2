import { Request, Response } from "express";
import { BlockchainService } from "../services/BlockchainService";

export const getBlockchain = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();

  try {
    res
      .status(200)
      .json({ block: blockchainService.getLatestBlock(), status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", status: 500 });
    return;
  }
};

export const addBlock = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();
  const { newData, previousHash } = req.body;

  if (!newData) {
    res.status(400).json({ message: "Data is required", status: 400 });
    return;
  }

  if (!previousHash) {
    res.status(400).json({ message: "Previous hash is required", status: 400 });
    return;
  }

  if (blockchainService.isValidChain(previousHash) === false) {
    res.status(406).json({ message: "Data Tampered", status: 406 });
    return;
  }

  try {
    blockchainService.addBlock(newData);
    const newBlock = blockchainService.getLatestBlock();
    res.json({
      message: "Data updated Sucefully",
      block: newBlock,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

export const verifyChain = (req: Request, res: Response): void => {
  const { block } = req.body;

  const blockchainService = new BlockchainService();

  try {
    const validate = blockchainService.isValidChain(block.hash);

    if (validate === false) {
      res.status(406).json({
        message: "Data Tampered",
        status: 406,
      });
      return;
    }

    res.status(200).json({ message: "Your data is valid!", status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

export const restoreChain = (req: Request, res: Response): void => {
  const { backupKey } = req.body;
  const blockchainService = new BlockchainService();

  if (!backupKey || !blockchainService.checkKey(backupKey)) {
    res.status(401).json({ message: "Unauthorized", status: 401 });
    return;
  }

  try {
    blockchainService.restoreChain();
    res
      .status(200)
      .json({ message: "Data restored successfully", status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};
