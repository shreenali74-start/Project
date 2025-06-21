import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

function Navbar({ login }) {

    //re-render component whenever login variable changes state 
    useEffect(() => { }, [login])
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container-fluid">
                    <Link className="navbar-brand text-white" href="/">CraftBazaar</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link text-white" to={"/"}> Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to={"/products"}>Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to={"/about"}>About Us</Link>
                            </li>

                            {!login ? (
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to={"/login"}>Login | Register</Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to={'/cart'} className='nav-link text-white'>Cart</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link text-white" to={"/account"}>Account</Link>
                                    </li>
                                </>
                            )
                            }
                        </ul>
                    </div>
                </div>
            </nav >
        </div >
    )
}

export default Navbar
