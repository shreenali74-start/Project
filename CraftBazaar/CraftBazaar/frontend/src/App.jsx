import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

//import user related pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Products from './pages/Products';
import Account from './pages/Account';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';

//import admin related pages
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import ProductsAdmin from './pages/admin/Products';
import Users from './pages/admin/Users';
import ProductDetailsAdmin from './pages/admin/ProductDetails';
import AdminProfile from './pages/admin/Profile';

//import from components
import Navbar from './components/Navbar';
import NavbarAdmin from './components/NavbarAdmin';
import Footer from './components/Footer';

//import custom css
import './App.css';

function App() {

  //variables to manage login and admin login states
  const [userLogged, setUserLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  //navigation
  const navigator = useNavigate();

  //checking for user login and if the role is admin
  function checkUserLogin() {
    const res = localStorage.getItem('userToken');
    if (!res) {
      setUserLogged(false);
      setIsAdmin(false);
    } else {
      setUserLogged(true);
      if (localStorage.getItem('role') === 'admin') {
        setIsAdmin(true);
        navigator('/admin');
      } else {
        setIsAdmin(false)
      }
    }
  }

  //checking user login on render
  useEffect(() => {
    checkUserLogin();
  }, [])

  return (
    <>
      {/* render navbar according to logged user type */}
      {!isAdmin ? <Navbar login={userLogged} /> : <NavbarAdmin />}

      <Routes>
        {/* user related pages routing */}
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/about' element={<About />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order/:orderId' element={<Order />} />
        <Route path='/account' element={<Account refresh={checkUserLogin} />} />
        <Route path='/profile' element={<Profile refresh={checkUserLogin} />} />
        <Route path='/login' element={<Login refresh={checkUserLogin} />} />
        <Route path='/products/:id' element={<ProductDetails />} />
        {/* admin related pages  */}
        <Route path='/admin' element={<Dashboard />} />
        <Route path='/admin/orders' element={<Orders />} />
        <Route path='/admin/users' element={<Users />} />
        <Route path='/admin/products' element={<ProductsAdmin />} />
        <Route path='/admin/profile' element={<AdminProfile refresh={checkUserLogin} />} />
        <Route path='/admin/products/:id' element={<ProductDetailsAdmin />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
