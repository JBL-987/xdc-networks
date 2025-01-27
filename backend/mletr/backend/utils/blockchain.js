const { ethers } = require("ethers");
require("dotenv").config(); // Load .env variables

const provider = new ethers.JsonRpcProvider("https://rpc.apothem.network", {
    name: "apothem",
    chainId: 51,
    ensAddress: null
  });

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log("Wallet address: ", wallet.address);    

const CONTRACT_ABI = require("../../contracts/artifacts/MLETR.json"); 
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

module.exports = { wallet, contract };
