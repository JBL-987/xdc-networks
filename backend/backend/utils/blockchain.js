const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider("https://rpc.apothem.network");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_TESTNET, provider);

const contractABI = require("../../contracts/artifacts/MLETR.json"); 
const contractAddress = "0x4C257097Ca26dE2A6b817FA7b1C8464E9Bbf79FE";
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function submitDocument(hash, metadataURI, expirationDate) {
  try {
    console.log("Submitting document...");
    const tx = await contract.submitDocument(
      hash,
      metadataURI,
      expirationDate,
      {
          gasLimit: 1000000, 
      }
  );
  await tx.wait(); 
  console.log("Transaction successful:", tx.hash);    console.log("Transaction hash: ", tx.hash);
    await tx.wait();
    console.log("expDate: ", expirationDate);
    console.log("Transaction successful: ", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error submitting document: ", error);
    throw new Error("Failed to submit document.");
  }
}

async function getDocumentDetails(documentId) {
  try {
    // Fetch document details from the smart contract
    const document = await contract.getDocument(documentId);

    const parseBigNumber = (value) => {
      return value && typeof value.toNumber === "function" ? value.toNumber() : value;
    };

    const documentDetails = {
      owner: document[0],
      hash: document[1],
      timestamp: parseBigNumber(document[2]),
      isVerified: document[3],
      metadataURI: document[4],
      status: document[5],
      issuer: document[6],
      expirationDate: parseBigNumber(document[7]),
      lastVerificationTimestamp: parseBigNumber(document[8]),
    };

    return documentDetails;
  } catch (err) {
    console.error("Error fetching document details:", err);
    throw err;
  }
}

async function verifyDocument(documentId, documentType, verificationMethod) {
  console.log("Verifying document...");
  const tx = await contract.verifyDocument(documentId, documentType, verificationMethod);
  await tx.wait();
  return tx.hash;
}

module.exports = { submitDocument, getDocumentDetails, contract, verifyDocument };
