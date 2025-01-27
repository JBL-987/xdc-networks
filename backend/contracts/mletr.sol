// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradeDocumentManager {
    enum DocumentType { Transferable, Verifiable, Both }
    
    enum DocumentCategory {
        // Commercial Processes
        PO,     // Purchase Order
        INV,    // Commercial Invoice
        
        // Transport Processes
        SLI,    // Shipper's Letter of Instructions
        PL,     // Packing List
        BoL,    // Bill of Lading
        SW,     // Sea Waybill
        SDO,    // Ship's Delivery Order
        AW,     // Air Waybill
        SCM,    // Sea Cargo Manifest
        ACM,    // Air Cargo Manifest
        CIM,    // Rail Consignment Note
        CMR,    // Road Consignment Note
        CID,    // Cargo Insurance Document
        WR,     // Warehouse Receipt
        DGD,    // Dangerous Goods Declaration
        CSD,    // Consignment Security Declaration
        
        // Regulatory & Certificates
        EIL,    // Export/Import License
        CoO,    // Certificate of Origin (Non-preferential)
        PCoO,   // Preferential Certificate of Origin
        CD,     // Customs Declaration
        CPC,    // CITES Permit/Certificate
        CIO,    // Certificate of Inspection for Organic Products
        CB,     // Customs Bond
        ATA,    // ATA Carnet
        TIR,    // TIR Carnet
        TAD,    // Transit Accompanying Document
        ARA,    // Advance Ruling Application
        EG,     // Excise Guarantee
        EMCS,   // Excise Movement Control System Documents
        
        // Financial Documents
        LC,     // Letter of Credit
        PC,     // Payment Confirmation
        BoE,    // Bill of Exchange
        PN      // Promissory Note
    }
    
    struct Document {
        string documentID;
        string documentName;
        DocumentType docType;
        DocumentCategory category;
        address issuer;
        address holder;
        bool isVerified;
        address[] verifiers;
        uint256 issueDate;
        bool isActive;
    }
    
    mapping(string => Document) public documents;
    mapping(DocumentCategory => DocumentType) public categoryTypes;
    mapping(DocumentCategory => address[]) public authorizedVerifiers;
    mapping(address => bool) public isAuthorizedIssuer;
    
    event DocumentIssued(string documentID, DocumentCategory category, address issuer, address holder);
    event DocumentTransferred(string documentID, address from, address to);
    event DocumentVerified(string documentID, address verifier);
    event VerifierAuthorized(DocumentCategory category, address verifier);
    event IssuerAuthorized(address issuer);
    event DocumentInvalidated(string documentID);
    
    constructor() {
        // Initialize document types for each category
        // Commercial Documents - typically transferable
        categoryTypes[DocumentCategory.PO] = DocumentType.Transferable;
        categoryTypes[DocumentCategory.INV] = DocumentType.Transferable;
        
        // Transport Documents - mostly both transferable and verifiable
        categoryTypes[DocumentCategory.BoL] = DocumentType.Both;
        categoryTypes[DocumentCategory.SW] = DocumentType.Both;
        categoryTypes[DocumentCategory.SDO] = DocumentType.Both;
        categoryTypes[DocumentCategory.AW] = DocumentType.Both;
        categoryTypes[DocumentCategory.CIM] = DocumentType.Both;
        categoryTypes[DocumentCategory.CMR] = DocumentType.Both;
        categoryTypes[DocumentCategory.WR] = DocumentType.Both;
        
        // Transport Documents - verifiable only
        categoryTypes[DocumentCategory.SLI] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.PL] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.SCM] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.ACM] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.DGD] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.CSD] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.CID] = DocumentType.Verifiable;
        
        // Regulatory Documents - typically verifiable
        categoryTypes[DocumentCategory.EIL] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.CoO] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.PCoO] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.CD] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.CPC] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.CIO] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.CB] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.ARA] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.EG] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.EMCS] = DocumentType.Verifiable;
        
        // Special Documents - both transferable and verifiable
        categoryTypes[DocumentCategory.ATA] = DocumentType.Both;
        categoryTypes[DocumentCategory.TIR] = DocumentType.Both;
        categoryTypes[DocumentCategory.TAD] = DocumentType.Both;
        
        // Financial Documents
        categoryTypes[DocumentCategory.LC] = DocumentType.Both;
        categoryTypes[DocumentCategory.PC] = DocumentType.Verifiable;
        categoryTypes[DocumentCategory.BoE] = DocumentType.Transferable;
        categoryTypes[DocumentCategory.PN] = DocumentType.Transferable;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(isAuthorizedIssuer[msg.sender], "Not authorized to issue documents");
        _;
    }
    
    function authorizeIssuer(address _issuer) public {
        require(_issuer != address(0), "Invalid issuer address");
        isAuthorizedIssuer[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }
    
    function authorizeVerifier(DocumentCategory _category, address _verifier) public {
        require(_verifier != address(0), "Invalid verifier address");
        authorizedVerifiers[_category].push(_verifier);
        emit VerifierAuthorized(_category, _verifier);
    }
    
    function issueDocument(
        string memory _documentID,
        string memory _documentName,
        DocumentCategory _category,
        address _holder
    ) public onlyAuthorizedIssuer {
        require(documents[_documentID].issuer == address(0), "Document already exists");
        require(_holder != address(0), "Invalid holder address");
        
        Document storage newDoc = documents[_documentID];
        newDoc.documentID = _documentID;
        newDoc.documentName = _documentName;
        newDoc.docType = categoryTypes[_category];
        newDoc.category = _category;
        newDoc.issuer = msg.sender;
        newDoc.holder = _holder;
        newDoc.isVerified = false;
        newDoc.issueDate = block.timestamp;
        newDoc.isActive = true;
        
        emit DocumentIssued(_documentID, _category, msg.sender, _holder);
    }
    
    function transferDocument(string memory _documentID, address _newHolder) public {
        Document storage doc = documents[_documentID];
        require(doc.issuer != address(0), "Document does not exist");
        require(doc.isActive, "Document is not active");
        require(doc.holder == msg.sender, "Only the holder can transfer");
        require(_newHolder != address(0), "Invalid new holder address");
        require(
            doc.docType == DocumentType.Transferable || 
            doc.docType == DocumentType.Both, 
            "Document is not transferable"
        );
        
        address previousHolder = doc.holder;
        doc.holder = _newHolder;
        emit DocumentTransferred(_documentID, previousHolder, _newHolder);
    }
    
    function verifyDocument(string memory _documentID) public {
        Document storage doc = documents[_documentID];
        require(doc.issuer != address(0), "Document does not exist");
        require(doc.isActive, "Document is not active");
        require(
            doc.docType == DocumentType.Verifiable || 
            doc.docType == DocumentType.Both, 
            "Document is not verifiable"
        );
        
        bool isAuthorizedVerifier = false;
        address[] storage verifiers = authorizedVerifiers[doc.category];
        for (uint i = 0; i < verifiers.length; i++) {
            if (verifiers[i] == msg.sender) {
                isAuthorizedVerifier = true;
                break;
            }
        }
        require(isAuthorizedVerifier, "Not authorized to verify this document type");
        
        doc.isVerified = true;
        doc.verifiers.push(msg.sender);
        emit DocumentVerified(_documentID, msg.sender);
    }
    
    function invalidateDocument(string memory _documentID) public {
        Document storage doc = documents[_documentID];
        require(doc.issuer == msg.sender, "Only issuer can invalidate");
        require(doc.isActive, "Document is already inactive");
        
        doc.isActive = false;
        emit DocumentInvalidated(_documentID);
    }
    
    function getDocument(string memory _documentID) public view returns (
        string memory documentName,
        DocumentType docType,
        DocumentCategory category,
        address issuer,
        address holder,
        bool isVerified,
        uint256 issueDate,
        bool isActive
    ) {
        Document storage doc = documents[_documentID];
        return (
            doc.documentName,
            doc.docType,
            doc.category,
            doc.issuer,
            doc.holder,
            doc.isVerified,
            doc.issueDate,
            doc.isActive
        );
    }
    
    function isDocumentVerifiable(DocumentCategory _category) public view returns (bool) {
        DocumentType docType = categoryTypes[_category];
        return docType == DocumentType.Verifiable || docType == DocumentType.Both;
    }
    
    function isDocumentTransferable(DocumentCategory _category) public view returns (bool) {
        DocumentType docType = categoryTypes[_category];
        return docType == DocumentType.Transferable || docType == DocumentType.Both;
    }
}