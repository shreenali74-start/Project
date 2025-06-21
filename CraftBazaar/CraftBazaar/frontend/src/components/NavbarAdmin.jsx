import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

function Navbar() {

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container-fluid">
                    <Link className="navbar-brand text-white" href="/">CraftBazaar Admin</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link text-white" to={"/admin"}> Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to={"/admin/products"}>Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to={"/admin/orders"}>Orders</Link>
                            </li>
                            <li className="nav-item">
                                <Link className='nav-link text-white' to={'/admin/users'}>Users</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to={"/admin/profile"}>Profile</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
        </div >
    )
}

export default Navbar
