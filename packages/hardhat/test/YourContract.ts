import { expect } from "chai";
import { ethers } from "hardhat";
import { Beccamose } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Beccamose", function () {
  // We define a fixture to reuse the same setup in every test.

  let Beccamose: Beccamose;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;
  let address2: SignerWithAddress;
  before(async () => {
    [owner, address1, address2] = await ethers.getSigners();
    const BeccamoseFactory = await ethers.getContractFactory("Beccamose");
    Beccamose = (await BeccamoseFactory.deploy(owner.address)) as Beccamose;
    await Beccamose.deployed();
  });

  describe("Deployment", function () {
    it("Should allow owner to mint", async function () {
      await Beccamose.safeMint(owner.address, address1.address, address2.address);
      const uri = await Beccamose.tokenURI(0);
      console.log(uri);
    });
  });
});
