import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function ProductDetails() {
    // get product id from url
    const { id } = useParams();

    const navigator = useNavigate();

    //product details storing variable
    const [product, setProduct] = useState({
        p_name: '',
        desc: '',
        price: 0,
        stock: 0,
    });

    // function to get the product details
    function getProduct() {
        axios
            .get(`http://localhost:5000/products/${id}`)
            .then((response) => {
                setProduct(response.data.productDetails);
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }

    // function to handle input changes 
    function handleChange(e) {
        const { name, value } = e.target;
        setProduct((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    //function to handle the product data update
    function handleUpdate() {
        product.id = id;

        axios
            .put('http://localhost:5000/products', product)
            .then((response) => {
                if (response.status === 200) {
                    alert("Product Updated");
                    navigator('/admin/products');
                }
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    useEffect(() => {
        getProduct();
    }, [])

    return (
        <>

            <div className="container p-2">
                <h2 className="text-center fw-normal fst-italic">Product Details</h2>
                <hr />
                <div className="row p-2 flex-jcenter">
                    <div className="col-md-5 p-3">
                        <label htmlFor="p_name" className="form-label">Product Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name='p_name'
                            id='p_name'
                            value={product.p_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-5 p-3">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            name='price'
                            id='price'
                            value={product.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-5 p-3">
                        <label htmlFor="stock" className="form-label">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            name='stock'
                            id='stock'
                            value={product.stock}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-5 p-3">
                        <label htmlFor="desc" className="form-label">Product Description</label>
                        <textarea
                            type="text"
                            className="form-control"
                            name='desc'
                            id='desc'
                            rows={4}
                            value={product.desc}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <hr />
                    <div className="col-12 flex-center gap-4">
                        <Link className='btn btn-danger' to={'/admin/products'}>Cancel</Link>
                        <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetails
