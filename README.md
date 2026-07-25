# Supply Chain DApp

A minimal Supply Chain dApp that uses Hardhat for compilation (ABI/artifacts) and Remix + MetaMask for manual deployment. The React/Vite frontend connects to whichever contract you deploy on Sepolia by reading the contract address from .env.

**Quick Start**

- **Prerequisites:** `node` (>=16), `npm`, MetaMask browser extension.
- **Compile contracts (generate ABI/artifacts):**
```bash
# from repo root
npm install
npx hardhat compile
```
- **Deploy with Remix (Injected Provider - MetaMask on Sepolia):**
  - Open SupplyChain.sol in Remix (paste source or import from repo).
  - Compile in Remix, select "Injected Provider - MetaMask", switch MetaMask to Sepolia, deploy.
  - Copy the deployed contract address.
- **Configure frontend & run:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit frontend/.env and set VITE_CONTRACT_ADDRESS=0xYourRemixDeployedAddress
npm run dev
```
- Open the Vite URL (usually `http://localhost:5173`) and connect MetaMask to interact with the deployed contract.

**Workflow (what changed)**

- Compile only with Hardhat to produce artifacts/ABI used by the frontend.
- Deploy manually from Remix using `Injected Provider - MetaMask` (Sepolia).
- Frontend reads the deployed address from .env (`VITE_CONTRACT_ADDRESS`) and uses the ABI at SupplyChain.json.
- Legacy Hardhat deployment script removed to avoid confusion.

**Directory Layout**

- contracts — Solidity source (use in Remix or compile with Hardhat).
- artifacts — Hardhat output (ABI + bytecode). Frontend imports ABI from here.
- frontend — React + Vite app.
  - .env.example — example environment file.
  - blockchain.js — loads ABI and `VITE_CONTRACT_ADDRESS`.
- hardhat.config.ts — config used for compilation only.

**Important Files (quick links)**

- Contract: SupplyChain.sol  
- ABI used by frontend: SupplyChain.json  
- Frontend env example: .env.example  
- Frontend blockchain integration: blockchain.js

**Troubleshooting**

- If the frontend alerts about missing `VITE_CONTRACT_ADDRESS`, ensure .env is created from .env.example and contains your deployed address.
- If MetaMask shows the wrong network, switch to Sepolia (or the network where you deployed).
- If ABI seems out-of-date after contract changes, run:
```bash
npx hardhat compile
```
and restart the frontend (`npm run dev`).

**Maintainers / Contributing**

- To change the contract, edit SupplyChain.sol, then:
```bash
npx hardhat compile
```
- After compiling, re-deploy from Remix (or re-use deployed address if ABI-compatible).

**Notes**

- hardhat.config.ts and artifacts are kept so you can compile locally and supply the ABI to the frontend. Hardhat is not used to deploy contracts in this workflow.
- `scripts/deploy.js` and other legacy deployment helpers were removed to avoid accidental Hardhat deployment.
