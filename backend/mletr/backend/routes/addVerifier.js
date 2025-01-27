const express = require("express");
const { ethers } = require("ethers");
const {contract} =require("../utils/blockchain")
require("dotenv").config();
const router = express.Router();


router.post("/", async (req, res) => {

  const {category, verifierAddress} = req.body;

  if(!category || !verifierAddress){
    return res.status(400).json({error: "Missing required fields"});
  }

  try{
    const tx = await contract.authorizeVerifier(category, verifierAddress);
    await tx.wait();
    res.json({message: "Verifier added", transactionHash: tx.hash});
  }catch(error){
    console.error("Error adding verifier:", error);
    res.status(500).json({error: "Failed to add verifier", details: error.message});
  }
  
});

module.exports = router;
