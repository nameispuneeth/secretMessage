import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useGoogleLogin} from '@react-oauth/google'

export default function SignIn() {
  const navigate=useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [selected,setSelected]=useState(false);
  const handleSubmit=async()=>{
    setloading(true);
    const res=await fetch("http://localhost:8000/api/signin",{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email:email,
        password:password
      })
    })
    const data=await res.json();
    if(data.status==="ok"){
      toast.success("Login Successful");
      if(selected){
        localStorage.setItem("token",data.token);
      }
      else{
        sessionStorage.setItem("token",data.token);
      }

      navigate("/");
    }else{
      toast.error(`${data.error}`)
    }
    setloading(false);
  }
  let Spinner = () => {
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-10 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-white border-t-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  const responseFromGoogle=async(authRes)=>{
    try{
      setloading(true);
      if(authRes.code){
        const encodedCode = encodeURIComponent(authRes.code);
        const response=await fetch(`http://localhost:8000/api/google/${encodedCode}`,{
          method:"GET"
        });
        const data=await response.json();
        if(data.status=="ok"){
          toast.success("Login Successful.");
          sessionStorage.setItem("token",data.token);
          navigate("/");
        }else{
          toast.error(data.error);
        }
      }
    }catch(e){
      toast.error("Unable To Access");
    }
    setloading(false);
  }
  const googleLogin=useGoogleLogin({
    onSuccess:responseFromGoogle,
    onError:responseFromGoogle,
    flow:'auth-code',
  })

  return (
    <div className="bg-[radial-gradient(circle_at_center,#2c2c2c,#0d0d0d)] flex flex-col justify-center items-center min-h-screen min-w-screen text-white p-6 overflow-hidden" >
      {loading ? <Spinner />:
      (
      <div className="rounded-2xl shadow-lg p-10 w-full max-w-md bg-[rgba(0,0,0,0.4)] space-y-10">
        <p className="text-center font-extrabold text-5xl mb-10">LOGIN</p>
        <input type="email" className="w-full h-12 rounded-lg bg-[rgba(50,50,50,1)] text-center text-lg font-light" placeholder="Enter Your Email" value={email} onChange={(e) => setemail(e.target.value)} required></input>
        <input type="password" className="w-full h-12 rounded-lg bg-[rgba(50,50,50,1)] text-center text-lg font-light" placeholder="Enter Your Password" value={password} onChange={(e) => setpassword(e.target.value)} required></input>
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <div className="flex space-x-2">
              <input type="checkbox" className="cursor-pointer" onChange={()=>setSelected(!selected)}></input>
              <p className="cursor-pointer md:text-base text-sm">Remember Me </p>
            </div>
            <p className="cursor-pointer md:text-base text-sm">Forgot Password ? </p>
          </div>
          <button className="w-full h-14 rounded-lg bg-black border-2 cursor-pointer border-gray-600 text-center text-lg font-bold mt-6 mb-6" onClick={()=>handleSubmit()}>Login</button>
          <button className="w-full h-14 rounded-lg bg-black border-2 cursor-pointer border-gray-600 text-center text-lg font-bold mb-6" onClick={googleLogin}>Continue With Google</button>

          <span className="flex gap-2 text-center justify-center text-sm">Dont Have An Account ?  
            <p className="font-bold cursor-pointer" onClick={()=>navigate("/signup")}> Register</p>
          </span>

        </div>
      </div>
      )}

    </div>
  )
}