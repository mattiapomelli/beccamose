import { verifyAddress } from "../../utils/verifyAddress";
import { task } from "hardhat/config";

task("deploy-base", "Deploy all contracts")
  .addFlag("verify", "verify contracts on etherscan")
  .setAction(async (args, { ethers, network }) => {
    console.log("Deploy task");

    const { verify } = args;
    console.log("Network:", network.name);

    const [deployer] = await ethers.getSigners();
    console.log("Using address: ", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Balance: ", ethers.utils.formatEther(balance));

    const Beccamose = await ethers.getContractFactory("Beccamose");
    const beccamose = await Beccamose.deploy();
    await beccamose.deployed();

    if (verify) {
      await verifyAddress(beccamose.address);
    }

    console.log("Deployed to:", beccamose.address);
  });
