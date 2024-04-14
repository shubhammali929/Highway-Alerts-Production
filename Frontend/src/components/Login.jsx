import React, { useEffect, useState } from "react";
import { Link , useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/MyContext';
import Loading from "./Loading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const {BASE_URL,loading, setLoading} = useMyContext();


  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${BASE_URL}/login`,{
        method:"POST",
        crossDomain:true,
        headers:{
            "Content-Type": "application/json", 
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body:JSON.stringify({
            email,pass,
        }),
    }).then((res) => res.json())
    .then((data) =>{
      setLoading(false);
        console.log(data,"UserRegister");
        if(data.status === "success"){
          // alert("Login Sucess!!");
          toast.success('Login Sucessful', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
            
          window.localStorage.setItem("token", data.token); // Storing the token
          window.localStorage.setItem("loggedIn", "true");
          navigate("/dashboard"); // Redirecting to the dashboard

        } else {
          // alert("Login Failed. Please check your credentials.");
          toast.warn('Login Failed. Please check your credentials.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
        }
    });
};

  return (
    <div className="container">
       {loading ? (
        <Loading/>
      ) : (
      
        <div>
        <section className="container2">
        <header>Login</header>
        <form action="#" className="form2" onSubmit={handleLogin}>
          <div className="input-box">
            <label>Email Address</label>
            <input type="email" placeholder="Enter email address" required onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="input-box address">
            <label>Enter Password</label>
            <input type="password" placeholder="Enter Password" required onChange={(e) => setPass(e.target.value)}/>
          </div>
          <button>Submit</button>
        </form>
      <p>New Here?<Link to="/Signup" >Signup</Link></p>
      </section>
      </div>
      )}
      
    

      
    </div>
  )
}
