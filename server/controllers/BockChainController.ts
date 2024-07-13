import { Request, Response } from "express";
import { BlockchainService } from "../services/BlockchainService";

export const getBlockchain = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();

  try {
    if (blockchainService.isValidChain() === false) {
      res.status(500).json({
        message: "Invalid Data"
      });
      return;
    }

    res.status(200).json(blockchainService.getLatestBlock());
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!", error });
    return;
  }
};

export const addBlock = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();
  const { data } = req.body;

  if (!data) {
    res.status(400).json({ message: "Data is required" });
    return;
  }

  if (blockchainService.isValidChain() === false) {
    res.status(500).json({ message: "Your data is invalid" });
    return;
  }

  try {
    blockchainService.addBlock(data);
    const newBlock = blockchainService.getLatestBlock();
    res.json({ message: "Data updated Sucefully", block: newBlock });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const verifyChain = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();

  try {
    const validate = blockchainService.isValidChain();

    if (validate === false) {
      res.status(500).json({
        message: "Tampered data detected",
        block: blockchainService.detectTampering(),
      });
      return;
    }

    res.status(200).json({ message: "Your data is valid!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const restoreChain = (req: Request, res: Response): void => {
  const blockchainService = new BlockchainService();

  try {
    blockchainService.restoreChain();
    if (blockchainService.isValidChain() === false) {
      res.status(500).json({ message: "Invalid Data" });
      return;
    }
    res.status(200).json({ message: "Data restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
