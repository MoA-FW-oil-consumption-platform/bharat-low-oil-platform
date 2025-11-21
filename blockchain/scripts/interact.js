const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];

  if (!contractAddress) {
    console.error("❌ Please provide contract address");
    console.log("Usage: node scripts/interact.js CONTRACT_ADDRESS");
    process.exit(1);
  }

  console.log("🔗 Connecting to contract:", contractAddress);

  const RestaurantCertification = await hre.ethers.getContractFactory(
    "RestaurantCertification"
  );
  const contract = RestaurantCertification.attach(contractAddress);

  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Using account:", signer.address);

  // Example: Issue a certificate
  console.log("\n📝 Issuing a test certificate...");

  const tx = await contract.issueCertificate(
    signer.address, // Restaurant owner (using deployer for test)
    "Green Leaf Restaurant",
    "Mumbai, Maharashtra",
    "contact@greenleaf.com",
    2, // Silver level (0=None, 1=Bronze, 2=Silver, 3=Gold)
    85, // Compliance score
    "ipfs://QmTestHash123" // Metadata URI
  );

  const receipt = await tx.wait();
  console.log("✅ Certificate issued!");
  console.log("Transaction hash:", receipt.hash);

  // Get certificate ID from events
  const event = receipt.logs.find(
    (log) => log.eventName === "CertificateIssued"
  );
  
  if (event) {
    const certificateId = event.args[0];
    console.log("📜 Certificate ID:", certificateId.toString());

    // Verify the certificate
    console.log("\n🔍 Verifying certificate...");
    const isValid = await contract.verifyCertificate(certificateId);
    console.log("Valid:", isValid);

    // Get certificate details
    console.log("\n📋 Certificate Details:");
    const cert = await contract.getCertificate(certificateId);
    console.log({
      certificateId: cert.certificateId.toString(),
      restaurantName: cert.restaurantName,
      location: cert.location,
      level: ["None", "Bronze", "Silver", "Gold"][cert.level],
      status: ["Pending", "Active", "Expired", "Revoked", "Suspended"][cert.status],
      complianceScore: cert.complianceScore.toString(),
      issueDate: new Date(Number(cert.issueDate) * 1000).toLocaleDateString(),
      expiryDate: new Date(Number(cert.expiryDate) * 1000).toLocaleDateString(),
    });
  }

  // Get total certificates
  const totalCerts = await contract.getTotalCertificates();
  console.log("\n📊 Total certificates issued:", totalCerts.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
