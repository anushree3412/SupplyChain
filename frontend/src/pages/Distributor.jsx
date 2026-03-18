import { useState } from "react"
import { getContract } from "../blockchain"
import { Truck, Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export default function Distributor(){

  const [productId,setProductId] = useState("")
  const [location,setLocation] = useState("")
  const [isLoading,setIsLoading] = useState(false)

  const DISTRIBUTOR_ADDRESS = "0x0000000000000000000000000000000000000002"

  const transferToDistributor = async () => {

    if(!productId || !location){
      return toast.warn("Enter Product ID and Location")
    }

    setIsLoading(true)

    const toastId = toast.loading("Transferring product...")

    try{

      const contract = await getContract()

      const tx = await contract.transferProduct(
        Number(productId),
        DISTRIBUTOR_ADDRESS,
        location
      )

      await tx.wait()

      toast.update(toastId,{
        render:"Product transferred to Distributor",
        type:"success",
        isLoading:false,
        autoClose:3000
      })

      setProductId("")
      setLocation("")

    }catch(err){

      console.error(err)

      toast.update(toastId,{
        render:"Failed to transfer product",
        type:"error",
        isLoading:false
      })

    }finally{

      setIsLoading(false)

    }

  }

  return(
    <div className="glass-card">

      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-6 h-6 text-amber-500"/>
        <h2 className="text-xl font-semibold text-slate-100">
          Distributor
        </h2>
      </div>

      <div className="space-y-4">

        <input
          className="glass-input"
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e)=>setProductId(e.target.value)}
        />

        <input
          className="glass-input"
          type="text"
          placeholder="Distributor Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <button
          onClick={transferToDistributor}
          className="btn-primary"
        >
          {isLoading ? <Loader2 className="animate-spin"/> : "Transfer Product"}
        </button>

      </div>

    </div>
  )
}