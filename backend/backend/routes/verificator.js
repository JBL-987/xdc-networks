const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { submitDocument, getDocumentDetails,contract, verifyDocument } = require("../utils/blockchain");
console.log("submitDocument imported:", submitDocument);


const router = express.Router();
const upload = multer({ dest: "uploads/" });
const parseMetadataURI = (metadataURI) => {
  try {
    return JSON.parse(metadataURI); 
  } catch (e) {
    return metadataURI; 
  }
};


router.post("/upload", upload.single("file"), async (req, res) => {
  const { description, verificationMethod, documentType } = req.body;
  const file = req.file;

  if (!file || !description) {
    return res.status(400).json({ message: "File and description are required!" });
  }

  try {
    console.log("File path:", file.path);

    const fileHash = "0x" + crypto.createHash("sha256").update(file.path).digest("hex");
    const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

    const metadata = {
      filename: file.originalname,
      description: description,
    };
    const metadataURI = JSON.stringify(metadata);

    console.log("Submitting document with:");
    console.log("File hash:", fileHash);
    console.log("Metadata URI:", metadataURI);
    console.log("Expiration Date:", expirationDate);

    const txHash = await submitDocument(fileHash, metadataURI, expirationDate);
    console.log("Document submitted with transaction hash:", txHash);

    const documentId = await contract.hashToDocumentId(fileHash);

    console.log("Verifying document with documentId:", Number(documentId));

    const verificationTxHash = await verifyDocument(
      Number(documentId), 
      documentType,
      verificationMethod
    );
    console.log("Document verified successfully. Verification transaction hash:", verificationTxHash);

    const documentDetails = await getDocumentDetails(Number(documentId));

    const formattedDocumentDetails = {
      owner: documentDetails.owner,
      hash: documentDetails.hash,
      timestamp: documentDetails.timestamp.toString(),
      isVerified: documentDetails.isVerified,
      metadataURI: JSON.parse(documentDetails.metadataURI),
      status: Number(documentDetails.status),
      issuer: documentDetails.issuer,
      expirationDate: documentDetails.expirationDate.toString(),
      lastVerificationTimestamp: documentDetails.lastVerificationTimestamp.toString(),
    };

    res.status(200).json({
      message: "Document uploaded and verified successfully!",
      txHash,
      verificationTxHash,
      documentDetails: formattedDocumentDetails,
    });
  } catch (err) {
    console.error("Error in /upload:", err);
    res.status(500).json({ message: "An error occurred while uploading and verifying the document." });
  }
});



router.get("/getalldoc", async (req, res) => {
  try {
    const totalDocs = await contract.documentCount();

    let allDocuments = [];
    console.log("fetching all documents");
    console.log("totalDocs: ", totalDocs);
    for (let i = 1; i <= totalDocs; i++) {
      const documentDetails = await getDocumentDetails(i);
      const formattedDocumentDetails = {
        owner: documentDetails.owner,
        hash: documentDetails.hash,
        timestamp: documentDetails.timestamp.toString(),
        isVerified: documentDetails.isVerified,
        metadataURI: parseMetadataURI(documentDetails.metadataURI),
        status: Number(documentDetails.status),
        issuer: documentDetails.issuer,
        expirationDate: documentDetails.expirationDate.toString(),
        lastVerificationTimestamp: documentDetails.lastVerificationTimestamp.toString(),
      };
      allDocuments.push(formattedDocumentDetails);
    }

    res.status(200).json({ allDocuments });
  } catch (err) {
    console.error("Error fetching all documents:", err);
    res.status(500).json({ message: "Error fetching all documents." });
  }
});

router.get("/getdocbyid/:id", async (req, res) => {
  try {
    const documentId = Number(req.params.id);
    const documentDetails = await getDocumentDetails(documentId);

    const formattedDocumentDetails = {
      owner: documentDetails.owner,
      hash: documentDetails.hash,
      timestamp: documentDetails.timestamp.toString(),
      isVerified: documentDetails.isVerified,
      metadataURI: parseMetadataURI(documentDetails.metadataURI),
      status: Number(documentDetails.status),
      issuer: documentDetails.issuer,
      expirationDate: documentDetails.expirationDate.toString(),
      lastVerificationTimestamp: documentDetails.lastVerificationTimestamp.toString(),
    };

    res.status(200).json({ document: formattedDocumentDetails });
  } catch (err) {
    console.error("Error fetching document by ID:", err);
    res.status(500).json({ message: "Error fetching document by ID." });
  }
});

router.get("/getdocbyowner/:owner", async (req, res) => {
  try {
    const ownerAddress = req.params.owner.toLowerCase();
    const totalDocs = await contract.documentCount();

    let ownerDocuments = [];
    for (let i = 1; i <= totalDocs; i++) {
      const documentDetails = await getDocumentDetails(i);

      if (documentDetails.owner.toLowerCase() === ownerAddress) {
        const formattedDocumentDetails = {
          owner: documentDetails.owner,
          hash: documentDetails.hash,
          timestamp: documentDetails.timestamp.toString(),
          isVerified: documentDetails.isVerified,
          metadataURI: parseMetadataURI(documentDetails.metadataURI),
          status: Number(documentDetails.status),
          issuer: documentDetails.issuer,
          expirationDate: documentDetails.expirationDate.toString(),
          lastVerificationTimestamp: documentDetails.lastVerificationTimestamp.toString(),
        };
        ownerDocuments.push(formattedDocumentDetails);
      }
    }

    res.status(200).json({ ownerDocuments });
  } catch (err) {
    console.error("Error fetching documents by owner:", err);
    res.status(500).json({ message: "Error fetching documents by owner." });
  }
});


module.exports = router;
