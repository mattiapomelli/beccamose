// pages/api/mint.js
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import contracts from "~~/generated/deployedContracts";
import scaffoldConfig from "~~/scaffold.config";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

const CONTRACT_NAME = "Beccamose";

const deployedBeccamoseContract = contracts?.[scaffoldConfig.targetNetwork.id]?.[0]?.contracts?.[
  CONTRACT_NAME
] as Contract<ContractName>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { address, address1, address2 } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address, latitude, and longitude are required." });
  }

  // Use the mnemonic to restore the wallet (You can also use environment variables for security)
  const mnemonic = process.env.MNEMONIC || "";
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  // Connect to local network hardhat
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // TODO: Replace with Base

  const signer = wallet.connect(provider);
  const contract = new ethers.Contract(deployedBeccamoseContract.address, deployedBeccamoseContract.abi, signer);

  try {
    const tx = await contract.safeMint(address, address1, address2);
    await tx.wait();

    return res.status(200).json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    // @ts-expect-error
    return res.status(400).json({ error: "Error minting token: " + error.message });
  }
}
