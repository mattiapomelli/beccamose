import { expect } from "chai";
import { ethers } from "hardhat";
import { Beccamose } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Beccamose", function () {
  // We define a fixture to reuse the same setup in every test.

  let Beccamose: Beccamose;
  let owner: SignerWithAddress;
  before(async () => {
    [owner] = await ethers.getSigners();
    const BeccamoseFactory = await ethers.getContractFactory("Beccamose");
    Beccamose = (await BeccamoseFactory.deploy(owner.address)) as Beccamose;
    await Beccamose.deployed();
  });

  describe("Deployment", function () {
    it("Should allow owner to mint", async function () {
      await Beccamose.safeMint(owner.address, "50", "50");
      const uri = await Beccamose.tokenURI(0);
      console.log(uri);
    });
  });
});
