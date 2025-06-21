import axios from 'axios';
import { useEffect, useState } from 'react';

function Products() {
    const [selectedCategory] = useState('All');
    const [categories] = useState(['All', 'home decor', 'handmade bags', 'flower pots', 'cutlery', 'handmade jewelry']);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({
        p_name: '',
        desc: '',
        price: '',
        stock: '',
        img: undefined,
        category: '',
    });
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Fetch all products for the selected category
    function getProducts() {
        if (selectedCategory === 'All') {
            axios
                .get('http://localhost:5000/products')
                .then((response) => {
                    setProducts(response.data.products)
                })
                .catch(() => {
                    setProducts([]);
                });
        } else {
            axios
                .get(`http://localhost:5000/products/category/${selectedCategory}`)
                .then((response) => {
                    setProducts(response.data.products);
                })
                .catch(() => {
                    setProducts([]);
                });
        }
    }

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            getProducts();
            return;
        }
        axios
            .get(`http://localhost:5000/products/search/${searchTerm}`)
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch(() => {
                setProducts([]);
            });
    };

    function handleChange(e) {
        const { name, value } = e.target;
        if (showEditModal) {
            setEditProduct((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setNewProduct((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }

    const handleImageChange = (e) => {
        if (showEditModal) {
            setEditProduct((prevData) => ({
                ...prevData,
                img: e.target.files[0],
            }));
        } else {
            setNewProduct((prevData) => ({
                ...prevData,
                img: e.target.files[0],
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('p_name', newProduct.p_name);
        formData.append('price', newProduct.price);
        formData.append('desc', newProduct.desc);
        formData.append('stock', newProduct.stock);
        formData.append('category', newProduct.category);
        if (newProduct.img) {
            formData.append('image', newProduct.img);
        }

        try {
            await axios.post('http://localhost:5000/products/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setNewProduct({ p_name: '', price: '', desc: '', img: undefined, stock: '', category: '' });
            getProducts();
            document.getElementById('addBtn').click();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('p_name', editProduct.p_name);
        formData.append('price', editProduct.price);
        formData.append('desc', editProduct.desc);
        formData.append('stock', editProduct.stock);
        formData.append('category', editProduct.category);
        if (editProduct.img && typeof editProduct.img !== 'string') {
            formData.append('image', editProduct.img);
        }

        try {
            await axios.put(`http://localhost:5000/products/${editProduct._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setShowEditModal(false);
            setEditProduct(null);
            getProducts();
            setSuccessMsg('Product Details Updated Successfully');
            setTimeout(() => setSuccessMsg(''), 2500);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    function handleRemove(e) {
        const id = e.target.dataset.id;
        if (!window.confirm("Are you sure you want to remove this product?")) return;

        axios
            .delete(`http://localhost:5000/products/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setProducts((prev) => prev.filter((product) => product._id !== id));
                }
            })
            .catch((error) => {
                console.error('Error deleting product:', error.response?.data || error.message);
            });
    }

    function handleEdit(product) {
        setEditProduct({
            ...product,
            img: undefined, // Reset image for new upload
        });
        setShowEditModal(true);
    }

    // Fetch products by category or all on category change
    useEffect(() => {
        setSearchTerm(''); // Clear search box when category changes
        getProducts();
        // eslint-disable-next-line
    }, [selectedCategory]);

    // Fetch all products on initial mount
    useEffect(() => {
        getProducts();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {/* --- SEARCH BAR --- */}
            <form className="mb-4 text-center" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="form-control d-inline-block w-auto"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <button className="btn btn-primary" type="submit">Search</button>
                {searchTerm && (
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                            setSearchTerm('');
                            getProducts();
                        }}
                    >
                        Clear
                    </button>
                )}
            </form>
            {/* --- END SEARCH BAR --- */}
            {successMsg && (
                <div style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                    background: '#28a745',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    {successMsg}
                </div>
            )}

            <div className="container-fluid bg-light p-3">
                <div className="container d-flex justify-content-end">
                    <button className="btn btn-primary" id='addBtn' data-bs-target="#addProduct" data-bs-toggle="collapse" type="button">
                        Add New Product
                    </button>
                </div>
            </div>

            <div className="container collapse p-2" id="addProduct">
                <form onSubmit={handleSubmit}>
                    <div className="row p-2">
                        <div className="col-md-5 p-3">
                            <label htmlFor="p_name" className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name='p_name'
                                id='p_name'
                                value={newProduct.p_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-5 p-3">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                name='price'
                                id='price'
                                value={newProduct.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-5 p-3">
                            <label htmlFor="stock" className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                name='stock'
                                id='stock'
                                value={newProduct.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-5 p-3">
                            <label htmlFor="desc" className="form-label">Product Description</label>
                            <textarea
                                className="form-control"
                                name='desc'
                                id='desc'
                                rows={4}
                                value={newProduct.desc}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="col-md-5 p-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select
                                className="form-select"
                                name="category"
                                id="category"
                                value={newProduct.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.filter(cat => cat !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-5 p-3">
                            <label htmlFor="img" className="form-label">Product Image</label>
                            <input
                                type="file"
                                name="img"
                                id="img"
                                className="form-control"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                        <hr />
                        <div className="col-12 d-flex justify-content-end">
                            <button className="btn btn-success" type="submit">Add</button>
                        </div>
                    </div>
                </form>
            </div>

            <hr className='m-0' />

           

            <div className="container-fluid p-3 mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Category</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.length > 0 ? (
                            products.map((product, index) => (
                                <tr key={product._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{product.p_name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.category}</td>
                                    <td className='d-flex gap-3'>
                                        <div className="dropdown">
                                            <button className="btn btn-light " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button
                                                        className="dropdown-item"
                                                        type="button"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        Update
                                                    </button>
                                                </li>
                                                <li>
                                                    <button data-id={product._id} onClick={handleRemove} className="dropdown-item bg-danger text-white" type="button">Remove</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- EDIT PRODUCT MODAL --- */}
            {showEditModal && editProduct && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdate}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Product</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="p_name"
                                            value={editProduct.p_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={editProduct.price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="stock"
                                            value={editProduct.stock}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Product Description</label>
                                        <textarea
                                            className="form-control"
                                            name="desc"
                                            rows={3}
                                            value={editProduct.desc}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-select"
                                            name="category"
                                            value={editProduct.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.filter(cat => cat !== 'All').map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Product Image</label>
                                        <input
                                            type="file"
                                            name="img"
                                            className="form-control"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* --- END EDIT PRODUCT MODAL --- */}
        </>
    )
}

export default Products