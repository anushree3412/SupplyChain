import { useState } from "react"
import { getContract } from "../blockchain"
import { PackageSearch, Loader2, MapPin, Search, Navigation } from "lucide-react"

export default function Tracking() {

    const [productId, setProductId] = useState("")
    const [productDetails, setProductDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const getProductDetails = async () => {

        if (!productId) {
            setError("Please enter a Product ID")
            return
        }

        setIsLoading(true)
        setError("")
        setProductDetails(null)

        try {

            const contract = await getContract()
            if (!contract) return setIsLoading(false)

            const details = await contract.getProduct(productId)

            const id = details[0].toString()

            // ✅ FIX: handle product not found
            if (id === "0") {
                setError("Product does not exist")
                return
            }

            const name = details[1]
            const manufacturer = details[2]
            const owner = details[3]
            const location = details[4]

            let status = "With Manufacturer"

            if(owner === "0x0000000000000000000000000000000000000002"){
                status = "With Distributor"
            }

            if(owner === "0x0000000000000000000000000000000000000003"){
                status = "With Retailer"
            }

            setProductDetails({
                id,
                name,
                manufacturer,
                owner,
                location,
                status
            })

        } catch (err) {

            console.error(err)
            setError("Error fetching product details")

        } finally {

            setIsLoading(false)

        }

    }

    const getStatusColor = (status) => {

        if (status?.includes("Manufacturer")) return "bg-indigo-500 text-white"
        if (status?.includes("Distributor")) return "bg-amber-500 text-white"
        if (status?.includes("Retailer")) return "bg-emerald-500 text-white"

        return "bg-slate-600 text-slate-200"

    }

    return (

        <div className="glass-card group h-full relative overflow-hidden flex flex-col">

            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-inner">
                    <PackageSearch className="w-6 h-6 text-blue-400" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-100 tracking-tight text-shadow">
                        Track Product
                    </h2>
                    <p className="text-xs text-slate-400">
                        Search blockchain records
                    </p>
                </div>
            </div>

            <div className="space-y-4 relative z-10 mb-6">

                <label className="text-sm font-medium text-slate-400 pl-1">
                    Product ID
                </label>

                <div className="flex gap-3">

                    <input
                        className="glass-input focus:ring-blue-500/50 focus:border-blue-500/50 w-full"
                        type="number"
                        placeholder="e.g. 1001"
                        value={productId}
                        onChange={(e)=>setProductId(e.target.value)}
                        onKeyDown={(e)=> e.key === 'Enter' && getProductDetails()}
                        disabled={isLoading}
                    />

                    <button
                        onClick={getProductDetails}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
                    >

                        {isLoading
                            ? <Loader2 className="w-5 h-5 animate-spin"/>
                            : <Search className="w-5 h-5"/>
                        }

                    </button>

                </div>

                {error && (
                    <p className="text-rose-400 text-sm pl-1 animate-pulse">
                        {error}
                    </p>
                )}

            </div>

            <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700/50 p-5 mt-auto relative z-10 transition-all duration-300">

                {!productDetails && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-10 opacity-60">
                        <PackageSearch className="w-12 h-12"/>
                        <p className="text-sm">
                            Search for a product to view details
                        </p>
                    </div>
                )}

                {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500"/>
                        <p className="text-sm animate-pulse">
                            Reading from blockchain...
                        </p>
                    </div>
                )}

                {productDetails && !isLoading && (

                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">

                            <div>
                                <h3 className="text-lg font-semibold text-slate-200">
                                    {productDetails.name}
                                </h3>

                                <p className="text-xs text-slate-400 font-mono mt-1">
                                    ID: #{productDetails.id}
                                </p>
                            </div>

                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(productDetails.status)}`}>
                                {productDetails.status}
                            </span>

                        </div>

                        <div className="grid grid-cols-1 gap-4">

                            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">
                                        Current Location
                                    </p>
                                    <p className="text-sm text-slate-200 font-medium">
                                        {productDetails.location}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex items-start gap-3">
                                <Navigation className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">
                                        Current Owner Address
                                    </p>
                                    <p className="text-xs font-mono text-slate-300 truncate">
                                        {productDetails.owner}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center mt-0.5">
                                    <span className="text-[10px] text-slate-300">
                                        MF
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">
                                        Manufacturer Address
                                    </p>
                                    <p className="text-xs font-mono text-slate-500 truncate">
                                        {productDetails.manufacturer}
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    )
}