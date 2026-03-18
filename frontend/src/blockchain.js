import { ethers } from "ethers";
import SupplyChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getContract = async () => {

    if (!window.ethereum) {
        alert("Please install MetaMask");
        return null;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SupplyChain.abi,
        signer
    );

    return contract;
};