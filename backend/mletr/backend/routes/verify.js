const express = require("express");
const { ethers } = require("ethers");
const { contract } = require("../utils/blockchain");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();




function computeHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
  console.log("Computed hash (hex):", hash);
  
  try {
    const arrayifiedHash = ethers.getBytes("0x" + hash);
    console.log("Arrayified hash (BytesLike):", arrayifiedHash);
    return arrayifiedHash;
  } catch (error) {
    console.error("Error in arrayify:", error.message);
    throw error; // Re-throw to see it higher up in the stack
  }
}


router.post("/", async (req, res) => {
  const { documentID, filePath } = req.body;
  if (!documentID || !filePath) {
    return res.status(400).json({ error: "Document ID and file path are required" });
  }

  try {
    const recomputedHash = computeHash(filePath);
    console.log("Recomputed Hash (Bytes32):", recomputedHash);
    const tx = await contract.verifyDocumentHash(documentID, recomputedHash);
    await tx.wait();
    res.json({ message: "Document verified", transactionHash: tx.hash });
  } catch (error) {
    console.error("Error verifying document:", error);
    res.status(500).json({ error: "Verification failed", details: error.message });
  }
});

module.exports = router;
