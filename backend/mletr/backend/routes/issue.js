const express = require("express");
const { ethers } = require("ethers");
const {contract} =require("../utils/blockchain")
require("dotenv").config();
const router = express.Router();
console.log("contract imported:", contract);


router.post("/", async (req, res) => {
  const { documentID, documentName, category, holder, documentHash } = req.body;
  if (!documentID || !documentName || !category || !holder || !documentHash) {
    return res.status(400).json({ error: "Missing required fields" });
  }



  try {
    const formattedHash = documentHash.startsWith("0x") ? documentHash : `0x${documentHash}`;
    console.log("formattedHash:", formattedHash);
    const tx = await contract.issueDocument(documentID, documentName, category, holder, formattedHash);
    await tx.wait();
    res.json({ message: "Document issued", transactionHash: tx.hash });
  } catch (error) {
    console.error("Error issuing document:", error);
    res.status(500).json({ error: "Failed to issue document", details: error.message });
  }
});

module.exports = router;
