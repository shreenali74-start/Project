import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ refresh }) {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [username, setUsername] = useState();
    const [phone, setPhone] = useState();
    const [newPass, setNewPass] = useState();
    const [confPass, setConfPass] = useState();

    const [regError, setRegError] = useState();
    const [logError, setLogError] = useState();

    const navigator = useNavigate();

    function handleRegister(e) {

        e.preventDefault();

        if (newPass != confPass) {
            setRegError("Passwords do not match");
        }
        else {
            const formData = {
                username: username,
                email: email,
                phone: phone,
                password: newPass
            };

            axios
                .post("http://localhost:5000/user/register", formData)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    setRegError(err.response.data.Error);
                })
        }

    }


    // function to handle login 
    function handleLogin(e) {
        e.preventDefault();

        //prepare formdata to send to api 
        const formData = {
            email: email,
            password: password
        };

        axios
            .post("http://localhost:5000/user/login", formData)
            .then((res) => {
                //set jwt token in localstorage for authentication 
                localStorage.setItem('userToken', res.data.token);
                //check if the email is admin@gmail.com
                //if admin redirect to admin pages and set the role as admin
                if (email == 'admin@gmail.com') {
                    navigator('/admin');
                    localStorage.setItem('role', "admin");
                }
                else
                    navigator('/');
                //check the login in App.jsx for dynamic navbar rendering 
                refresh();
            })
            .catch((err) => {
                setLogError(err.response.data.Error);
            })
    }

    return (
        <>
            <div className="container mt-5">
                <div className="container p-5 bg-primary text-white rounded collapse show" id='collapse' style={{ "maxWidth": "480px" }}>
                    <h2 className="text-center">Login</h2>
                    <hr />
                    <div className="mb-3">
                        <label className='form-label' htmlFor="email">Email</label>
                        <input className='form-control' type="email" id="email" onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className='form-label' htmlFor="password">Password</label>
                        <input className='form-control' type="password" id="password" onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                    </div>
                    <hr />
                    <div className="flex-acenter gap-3">
                        <p className='m-0'>Don't have an account ?</p>
                        <button className="btn btn-success" data-bs-toggle="collapse" data-bs-target="#collapse">Register</button>
                    </div>
                </div>
                <div className="container collapse p-5 bg-primary text-white rounded" id='collapse' style={{ "maxWidth": "480px" }}>
                    <h2 className="text-center">Register</h2>
                    <hr />
                    <div className="mb-3">
                        <label className='form-label' htmlFor="username">Username</label>
                        <input className='form-control' type="text" id="username" onChange={(e) => { setUsername(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className='form-label' htmlFor="email">Email</label>
                        <input className='form-control' type="email" id="email" onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className='form-label' htmlFor="Phone">Phone</label>
                        <input className='form-control' type="number" id="Phone" onChange={(e) => { setPhone(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className='form-label' htmlFor="password">New Password</label>
                        <input className='form-control' type="password" id="password" onChange={(e) => { setNewPass(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className='form-label' htmlFor="confpassword">Confirm Password</label>
                        <input className='form-control' type="password" id="confpassword" onChange={(e) => { setConfPass(e.target.value) }} />
                    </div>
                    {!regError ? '' : (
                        <div className='mb-3'>
                            <p className="text-danger">{regError}</p>
                        </div>
                    )}
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-success" onClick={handleRegister}>Register</button>
                    </div>
                    <hr />
                    <div className="flex-acenter gap-3">
                        <p className='m-0'>Already have an account ?</p>
                        <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapse">Login</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
