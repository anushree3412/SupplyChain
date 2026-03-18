import { useState, useEffect } from "react"
import { getContract } from "./blockchain"
import { PackageSearch, Wallet } from "lucide-react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Manufacturer from "./pages/Manufacturer"
import Distributor from "./pages/Distributor"
import Retailer from "./pages/Retailer"
import Tracking from "./pages/Tracking"

export default function App() {
    const [account, setAccount] = useState(null)

    useEffect(() => {
        // Attempt to fetch current wallet on load if connected
        const connectWallet = async () => {
            try {
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0])
                    }

                    // Listen for account changes
                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length > 0) {
                            setAccount(accounts[0]);
                        } else {
                            setAccount(null);
                        }
                    });
                }
            } catch (err) {
                console.error("Failed to connect wallet on load:", err)
            }
        }
        connectWallet()
    }, [])

    const connect = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
        } catch (err) {
            console.error(err)
        }
    }

    // Format address for display `0x1234...5678`
    const shortenAddress = (addr) => {
        if (!addr) return ""
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    return (
        <div className="min-h-screen pb-12">
            {/* Notifications */}
            <ToastContainer
                position="bottom-right"
                theme="dark"
                toastClassName="bg-slate-800 border border-slate-700 text-slate-200"
            />

            {/* Sticky Top Navigation */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-500/20 p-2 rounded-xl">
                            <PackageSearch className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Supply Chain DApp
                        </h1>
                    </div>

                    <div>
                        {account ? (
                            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-1.5 shadow-inner">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-sm font-medium text-slate-300 font-mono">
                                    {shortenAddress(account)}
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={connect}
                                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Wallet className="w-4 h-4" />
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Dashboard Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Action Modules */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Manufacturer />
                        <Distributor />
                        <div className="md:col-span-2">
                            <Retailer />
                        </div>
                    </div>

                    {/* Right Column: Tracking Panel */}
                    <div className="lg:col-span-5 h-full">
                        <div className="sticky top-24 h-full">
                            <Tracking />
                        </div>
                    </div>

                </div>
            </main>

        </div>
    )
}
