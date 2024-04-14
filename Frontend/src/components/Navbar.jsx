import React from 'react'
import {  useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar() {
    const handleLogout = ()=> {
        window.localStorage.clear();
        toast.warn('You have been Logged out, please login again to use the application', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
        navigate("/");
      }

    //   const notify = ()=> {
    //     toast.success('🦄 Wow so easy!', {
    //         position: "top-center",
    //         autoClose: 2000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    //         });
    //   }
      const navigate = useNavigate();
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar bg-primary" data-bs-theme="dark">
                <div className="container-fluid">
                <span className="navbar-brand mb-0 h1"><i className="fas fa-map-marked-alt"></i>Highway Alerts</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page"onClick={() => navigate('/')}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={()=>{navigate('/About')}}>About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link " onClick={handleLogout} >Logout</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
            <ToastContainer />
        </div>
    )
}
