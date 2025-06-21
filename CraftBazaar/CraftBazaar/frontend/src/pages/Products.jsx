import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const categories = ['All', 'home decor', 'handmade bags', 'flower pots', 'cutlery', 'handmade jewelry'];
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    // Fetch products by category or all
    const getProducts = async () => {
        try {
            let url = 'http://localhost:5000/products';
            if (selectedCategory !== 'All') {
                url = `http://localhost:5000/products/category/${selectedCategory}`;
            }
            const response = await axios.get(url);
            setProducts(response.data.products || []);
        } catch (err) {
            console.log(err);
            setProducts([]);
        }
    };

    // Handle add to cart operation
    const handleAddCart = async (e) => {
        if (!localStorage.getItem('userToken')) {
            navigate('/login');
            return;
        }
        const token = localStorage.getItem('userToken');
        try {
            await axios.post(
                'http://localhost:5000/cart/add',
                {
                    p_id: e.target.dataset.id,
                    qty: 1,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            window.alert('Item added to cart');
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding to cart');
        }
    };

    // Fetch products on mount and when category changes
    useEffect(() => {
        getProducts();
        // eslint-disable-next-line
    }, [selectedCategory]);

    const renderProducts = (start, end) => (
        products.length === 0 ? (
            <h1 className="fw-normal">Ooops! Something went Wrong.</h1>
        ) : (
            products.slice(start, end).map((product) => (
                <div className="col-md-3 flex-center" key={product._id}>
                    <div className="card">
                        <img
                            src={`http://localhost:5000${product.img?.[0] || ''}`}
                            className="card-img-top"
                            alt={product.p_name}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{product.p_name}</h5>
                            <p className="card-text">{product.desc}</p>
                            <div className="d-flex gap-3">
                                <Link to={`/products/${product._id}`} className="btn btn-primary">
                                    Details
                                </Link>
                                <button
                                    className="btn btn-warning"
                                    data-id={product._id}
                                    onClick={handleAddCart}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )
    );

    return (
        <>
            {/* --- CATEGORY FILTER --- */}
            <div className="mb-4 text-center">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`btn btn-outline-primary mx-1 ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                        type="button"
                    >
                        {cat}
                    </button>
                ))}
            </div>
            {/* --- END CATEGORY FILTER --- */}

            <div className="container-fluid bg-light p-4 shadow mt-4">
                <h3 className="text-center">New Arrivals</h3>
                <hr />
                <div className="row flex-jcenter">
                    {renderProducts(0, 4)}
                </div>
            </div>

            <div className="container-fluid bg-light p-4 shadow mt-4">
                <h3 className="text-center">Popular Products</h3>
                <hr />
                <div className="row flex-jcenter">
                    {renderProducts(4, 8)}
                </div>
            </div>

            <div className="container-fluid bg-light p-4 shadow mt-4">
                <h3 className="text-center">Our Choice</h3>
                <hr />
                <div className="row flex-jcenter">
                    {renderProducts(8, 45)}
                </div>
            </div>
        </>
    );
}

export default Products;
