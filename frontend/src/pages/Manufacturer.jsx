import { useState } from "react"
import { getContract } from "../blockchain"
import { Factory, Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export default function Manufacturer() {

    const [productName, setProductName] = useState("")
    const [productId, setProductId] = useState("")
    const [location, setLocation] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const addProduct = async () => {

        if (!productName || !productId || !location) {
            return toast.warn("Please enter ID, Name and Location")
        }

        setIsLoading(true)
        const toastId = toast.loading("Adding product to blockchain...")

        try {

            const contract = await getContract()
            if (!contract) {
                toast.dismiss(toastId)
                return setIsLoading(false)
            }

            const tx = await contract.addProduct(
                Number(productId),
                productName,
                location
            )

            toast.update(toastId, {
                render: "Transaction pending...",
                type: "info",
                isLoading: true
            })

            await tx.wait()

            toast.update(toastId, {
                render: "Product Added Successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000
            })

            setProductName("")
            setProductId("")
            setLocation("")

        } catch (err) {
            console.error(err)
            toast.update(toastId, {
                render: "Failed to add product",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="glass-card group w-full relative overflow-hidden">

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Factory className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-100 tracking-tight">
                    Manufacturer
                </h2>
            </div>

            <div className="space-y-4 relative z-10">

                <div className="space-y-1.5">
                    <label className="text-sm text-slate-400 pl-1">Product ID</label>
                    <input
                        className="glass-input"
                        type="number"
                        placeholder="e.g. 1001"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm text-slate-400 pl-1">Product Name</label>
                    <input
                        className="glass-input"
                        type="text"
                        placeholder="e.g. Premium Coffee Beans"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm text-slate-400 pl-1">Location</label>
                    <input
                        className="glass-input"
                        type="text"
                        placeholder="e.g. Mumbai Factory"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <button
                    onClick={addProduct}
                    disabled={isLoading}
                    className="btn-primary mt-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </>
                    ) : (
                        <>
                            <Factory className="w-5 h-5" /> Add Product
                        </>
                    )}
                </button>

            </div>
        </div>
    )
}