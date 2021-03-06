import { ethers } from "hardhat";

const TeamWallet = "0x2B520f1395fd8EAF85C67C87A949997812A1B6B9";
const LotteryWallet = "0x21A590F1055AF8780AfcD62ABe9DB0dAce5104a8";
const TreasuryWallet = "0x35bF3e711A2413A85Bab840E1E38088bd4Cc1Cc9";

import { UzmiMarketplace__factory } from "../typechain";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    try {
        const UzmiToken = await ethers.getContractFactory("UzmiToken");
        const uzmiToken = await UzmiToken.deploy();
        const contractUzmiToken = await uzmiToken.deployed();
        console.log(
            "Contract UzmiToken deployed to address:",
            uzmiToken.address
        );

        await contractUzmiToken.setTeamWallet(TeamWallet);
        await contractUzmiToken.setLotteryWallet(LotteryWallet);

        //Dragon Scale
        const DragonScale = await ethers.getContractFactory("DragonScale");
        const dragonScale = await DragonScale.deploy();
        const contractDragonScale = await dragonScale.deployed();
        console.log(
            "Contract DragonScale deployed to address:",
            dragonScale.address
        );

        await contractDragonScale.setTeamWallet(TeamWallet);
        await contractDragonScale.setLotteryWallet(LotteryWallet);
 
        //NFTs
        const UzmiNft = await ethers.getContractFactory("UzmiNft");
        const uzmiNft = await UzmiNft.deploy();
        const contractUzmiNft = await uzmiNft.deployed();

        console.log(
            "Contract Uzmi NFTs deployed to address:",
            uzmiNft.address
        );

        //Lottery
        const sevenDays = Date.now() + ( 60 * 60 * 24 * 7 );
        const nextDraw = Math.floor(sevenDays / 1000);
        const UzmiLottery = await ethers.getContractFactory("UzmiLottery");
        const uzmiLottery = await UzmiLottery.deploy(contractUzmiToken.address, LotteryWallet, nextDraw);
        const contractUzmiLottery = await uzmiLottery.deployed();

        console.log(
            "Contract Uzmi Lottery deployed to address:",
            contractUzmiLottery.address
        );

        //Marketplace
        const UzmiMarketplace: UzmiMarketplace__factory = await ethers.getContractFactory("UzmiMarketplace");
        const uzmiMarketplace = await UzmiMarketplace.deploy(
            uzmiToken.address,
            uzmiNft.address,
            TreasuryWallet,
            TeamWallet,
            LotteryWallet
        );

        const contractUzmiMarketplace = await uzmiMarketplace.deployed();

        console.log(
            "Contract Uzmi Marketplace deployed to address:",
            contractUzmiMarketplace.address
        );
    } catch (e) {
        console.log(e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
