import { useState } from "react"
import { getContract } from "../blockchain"
import { Store, Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export default function Retailer(){

  const [productId,setProductId] = useState("")
  const [location,setLocation] = useState("")
  const [isLoading,setIsLoading] = useState(false)

  const RETAILER_ADDRESS = "0x0000000000000000000000000000000000000003"

  const receiveProduct = async () => {

    if(!productId || !location){
      return toast.warn("Enter Product ID and Location")
    }

    setIsLoading(true)

    const toastId = toast.loading("Receiving product...")

    try{

      const contract = await getContract()

      const tx = await contract.transferProduct(
        Number(productId),
        RETAILER_ADDRESS,
        location
      )

      await tx.wait()

      toast.update(toastId,{
        render:"Product received by Retailer",
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
        <Store className="w-6 h-6 text-emerald-400"/>
        <h2 className="text-xl font-semibold text-slate-100">
          Retailer
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
          placeholder="Retail Store Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <button
          onClick={receiveProduct}
          className="btn-primary"
        >
          {isLoading ? <Loader2 className="animate-spin"/> : "Receive Product"}
        </button>

      </div>

    </div>

  )
}