import { ethers } from "ethers";
import SupplyChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export const getContract = async () => {

    if (!window.ethereum) {
        alert("Please install MetaMask");
        return null;
    }

    if (!CONTRACT_ADDRESS) {
        alert(
            "Please set VITE_CONTRACT_ADDRESS in frontend/.env to your Remix-deployed contract address."
        );
        return null;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, SupplyChain.abi, signer);
};