# Blockchain Certification System

Decentralized restaurant certification on Polygon Amoy testnet using Hardhat and Solidity.

## Features

### Smart Contract: RestaurantCertification.sol

- **Certificate Issuance**: Government admins can issue low-oil certifications
- **Verification**: Public verification of certificate validity
- **Compliance Tracking**: 0-100 score with minimum 70 threshold
- **Certification Levels**: Bronze, Silver, Gold
- **Status Management**: Active, Expired, Revoked, Suspended
- **Role-Based Access**: Admin and Verifier roles using OpenZeppelin AccessControl
- **Emergency Controls**: Pausable for critical situations
- **Auto-Suspension**: Certificates auto-suspend if compliance drops below 70
- **Renewal System**: Certificates valid for 1 year, renewable
- **Upgrades**: Restaurants can upgrade from Bronze → Silver → Gold

### Security Features

- ✅ OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard for state-changing functions
- ✅ AccessControl for role management
- ✅ Pausable for emergency stops
- ✅ Input validation on all functions
- ✅ Events for all state changes

## Tech Stack

- **Smart Contracts**: Solidity 0.8.20
- **Development**: Hardhat
- **Testing**: Hardhat + Chai
- **Network**: Polygon Amoy Testnet (free, no gas fees)
- **Libraries**: OpenZeppelin Contracts 5.0

## Setup

### Prerequisites

1. Node.js 18+ installed
2. MetaMask or similar wallet
3. Testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

### Installation

```bash
cd blockchain
npm install
cp .env.example .env
```

### Configuration

Edit `.env`:

```env
PRIVATE_KEY=your_private_key_from_metamask
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=optional_for_verification
```

⚠️ **Never commit your real private key to git!**

## Usage

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

Expected output:
```
RestaurantCertification
  Deployment
    ✓ Should set the correct admin
    ✓ Should start with zero certificates
  Certificate Issuance
    ✓ Should issue a certificate successfully
    ✓ Should emit CertificateIssued event
    ✓ Should fail with low compliance score
    ✓ Should fail for duplicate restaurant name
  ...
```

### Deploy to Local Network

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy:local
```

### Deploy to Polygon Amoy Testnet

```bash
npm run deploy:testnet
```

Output:
```
🚀 Deploying RestaurantCertification contract...
📝 Deploying contract to network: amoy
✅ RestaurantCertification deployed to: 0x...
⏳ Waiting for block confirmations...
✅ Contract confirmed on blockchain
🔍 Verify contract with:
npx hardhat verify --network amoy 0x...
```

### Verify Contract on PolygonScan

```bash
npm run verify -- 0xYourContractAddress
```

### Interact with Contract

```bash
node scripts/interact.js 0xYourContractAddress
```

This will:
1. Issue a test certificate
2. Verify the certificate
3. Display certificate details
4. Show total certificates

## Smart Contract Functions

### Admin Functions

```solidity
// Issue new certificate
function issueCertificate(
    address restaurantOwner,
    string memory restaurantName,
    string memory location,
    string memory contactEmail,
    CertificationLevel level,
    uint256 complianceScore,
    string memory metadataURI
) external onlyRole(ADMIN_ROLE) returns (uint256)

// Renew certificate
function renewCertificate(
    uint256 certificateId,
    CertificationLevel newLevel,
    uint256 newComplianceScore
) external onlyRole(ADMIN_ROLE)

// Revoke certificate
function revokeCertificate(
    uint256 certificateId,
    string memory reason
) external onlyRole(ADMIN_ROLE)

// Upgrade certification level
function upgradeCertificationLevel(
    uint256 certificateId,
    CertificationLevel newLevel
) external onlyRole(ADMIN_ROLE)
```

### Verifier Functions

```solidity
// Suspend certificate temporarily
function suspendCertificate(uint256 certificateId) 
    external onlyRole(VERIFIER_ROLE)

// Update compliance score
function updateComplianceScore(
    uint256 certificateId,
    uint256 newScore
) external onlyRole(VERIFIER_ROLE)
```

### Public Functions

```solidity
// Verify certificate validity
function verifyCertificate(uint256 certificateId) 
    external view returns (bool)

// Get certificate details
function getCertificate(uint256 certificateId) 
    external view returns (Certificate memory)

// Get restaurant's certificates
function getRestaurantCertificates(address restaurantOwner) 
    external view returns (uint256[] memory)

// Check if expired
function isExpired(uint256 certificateId) 
    public view returns (bool)
```

## Integration with Backend

### Node.js Integration

```javascript
const { ethers } = require('ethers');

// Connect to contract
const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  wallet
);

// Issue certificate
const tx = await contract.issueCertificate(
  restaurantOwner,
  "Green Leaf Restaurant",
  "Mumbai, Maharashtra",
  "contact@greenleaf.com",
  2, // Silver
  85,
  "ipfs://metadata-hash"
);
await tx.wait();

// Verify certificate
const isValid = await contract.verifyCertificate(certificateId);
```

### REST API Endpoint Example

```javascript
// Express.js endpoint
app.post('/api/blockchain/issue-certificate', async (req, res) => {
  try {
    const { restaurantOwner, name, location, email, level, score, metadataURI } = req.body;
    
    const tx = await contract.issueCertificate(
      restaurantOwner,
      name,
      location,
      email,
      level,
      score,
      metadataURI
    );
    
    const receipt = await tx.wait();
    const certificateId = receipt.logs[0].args[0];
    
    res.json({
      success: true,
      certificateId: certificateId.toString(),
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Network Details

### Polygon Amoy Testnet

- **Chain ID**: 80002
- **RPC URL**: https://rpc-amoy.polygon.technology
- **Explorer**: https://amoy.polygonscan.com
- **Faucet**: https://faucet.polygon.technology/
- **Gas Token**: MATIC (testnet, free)

### Gas Costs (Approximate)

- Deploy contract: ~2,500,000 gas
- Issue certificate: ~150,000 gas
- Verify certificate: 0 gas (view function)
- Update compliance: ~50,000 gas
- Revoke certificate: ~40,000 gas

**Total cost on testnet: $0 (free testnet MATIC)**

## Certificate Structure

```solidity
struct Certificate {
    uint256 certificateId;
    address restaurantOwner;
    string restaurantName;
    string location;
    string contactEmail;
    CertificationLevel level;      // Bronze, Silver, Gold
    CertificateStatus status;      // Active, Expired, Revoked, Suspended
    uint256 issueDate;
    uint256 expiryDate;           // issueDate + 365 days
    uint256 complianceScore;      // 0-100
    string metadataURI;           // IPFS link to documents
    address issuedBy;
    uint256 lastUpdated;
}
```

## Events

```solidity
event CertificateIssued(
    uint256 indexed certificateId,
    address indexed restaurantOwner,
    string restaurantName,
    CertificationLevel level,
    uint256 expiryDate
);

event CertificateRenewed(uint256 indexed certificateId, ...);
event CertificateRevoked(uint256 indexed certificateId, ...);
event CertificateSuspended(uint256 indexed certificateId, ...);
event ComplianceScoreUpdated(uint256 indexed certificateId, ...);
event LevelUpgraded(uint256 indexed certificateId, ...);
```

## Testing

Run comprehensive test suite:

```bash
npm test
```

Coverage report:

```bash
npx hardhat coverage
```

## Troubleshooting

### Issue: "insufficient funds for intrinsic transaction cost"
**Solution**: Get testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

### Issue: "nonce has already been used"
**Solution**: Reset MetaMask account or wait for pending transactions

### Issue: Contract verification fails
**Solution**: Ensure POLYGONSCAN_API_KEY is set in .env

## Production Deployment

⚠️ **Before mainnet deployment:**

1. Complete security audit
2. Use multi-sig wallet for admin role
3. Set up monitoring for contract events
4. Implement rate limiting on admin functions
5. Create governance process for role management
6. Deploy to Polygon mainnet (requires real MATIC for gas)

## License

Part of Bharat Low Oil Platform - Government of India Initiative
