import React from 'react'
import { Link } from 'react-router-dom'

function Account() {
    return (
        <div>
            <div className="container-fluid p-3 flex-jcenter gap-4">
                <div className="flex-jcenter flex-column gap-4">
                    <Link to={'/profile'} className="card mb-3 text-decoration-none" style={{ "max-width": "240px" }}>
                        <div className="row p-1 flex-acenter">
                            <div className="col-md-4">
                                <img src="/img/user.png" className="img-fluid rounded-start" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <p>Profile</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to={'/orders'} className="card mb-3 text-decoration-none" style={{ "max-width": "240px" }}>
                        <div className="row p-1 flex-acenter">
                            <div className="col-md-4">
                                <img src="/img/order.png" className="img-fluid rounded-start" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <p >Your Orders</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="flex-jcenter flex-column gap-4">

                    <Link to={'/cart'} className="card mb-3 text-decoration-none" style={{ "max-width": "240px" }}>
                        <div className="row p-1 flex-acenter">
                            <div className="col-md-4">
                                <img src="/img/cart.png" className="img-fluid rounded-start" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <p>Cart</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to={'/settings'} className="card mb-3 text-decoration-none" style={{ "max-width": "240px" }}>
                        <div className="row p-1 flex-acenter">
                            <div className="col-md-4">
                                <img src="/img/setting.png" className="img-fluid rounded-start" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <p>Settings</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Account
