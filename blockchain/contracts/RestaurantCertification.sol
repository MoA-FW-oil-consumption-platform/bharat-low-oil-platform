// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RestaurantCertification
 * @dev Smart contract for managing low-oil restaurant certifications on Polygon Amoy
 * @notice This contract allows government admins to issue, verify, and revoke certifications
 */
contract RestaurantCertification is AccessControl, Pausable, ReentrancyGuard {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Certification levels
    enum CertificationLevel {
        None,
        Bronze,
        Silver,
        Gold
    }

    // Certificate status
    enum CertificateStatus {
        Pending,
        Active,
        Expired,
        Revoked,
        Suspended
    }

    // Restaurant certificate structure
    struct Certificate {
        uint256 certificateId;
        address restaurantOwner;
        string restaurantName;
        string location;
        string contactEmail;
        CertificationLevel level;
        CertificateStatus status;
        uint256 issueDate;
        uint256 expiryDate;
        uint256 complianceScore; // 0-100
        string metadataURI; // IPFS link to additional documents
        address issuedBy;
        uint256 lastUpdated;
    }

    // State variables
    uint256 private _certificateCounter;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public restaurantCertificates;
    mapping(string => bool) private _restaurantNames; // Prevent duplicates

    // Validity period (1 year in seconds)
    uint256 public constant VALIDITY_PERIOD = 365 days;
    uint256 public constant MIN_COMPLIANCE_SCORE = 70;

    // Events
    event CertificateIssued(
        uint256 indexed certificateId,
        address indexed restaurantOwner,
        string restaurantName,
        CertificationLevel level,
        uint256 expiryDate
    );

    event CertificateRenewed(
        uint256 indexed certificateId,
        uint256 newExpiryDate,
        CertificationLevel newLevel
    );

    event CertificateRevoked(
        uint256 indexed certificateId,
        address indexed revokedBy,
        string reason
    );

    event CertificateSuspended(
        uint256 indexed certificateId,
        address indexed suspendedBy
    );

    event CertificateReinstated(
        uint256 indexed certificateId,
        address indexed reinstatedBy
    );

    event ComplianceScoreUpdated(
        uint256 indexed certificateId,
        uint256 oldScore,
        uint256 newScore
    );

    event LevelUpgraded(
        uint256 indexed certificateId,
        CertificationLevel oldLevel,
        CertificationLevel newLevel
    );

    // Modifiers
    modifier onlyActiveCertificate(uint256 certificateId) {
        require(
            certificates[certificateId].status == CertificateStatus.Active,
            "Certificate is not active"
        );
        require(
            block.timestamp <= certificates[certificateId].expiryDate,
            "Certificate has expired"
        );
        _;
    }

    modifier certificateExists(uint256 certificateId) {
        require(
            certificateId > 0 && certificateId <= _certificateCounter,
            "Certificate does not exist"
        );
        _;
    }

    /**
     * @dev Constructor sets up roles
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _certificateCounter = 0;
    }

    /**
     * @dev Issue a new certificate to a restaurant
     */
    function issueCertificate(
        address restaurantOwner,
        string memory restaurantName,
        string memory location,
        string memory contactEmail,
        CertificationLevel level,
        uint256 complianceScore,
        string memory metadataURI
    ) external onlyRole(ADMIN_ROLE) whenNotPaused returns (uint256) {
        require(restaurantOwner != address(0), "Invalid restaurant owner address");
        require(bytes(restaurantName).length > 0, "Restaurant name required");
        require(!_restaurantNames[restaurantName], "Restaurant already certified");
        require(complianceScore >= MIN_COMPLIANCE_SCORE, "Compliance score too low");
        require(complianceScore <= 100, "Invalid compliance score");
        require(level != CertificationLevel.None, "Invalid certification level");

        _certificateCounter++;
        uint256 certificateId = _certificateCounter;
        uint256 issueDate = block.timestamp;
        uint256 expiryDate = issueDate + VALIDITY_PERIOD;

        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            restaurantOwner: restaurantOwner,
            restaurantName: restaurantName,
            location: location,
            contactEmail: contactEmail,
            level: level,
            status: CertificateStatus.Active,
            issueDate: issueDate,
            expiryDate: expiryDate,
            complianceScore: complianceScore,
            metadataURI: metadataURI,
            issuedBy: msg.sender,
            lastUpdated: issueDate
        });

        restaurantCertificates[restaurantOwner].push(certificateId);
        _restaurantNames[restaurantName] = true;

        emit CertificateIssued(
            certificateId,
            restaurantOwner,
            restaurantName,
            level,
            expiryDate
        );

        return certificateId;
    }

    /**
     * @dev Renew an existing certificate
     */
    function renewCertificate(
        uint256 certificateId,
        CertificationLevel newLevel,
        uint256 newComplianceScore
    ) external onlyRole(ADMIN_ROLE) certificateExists(certificateId) whenNotPaused {
        Certificate storage cert = certificates[certificateId];
        require(
            cert.status == CertificateStatus.Active ||
                cert.status == CertificateStatus.Expired,
            "Cannot renew this certificate"
        );
        require(newComplianceScore >= MIN_COMPLIANCE_SCORE, "Compliance score too low");
        require(newComplianceScore <= 100, "Invalid compliance score");

        uint256 newExpiryDate = block.timestamp + VALIDITY_PERIOD;

        cert.status = CertificateStatus.Active;
        cert.level = newLevel;
        cert.expiryDate = newExpiryDate;
        cert.complianceScore = newComplianceScore;
        cert.lastUpdated = block.timestamp;

        emit CertificateRenewed(certificateId, newExpiryDate, newLevel);
    }

    /**
     * @dev Revoke a certificate permanently
     */
    function revokeCertificate(uint256 certificateId, string memory reason)
        external
        onlyRole(ADMIN_ROLE)
        certificateExists(certificateId)
    {
        Certificate storage cert = certificates[certificateId];
        require(
            cert.status != CertificateStatus.Revoked,
            "Certificate already revoked"
        );

        cert.status = CertificateStatus.Revoked;
        cert.lastUpdated = block.timestamp;

        emit CertificateRevoked(certificateId, msg.sender, reason);
    }

    /**
     * @dev Suspend a certificate temporarily
     */
    function suspendCertificate(uint256 certificateId)
        external
        onlyRole(VERIFIER_ROLE)
        certificateExists(certificateId)
    {
        Certificate storage cert = certificates[certificateId];
        require(
            cert.status == CertificateStatus.Active,
            "Certificate is not active"
        );

        cert.status = CertificateStatus.Suspended;
        cert.lastUpdated = block.timestamp;

        emit CertificateSuspended(certificateId, msg.sender);
    }

    /**
     * @dev Reinstate a suspended certificate
     */
    function reinstateCertificate(uint256 certificateId)
        external
        onlyRole(ADMIN_ROLE)
        certificateExists(certificateId)
    {
        Certificate storage cert = certificates[certificateId];
        require(
            cert.status == CertificateStatus.Suspended,
            "Certificate is not suspended"
        );
        require(
            block.timestamp <= cert.expiryDate,
            "Certificate has expired"
        );

        cert.status = CertificateStatus.Active;
        cert.lastUpdated = block.timestamp;

        emit CertificateReinstated(certificateId, msg.sender);
    }

    /**
     * @dev Update compliance score
     */
    function updateComplianceScore(uint256 certificateId, uint256 newScore)
        external
        onlyRole(VERIFIER_ROLE)
        certificateExists(certificateId)
    {
        require(newScore <= 100, "Invalid compliance score");

        Certificate storage cert = certificates[certificateId];
        uint256 oldScore = cert.complianceScore;

        cert.complianceScore = newScore;
        cert.lastUpdated = block.timestamp;

        // Auto-suspend if score drops below minimum
        if (newScore < MIN_COMPLIANCE_SCORE && cert.status == CertificateStatus.Active) {
            cert.status = CertificateStatus.Suspended;
            emit CertificateSuspended(certificateId, msg.sender);
        }

        emit ComplianceScoreUpdated(certificateId, oldScore, newScore);
    }

    /**
     * @dev Upgrade certification level
     */
    function upgradeCertificationLevel(
        uint256 certificateId,
        CertificationLevel newLevel
    ) external onlyRole(ADMIN_ROLE) certificateExists(certificateId) {
        Certificate storage cert = certificates[certificateId];
        require(
            cert.status == CertificateStatus.Active,
            "Certificate must be active"
        );
        require(newLevel > cert.level, "Can only upgrade level");
        require(
            cert.complianceScore >= 85,
            "Compliance score must be 85+ for upgrade"
        );

        CertificationLevel oldLevel = cert.level;
        cert.level = newLevel;
        cert.lastUpdated = block.timestamp;

        emit LevelUpgraded(certificateId, oldLevel, newLevel);
    }

    /**
     * @dev Verify if a certificate is valid
     */
    function verifyCertificate(uint256 certificateId)
        external
        view
        certificateExists(certificateId)
        returns (bool)
    {
        Certificate memory cert = certificates[certificateId];
        return
            cert.status == CertificateStatus.Active &&
            block.timestamp <= cert.expiryDate &&
            cert.complianceScore >= MIN_COMPLIANCE_SCORE;
    }

    /**
     * @dev Get certificate details
     */
    function getCertificate(uint256 certificateId)
        external
        view
        certificateExists(certificateId)
        returns (Certificate memory)
    {
        return certificates[certificateId];
    }

    /**
     * @dev Get all certificates for a restaurant owner
     */
    function getRestaurantCertificates(address restaurantOwner)
        external
        view
        returns (uint256[] memory)
    {
        return restaurantCertificates[restaurantOwner];
    }

    /**
     * @dev Get total number of certificates issued
     */
    function getTotalCertificates() external view returns (uint256) {
        return _certificateCounter;
    }

    /**
     * @dev Check if certificate is expired
     */
    function isExpired(uint256 certificateId)
        public
        view
        certificateExists(certificateId)
        returns (bool)
    {
        return block.timestamp > certificates[certificateId].expiryDate;
    }

    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant verifier role
     */
    function addVerifier(address verifier) external onlyRole(ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, verifier);
    }

    /**
     * @dev Revoke verifier role
     */
    function removeVerifier(address verifier) external onlyRole(ADMIN_ROLE) {
        revokeRole(VERIFIER_ROLE, verifier);
    }
}
