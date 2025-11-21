const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying RestaurantCertification contract...");

  // Get the contract factory
  const RestaurantCertification = await hre.ethers.getContractFactory(
    "RestaurantCertification"
  );

  // Deploy the contract
  console.log("📝 Deploying contract to network:", hre.network.name);
  const contract = await RestaurantCertification.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ RestaurantCertification deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: (await hre.ethers.getSigners())[0].address,
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for block confirmations on testnet
  if (hre.network.name === "amoy") {
    console.log("\n⏳ Waiting for block confirmations...");
    await contract.deploymentTransaction().wait(5);
    console.log("✅ Contract confirmed on blockchain");

    console.log("\n🔍 Verify contract with:");
    console.log(
      `npx hardhat verify --network amoy ${contractAddress}`
    );
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\n📱 Add this to your .env file:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
