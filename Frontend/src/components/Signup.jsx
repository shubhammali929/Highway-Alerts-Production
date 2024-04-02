import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const BASE_URL = "https://highway-alerts.onrender.com";
    const handleSignup = (e) => {
        e.preventDefault();
        console.log(name, email, pass);
        fetch(`${BASE_URL}/register`,{
            method:"POST",
            crossDomain:true,
            headers:{
                "Content-Type": "application/json", 
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body:JSON.stringify({
                name,email,pass,
            }),
        }).then((res) => res.json())
        .then((data) =>{
            console.log(data,"UserRegister");
        })
    };

    return (
        <div className="container2">
            <section className="container2">
                <header>Registration Form</header>
                <p>Welcome to Highway Alerts! Sign up now to be among the first beta users.</p>
                <form action="#" className="form2" onSubmit={handleSignup}>
                    <div className="input-box">
                        <label> Name</label>
                        <input type="text" placeholder="Enter name" required onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input-box">
                        <label>Email Address</label>
                        <input type="text" placeholder="Enter email address" required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-box address">
                        <label>Enter Password</label>
                        <input type="password" placeholder="" required onChange={(e) => setPass(e.target.value)} />
                        <label>Confirm Password</label>
                        <input type="password" placeholder="" required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </section>
            <p>Existing User?<Link to="/">Login</Link></p>
        </div>
    );
}
