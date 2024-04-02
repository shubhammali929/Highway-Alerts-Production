import React from 'react'
import {  useNavigate } from 'react-router-dom';
export default function Navbar() {
    const handleLogout = ()=> {
        window.localStorage.clear();
        navigate("/");
      }
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
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link delete" onClick={handleLogout} >Logout</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
