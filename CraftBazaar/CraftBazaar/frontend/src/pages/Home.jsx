import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {

    const [products, setProducts] = useState([]);

    // functiont to get all the products 
    const getProducts = () => {
        axios
            .get('http://localhost:5000/products')
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((err) => {
                console.log(err);

            })
    }
    const navigator = useNavigate();

    //function to handle add to cart
    function handleAddCart(e) {
        if (!localStorage.getItem('userToken')) {
            navigator('/login');
        } else {
            const token = localStorage.getItem('userToken');
            axios
                .post('http://localhost:5000/cart/add', {
                    p_id: e.target.dataset.id,
                    qty: 1
                }, {
                    headers: {
                        Authorization: token
                    }
                })
                .then((response) => {
                    window.alert("Item added to cart")
                })
                .catch((error) => {
                    alert(error.response.data.message);
                })
        }
    }

    //get products on render
    useEffect(() => {
        getProducts();
    }, [])

    return (
        <>
            <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/img/banner_3.jpg" className="d-block w-100" alt="banner" />
                    </div>
                    <div className="carousel-item">
                        <img src="/img/banner_1.jpg" className="d-block w-100" alt="banner" />
                    </div>
                    <div className="carousel-item">
                        <img src="/img/banner_2.jpg" className="d-block w-100" alt="banner" />
                    </div>
                </div>
            </div>

            <div className="container-fluid p-4 bg-light">
                <div className="row flex-center">

                    {!products ? (
                        <h1 className="fw-normal">Ooops! Something went Wrong.</h1>
                    ) : products.slice(0, 5).map((product) => (
                        <div className="col-md-3 flex-center" key={product._id}>
                            <div className="card">
                                <img src={`http://localhost:5000${product.img[0]}`} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{product.p_name}</h5>
                                    <p className="card-text">{product.desc}</p>
                                    <div className="d-flex gap-3">
                                        <Link to={`/products/${product._id}`} className="btn btn-primary">Details</Link>
                                        <button className="btn btn-warning" data-id={product._id} onClick={handleAddCart}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}

export default Home;
