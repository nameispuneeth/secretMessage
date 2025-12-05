import { useEffect, useState } from "react";
import NotFound from "../NotFoundPage";
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
export default function Message() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [name, setname] = useState("");
    const [msg, setmsg] = useState("");
    const [isvalid, setisvalid] = useState(true);
    const [loading, setloading] = useState(false);
    const [msgSentSuc, setmsgSentSuc] = useState(false);

    let Spinner = () => {
        return (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-white border-t-gray-700 rounded-full animate-spin"></div>
            </div>
        );
    }
    const messageSent = () => {
        return (
            <>
                <p className=" text-xl font-extrabold text-green-700"> Message Sent Successfully 🎉</p>
                <p className="p-4 border-2 rounded-sm cursor-pointer border-gray-600 bg-[rgba(50,50,50,1)] font-extrabold hover:bg-black text-white" onClick={() => navigate("/")}> Get Your Own Link </p>
                <p className="p-4 border-2 rounded-sm border-gray-600 cursor-pointer bg-[rgba(50,50,50,1)] font-extrabold hover:bg-black text-white" onClick={() => setmsgSentSuc(false)}> Send Message Again </p>
            </>
        )
    }
    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8000/api/sendMessage/${token}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: msg
            })
        })

        const data = await response.json();
        if (data.status == "ok") {
            toast.success("Message Sent Successfully");
            setmsg("");
            setmsgSentSuc(true);
        } else {
            toast.error(data.error);
        }
    }

    const isValidToken = async () => {
        setloading(true);
        const response = await fetch(`http://localhost:8000/api/ValidToken/${token}`, {
            method: "GET"
        })
        const data = await response.json();
        if (data.status == "ok") {
            setname(data.name);
        } else {
            toast.error("Not A Valid URL");
            setisvalid(false);
        }
        setloading(false);
    }
    useEffect(() => {
        isValidToken();
    }, [])

    return (
        <>
            {!isvalid ? <NotFound /> :
                (
                    <div className="bg-[radial-gradient(circle_at_center,#2c2c2c,#0d0d0d)] flex flex-col justify-center items-center min-h-screen text-white p-6 overflow-hidden" >
                        {loading ? <Spinner /> :
                            (
                                <div className="rounded-2xl shadow-lg p-8 w-full max-w-md bg-[rgba(0,0,0,0.4)] space-y-10 flex flex-col items-center justify-center ">
                                    {msgSentSuc ? messageSent() :
                                        (
                                            <>
                                                <p className="text-white font-medium text-xl"> You Are Sending Message To <span className="font-bold text-gray-300">` {name} `</span></p>
                                                <textarea rows={10} cols={20} value={msg} onChange={(e) => setmsg(e.target.value)} className="p-4 bg-gray-950 font-extralight w-full text-2xl custom-scrollbar border-2 border-gray-500" ></textarea>
                                                <button className="w-full h-14 rounded-lg bg-[rgba(30,30,30,1)] hover:bg-black border-2 cursor-pointer border-gray-600 text-center text-lg font-bold mt-6 mb-6" onClick={() => handleSubmit()}>Submit</button>
                                            </>
                                        )}
                                </div>
                            )
                        }

                    </div>
                )
            }
        </>
    )
}