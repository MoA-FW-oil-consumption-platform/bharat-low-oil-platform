const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RestaurantCertification", function () {
  let contract;
  let owner;
  let verifier;
  let restaurant;

  beforeEach(async function () {
    [owner, verifier, restaurant] = await ethers.getSigners();

    const RestaurantCertification = await ethers.getContractFactory(
      "RestaurantCertification"
    );
    contract = await RestaurantCertification.deploy();
    await contract.waitForDeployment();

    // Grant verifier role
    const VERIFIER_ROLE = await contract.VERIFIER_ROLE();
    await contract.grantRole(VERIFIER_ROLE, verifier.address);
  });

  describe("Deployment", function () {
    it("Should set the correct admin", async function () {
      const ADMIN_ROLE = await contract.ADMIN_ROLE();
      expect(await contract.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should start with zero certificates", async function () {
      expect(await contract.getTotalCertificates()).to.equal(0);
    });
  });

  describe("Certificate Issuance", function () {
    it("Should issue a certificate successfully", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2, // Silver
        85,
        "ipfs://test"
      );

      expect(await contract.getTotalCertificates()).to.equal(1);
    });

    it("Should emit CertificateIssued event", async function () {
      await expect(
        contract.issueCertificate(
          restaurant.address,
          "Test Restaurant",
          "Test Location",
          "test@example.com",
          2,
          85,
          "ipfs://test"
        )
      )
        .to.emit(contract, "CertificateIssued")
        .withArgs(1, restaurant.address, "Test Restaurant", 2, anyValue);
    });

    it("Should fail with low compliance score", async function () {
      await expect(
        contract.issueCertificate(
          restaurant.address,
          "Test Restaurant",
          "Test Location",
          "test@example.com",
          2,
          65, // Below minimum
          "ipfs://test"
        )
      ).to.be.revertedWith("Compliance score too low");
    });

    it("Should fail for duplicate restaurant name", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2,
        85,
        "ipfs://test"
      );

      await expect(
        contract.issueCertificate(
          restaurant.address,
          "Test Restaurant",
          "Test Location 2",
          "test2@example.com",
          2,
          85,
          "ipfs://test"
        )
      ).to.be.revertedWith("Restaurant already certified");
    });
  });

  describe("Certificate Verification", function () {
    it("Should verify valid certificate", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2,
        85,
        "ipfs://test"
      );

      expect(await contract.verifyCertificate(1)).to.be.true;
    });

    it("Should fail verification for revoked certificate", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2,
        85,
        "ipfs://test"
      );

      await contract.revokeCertificate(1, "Test revocation");
      expect(await contract.verifyCertificate(1)).to.be.false;
    });
  });

  describe("Compliance Score Updates", function () {
    it("Should update compliance score", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2,
        85,
        "ipfs://test"
      );

      await contract.connect(verifier).updateComplianceScore(1, 90);

      const cert = await contract.getCertificate(1);
      expect(cert.complianceScore).to.equal(90);
    });

    it("Should auto-suspend on low score", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2,
        85,
        "ipfs://test"
      );

      await contract.connect(verifier).updateComplianceScore(1, 65);

      const cert = await contract.getCertificate(1);
      expect(cert.status).to.equal(4); // Suspended
    });
  });

  describe("Certificate Renewal", function () {
    it("Should renew certificate successfully", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2,
        85,
        "ipfs://test"
      );

      await contract.renewCertificate(1, 3, 95); // Upgrade to Gold

      const cert = await contract.getCertificate(1);
      expect(cert.level).to.equal(3); // Gold
      expect(cert.complianceScore).to.equal(95);
    });
  });

  describe("Access Control", function () {
    it("Should prevent non-admin from issuing certificates", async function () {
      await expect(
        contract.connect(restaurant).issueCertificate(
          restaurant.address,
          "Test Restaurant",
          "Test Location",
          "test@example.com",
          2,
          85,
          "ipfs://test"
        )
      ).to.be.reverted;
    });

    it("Should allow verifier to update compliance", async function () {
      await contract.issueCertificate(
        restaurant.address,
        "Test Restaurant",
        "Test Location",
        "test@example.com",
        2,
        85,
        "ipfs://test"
      );

      await expect(
        contract.connect(verifier).updateComplianceScore(1, 90)
      ).to.not.be.reverted;
    });
  });
});

const anyValue = require("@nomicfoundation/hardhat-chai-matchers").anyValue;
