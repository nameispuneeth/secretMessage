import { Copy,CheckIcon } from "lucide-react"
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function Home(){
    const navigate=useNavigate();
    const token=localStorage.getItem("token") || sessionStorage.getItem("token");
    const urlToken=localStorage.getItem("URLtoken") || sessionStorage.getItem("URLtoken");
    if(!token){
        toast.error("Login Required");
        navigate("/signin");
    }
    const URL=`${window.location.origin}/${urlToken}`;
    const [urlCopy,seturlCopy]=useState(false);

    return(
        <div className="bg-[radial-gradient(circle_at_center,#2c2c2c,#0d0d0d)] flex flex-col justify-center items-center min-h-screen text-white p-6 overflow-hidden" >
            <div className="rounded-2xl shadow-lg p-8 w-full max-w-md bg-[rgba(0,0,0,0.4)] space-y-10 flex-1 flex-col items-center justify-center ">
                <div className="space-y-3 ">
                <p className="w-full text-md font-bold text-center">Your Link For Secret Message :</p>
                <div className="w-full rounded-lg bg-[rgba(50,50,50,1)] text-center text-xl font-light flex justify-between items-center p-2">
                    <p className=" overflow-x-auto custom-scrollbar m-2 grow text-left whitespace-nowrap">{URL}</p>
                    {urlCopy?
                    (<CheckIcon className="cursor-pointer m-2 shrink-0 " size={28} color="green" />):
                    (<Copy className="cursor-pointer m-2 shrink-0" size={24} onClick={()=>{
                        navigator.clipboard.writeText(URL);
                        seturlCopy(true);
                        setTimeout(()=>{
                            seturlCopy(false);
                        },4000);
                    }}/>)}
                </div>
                <hr className="mt-10 border-t border-dashed"/>
                </div>
                <div>
                    <p>Your Messages :</p>

                </div>
            </div>
        </div>
    )
}