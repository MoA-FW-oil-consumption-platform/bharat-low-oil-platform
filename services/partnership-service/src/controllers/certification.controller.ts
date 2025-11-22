import { Request, Response } from 'express';
import { ethers } from 'ethers';

// ABI for the RestaurantCertification contract (Simplified)
const CONTRACT_ABI = [
  "function issueCertificate(address restaurant, string memory name, uint8 tier) public",
  "function revokeCertificate(address restaurant) public",
  "function getCertificate(address restaurant) public view returns (string memory name, uint8 tier, uint256 issueDate, bool isValid, uint256 complianceScore)"
];

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const { restaurantAddress, name, tier } = req.body;

    if (!restaurantAddress || !name || tier === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real scenario, we would use the private key to sign the transaction
    if (!PRIVATE_KEY) {
      console.warn('⚠️ No private key found. Mocking blockchain transaction.');
      return res.status(200).json({
        success: true,
        message: 'Certificate issued (Mock)',
        transactionHash: '0x' + '0'.repeat(64),
        data: { restaurantAddress, name, tier }
      });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    const tx = await contract.issueCertificate(restaurantAddress, name, tier);
    await tx.wait();

    res.status(200).json({
      success: true,
      message: 'Certificate issued successfully',
      transactionHash: tx.hash
    });
  } catch (error: any) {
    console.error('Blockchain error:', error);
    res.status(500).json({ error: 'Failed to issue certificate', details: error.message });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { restaurantAddress } = req.params;

    if (!restaurantAddress) {
      return res.status(400).json({ error: 'Missing restaurant address' });
    }

    if (!PRIVATE_KEY) {
       // Mock response
       return res.status(200).json({
         isValid: true,
         name: "Mock Restaurant",
         tier: 1,
         complianceScore: 95,
         issueDate: new Date().toISOString()
       });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    // Read-only provider is enough for verification
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const result = await contract.getCertificate(restaurantAddress);

    res.status(200).json({
      name: result.name,
      tier: result.tier,
      issueDate: new Date(Number(result.issueDate) * 1000).toISOString(),
      isValid: result.isValid,
      complianceScore: Number(result.complianceScore)
    });
  } catch (error: any) {
    console.error('Blockchain error:', error);
    res.status(500).json({ error: 'Failed to verify certificate', details: error.message });
  }
};
