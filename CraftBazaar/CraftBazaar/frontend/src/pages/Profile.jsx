import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Profile({ refresh }) {

    //variable to store profile data
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        gender: '',
        address: '',
        phone: '',
        pincode: '',
    });

    //handling inputs
    function handleChange(e) {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    //handling updating user profile
    async function handleUpdate(e) {
        e.preventDefault();

        //get token from local storage
        const token = localStorage.getItem('userToken');
        //api request for updating user profile with token
        axios
            .put('http://localhost:5000/user',
                profileData, {
                headers: {
                    Authorization: token,
                }
            })
            //code to be executed after successfull api request
            .then((response) => {
                setProfileData({
                    username: '',
                    email: '',
                    gender: '',
                    address: '',
                    phone: '',
                    pincode: '',
                });
                getUserData();
                alert("Profile Updated Successfully");
            })
            //catching error for api endpoint
            .catch((err) => {
                console.log(err.reponse.data);
            })
    }

    const navigator = useNavigate();

    //function to logout and refresh the navbar 
    function handleLogout() {
        localStorage.removeItem('userToken');
        refresh();
        navigator('/');
    }

    //function to get user data with token
    function getUserData() {
        const token = localStorage.getItem('userToken');
        axios
            .get('http://localhost:5000/user/getOne', {
                headers: {
                    Authorization: token,
                }
            })
            .then((response) => {
                setProfileData(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    //getting user data on render
    useEffect(() => {
        getUserData();
    }, [])

    return (
        <div className='flex-center'>
            <div className="container-fluid bg-light p-4">
                <h2 className="fw-semibold text-center">User Profile</h2>
                <hr />
                <div className="row flex-jcenter gap-3">
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label className='form-label' htmlFor="username">Username</label>
                            <input
                                className='form-control'
                                type="text"
                                id="username"
                                name="username"
                                value={profileData.username}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="email">Email</label>
                            <input
                                className='form-control'
                                type="email"
                                id="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="phone">Phone</label>
                            <input
                                className='form-control'
                                type="number"
                                id="phone"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="gender">Gender</label>
                            <select
                                className="form-select"
                                id='gender'
                                name='gender'
                                value={profileData.gender}
                                onChange={handleChange}
                            >
                                <option disabled>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="vr g-0 opacity-75"></div>
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea
                                name="address"
                                id="address"
                                rows={5}
                                className='form-control'
                                value={profileData.address}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <input
                                type="number"
                                name="pincode"
                                id="pincode"
                                value={profileData.pincode}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="flex-jcenter gap-4">
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        <button className='btn btn-success' onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
