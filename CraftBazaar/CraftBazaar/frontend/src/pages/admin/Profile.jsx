import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Profile({ refresh }) {

    const navigator = useNavigate();

    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        gender: '',
        address: '',
        phone: '',
        pincode: '',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleLogout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('role');
        refresh();
        navigator('/');
    }
    return (
        <div className='flex-center' style={{ "minHeight": "80vh" }}>
            <div className="container bg-light col-4 p-4">
                <div className="row flex-jcenter gap-3">
                    <div className="mb-3">
                        <label className='form-label' htmlFor="username">Username</label>
                        <input className='form-control' type="text" id="username" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className='form-label' htmlFor="email">Email</label>
                        <input className='form-control' type="email" id="email" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className='form-label' htmlFor="Phone">Phone</label>
                        <input className='form-control' type="number" id="Phone" onChange={handleChange} />
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        <button className="btn btn-success">Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
