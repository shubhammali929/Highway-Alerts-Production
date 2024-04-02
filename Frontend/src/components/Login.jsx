import React, { useState } from "react";
import { Link , useNavigate } from 'react-router-dom';
export default function Login() {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "https://highway-alerts.onrender.com";
  const handleLogin = (e) => {
    e.preventDefault();
    // console.log( email, pass);
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
        console.log(data,"UserRegister");
        if(data.status === "success"){
          alert("Login Sucess!!");
          window.localStorage.setItem("token", data.token); // Storing the token
          window.localStorage.setItem("loggedIn", "true");
          navigate("/dashboard"); // Redirecting to the dashboard
        } else {
          alert("Login Failed. Please check your credentials.");
        }
    });
};

  return (
    <div className="container2">
      <section className="container2">
        <header>Login</header>
        <form action="#" className="form2" onSubmit={handleLogin}>
          <div className="input-box">
            <label>Email Address</label>
            <input type="text" placeholder="Enter email address" required onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="input-box address">
            <label>Enter Password</label>
            <input type="password" placeholder="" required onChange={(e) => setPass(e.target.value)}/>
          </div>
          <button>Submit</button>
        </form>
      </section>
      <p>New Here?<Link to="/Signup" >Signup</Link></p>
    </div>
  )
}
