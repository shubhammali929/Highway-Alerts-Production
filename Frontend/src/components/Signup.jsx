import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./Loading";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const { BASE_URL, loading, setLoading } = useMyContext();
    const navigate = useNavigate();

    const handleSignup = (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(name, email, pass);
        if (pass !== confirmPass) {
            setLoading(false);
            toast.warn('Passwords do not match!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                pass: pass,
            }),
        })
            .then((res) => {
                setLoading(false);
                if (res.status === 201) {
                    toast.success('Registration Successful.. now login to continue', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                    navigate('/')
                } else {
                    return res.json().then((data) => {
                        toast.warn(`Error: ${data.error}`, {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                        });
                    });
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.warn(`Error registering user: ${error}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/Signup')
            });
    };
    
    return (
        <div className="container">
            {loading ? (
                <Loading/>
            ) : (
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
                            <input type="email" placeholder="Enter email address" required onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input-box address">
                            <label>Enter Password</label>
                            <input type="password" placeholder="Enter Password" required onChange={(e) => setPass(e.target.value)} />
                            <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm Password" required onChange={(e) => setConfirmPass(e.target.value)} />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                    <p>Existing User?<Link to="/">Login</Link></p>
                </section>
            )}
        </div>
    );
}
