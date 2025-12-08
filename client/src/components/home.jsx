import { Copy,CheckIcon,Trash ,RefreshCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const [messagesLoading,setmessagesLoading]=useState(false);
    const navigate=useNavigate();
    const urlToken=useRef("");
    const [loading,setloading]=useState(false);
    const [messages,setmessages]=useState([]);

   

    const fetchDetails=async()=>{
        const token=localStorage.getItem("token") || sessionStorage.getItem("token");
        if(!token){
            toast.error("Login Required");
            navigate("/signin");
            return;
        }
        let response=await fetch("http://localhost:8000/api/FetchUserDetails",{
            method:"GET",
            headers:{
                'authorization':token,
                'Content-Type':'application/json'
            },
        })
        
        let data=await response.json();

        if(data.status=="ok"){
            setmessages(data.messages.reverse());
            urlToken.current=data.shareid;
        }else{
            toast.error(data.error);
            navigate("/");
        }
        setloading(false);
    }

    useEffect(()=>{
        setloading(true);
        fetchDetails();
    },[])

    const URL=`${window.location.origin}/u/${urlToken.current}`;
    const [urlCopy,seturlCopy]=useState(false);


    const MSGSpinner = () => {
        return (
            <div className="flex justify-center items-center">
          <div className="w-6 h-6 border-4 border-gray-700 border-t-gray-200 rounded-full animate-spin"></div>
          </div>
        );
      };
      
    let Spinner = () => {
        return (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-white border-t-gray-700 rounded-full animate-spin"></div>
          </div>
        );
      }
      const deleteMSG=async (val)=>{
        const token=localStorage.getItem("token") || sessionStorage.getItem("token");
        const response=await fetch("http://localhost:8000/api/DeleteMSG",{
            method:"POST",
            headers:{
                'authorization':token,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                msg:val
            })
        })
        const data=await response.json();
        if(data.status=="ok"){
            toast.success("Message Deleted Successfully");
            setmessages(prev =>
                prev.filter(m => !(m.message === val.message && m.sentAt === val.sentAt))
            );
        }else{
            toast.error(data.error);
        }
      }
      let MessageCard=({val})=>{
        const [expanded,setexpanded]=useState(false);
        const limit=100;
        const [data,setdata]=useState((val.message).substring(0,limit));

        const pastdate=new Date(val.sentAt);
        const currDate=new Date();
        const diff=(currDate-pastdate)/1000;
        let dateStr="";
        let years=Math.floor(diff/(60*60*24*365));
        let months=Math.floor(diff/(60*60*24*30));
        let weeks=Math.floor(diff/(60*60*24*7));
        let days=Math.floor(diff/(60*60*24));
        let hours=Math.floor(diff/(60*60));
        let minutes=Math.floor(diff/60);
        let seconds=Math.floor(diff);

        if(years>0) dateStr=`${years} ${years>1?'Years':'Year'} Ago`
        else if(months>0) dateStr=`${months} ${months>1?'Months':'Month'} Ago`
        else if(weeks>0) dateStr=`${weeks} ${weeks>1?'Weeks':'Week'} Ago`
        else if(days>0) dateStr=`${days} ${days>1?'Days':'Day'} Ago`
        else if(hours>0) dateStr=`${hours} ${hours>1?'Hours':'Hour'} Ago`
        else if(minutes>0) dateStr=`${minutes} ${minutes>1?'Minutes':'Minute'} Ago`
        else  dateStr=`${seconds} ${seconds>1?'Seconds':'Second'} Ago`

      return (
    <div className="bg-[rgba(50,50,50,1)] rounded-sm p-2 m-3 overflow-hidden">
        <div className="flex justify-between">
            <div className="grow min-w-0 pr-2">
                <p className="text-md wrap-break-word overflow-hidden">{data}</p>

                {val.message.length > limit && !expanded && (
                    <p className="text-blue-500 cursor-pointer"
                       onClick={() => {
                           setexpanded(true);
                           setdata(val.message);
                       }}>
                        Show More...
                    </p>
                )}

                {val.message.length > limit && expanded && (
                    <p className="text-blue-500 cursor-pointer"
                       onClick={() => {
                           setexpanded(false);
                           setdata(val.message.substring(0, limit));
                       }}>
                        Show Less...
                    </p>
                )}
            </div>

            <Trash size={16} className="cursor-pointer shrink-0 m-2" onClick={()=>deleteMSG(val)}/>
        </div>

        <p className="text-sm font-extralight">{dateStr}</p>
    </div>
);

      }

      const ChangeURL=async()=>{
        const token=localStorage.getItem("token") || sessionStorage.getItem("token");
        const response=await fetch("http://localhost:8000/api/ChangeURL",{
            method:"GET",
            headers:{
                'authorization':token
            }
        });
        const data=await response.json();
        console.log(data);
        if(data.status=="ok"){
            toast.success("URL Changed SuccesFully");
            console.log(data);
            setmessages([]);
            urlToken.current=data.urlToken;
        }else{
            toast.error(data.error);
        }
      }

    return(
        <div className="bg-[radial-gradient(circle_at_center,#2c2c2c,#0d0d0d)] flex flex-col justify-center items-center min-h-screen text-white p-6 overflow-hidden" >
            {loading?<Spinner/>:
            (<div className="rounded-2xl shadow-lg p-8 w-full max-w-md bg-[rgba(0,0,0,0.4)] space-y-10 flex-1 flex-col items-center justify-center ">
                <div className="space-y-3">
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
                <div className="flex justify-center mb-0">
                <button className="m-2 bg-black border border-gray-300 items-center cursor-pointer p-3" onClick={()=>{
                      if (navigator.share) {
                        navigator.share({
                          title: "Check Out My Secret Message Link !!",
                          text: "Here is my secret message link:",
                          url: URL,
                        });
                      } else {
                        navigator.clipboard.writeText(URL);
                        toast.info("Link copied to clipboard");
                      }
                }}> Share </button>
                <button className="m-2 bg-black border border-gray-300 items-center cursor-pointer p-3" onClick={()=>ChangeURL()}> Change My URL </button>

                </div>
                <hr className="mt-5 border-t border-dashed"/>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <p className="text-xl">Your Messages :</p>
                        <RefreshCcw size={18} className="cursor-pointer" onClick={async()=>{
                            setmessagesLoading(true);
                            await fetchDetails();
                            setmessagesLoading(false);
                        }}/>
                    </div>
                    {messagesLoading && <p className="text-center bg-[rgba(50,50,50,1)] p-20 text-lg rounded-sm">{MSGSpinner()}</p>}
                    {messages.length==0 && <p className="text-center bg-[rgba(50,50,50,1)] p-20 text-lg rounded-sm">No Data Found</p>}
                    {!messagesLoading && messages.map((val,ind)=>{
                        return <MessageCard key={ind} val={val}/>
                        })}
                </div>
            </div>)}
        </div>
    )
}