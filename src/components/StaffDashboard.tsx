import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder, getProducts, addProduct, updateProduct, deleteProduct } from '../utils/storage';
import type { Order, Product } from '../utils/storage';

export default function StaffDashboard({ onLogout }: { onLogout: () => void }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: 0,
        description: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        setOrders(getOrders());
        setProducts(getProducts());
    }

    function handleUpdateOrderStatus(orderId: string, status: Order['status']) {
        try {
            updateOrderStatus(orderId, status);
            loadData();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }

    function handleDeleteOrder(orderId: string) {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                deleteOrder(orderId);
                loadData();
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    }

    function handleSaveProduct() {
        if (!formData.name || !formData.category || formData.price <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (editingProduct) {
                updateProduct(editingProduct.id, {
                    name: formData.name,
                    category: formData.category,
                    price: formData.price,
                    description: formData.description
                });
            } else {
                addProduct({
                    name: formData.name,
                    category: formData.category,
                    price: formData.price,
                    description: formData.description
                });
            }
            setShowProductForm(false);
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: 0, description: '' });
            loadData();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }

    function handleEditProduct(product: Product) {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description
        });
        setShowProductForm(true);
    }

    function handleDeleteProduct(productId: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                deleteProduct(productId);
                loadData();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    }

    function handleCancel() {
        setShowProductForm(false);
        setEditingProduct(null);
        setFormData({ name: '', category: '', price: 0, description: '' });
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-card border border-dark-border rounded-lg p-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Staff Dashboard</h1>
                    <p className="text-gray-400">Manage orders and products</p>
                </div>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-dark-border">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-3 font-semibold transition-colors ${
                        activeTab === 'orders'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Orders ({orders.length})
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-3 font-semibold transition-colors ${
                        activeTab === 'products'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Products ({products.length})
                </button>
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Customer Orders</h2>
                    {orders.length === 0 ? (
                        <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center text-gray-400">
                            No orders yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-dark-border">
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Name</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Phone</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Item</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Qty</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b border-dark-border hover:bg-dark-card/50 transition-colors">
                                            <td className="px-4 py-3 text-white">{order.name}</td>
                                            <td className="px-4 py-3 text-gray-300">{order.phone}</td>
                                            <td className="px-4 py-3 text-gray-300">{order.item}</td>
                                            <td className="px-4 py-3 text-gray-300">{order.quantity}</td>
                                            <td className="px-4 py-3 text-gray-300">{order.deliveryType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                                    className={`px-3 py-1 rounded text-sm font-semibold cursor-pointer border-0 ${
                                                        order.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                                                        order.status === 'processing' ? 'bg-blue-900 text-blue-200' :
                                                        'bg-green-900 text-green-200'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="px-3 py-1 bg-red-900 text-red-200 rounded hover:bg-red-800 transition-colors text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Product Inventory</h2>
                        <button
                            onClick={() => {
                                setShowProductForm(!showProductForm);
                                setEditingProduct(null);
                                setFormData({ name: '', category: '', price: 0, description: '' });
                            }}
                            className="px-4 py-2 bg-primary text-dark-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {showProductForm ? 'Cancel' : '+ Add Product'}
                        </button>
                    </div>

                    {/* Product Form */}
                    {showProductForm && (
                        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-bold text-white mb-4">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-primary"
                                />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="">Select Category</option>
                                    <option value="lights">Lights</option>
                                    <option value="chandeliers">Chandeliers</option>
                                    <option value="wires">Wires</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Price (SR)"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-primary"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-primary col-span-1 sm:col-span-2"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={handleSaveProduct}
                                    className="px-6 py-2 bg-primary text-dark-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    {editingProduct ? 'Update' : 'Save'} Product
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 bg-dark-bg border border-dark-border text-gray-300 font-semibold rounded-lg hover:border-primary transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Table */}
                    {products.length === 0 ? (
                        <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center text-gray-400">
                            No products yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-dark-border">
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">ID</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Name</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Category</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Price</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Description</th>
                                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b border-dark-border hover:bg-dark-card/50 transition-colors">
                                            <td className="px-4 py-3 text-gray-300">{product.id}</td>
                                            <td className="px-4 py-3 text-white font-semibold">{product.name}</td>
                                            <td className="px-4 py-3 text-gray-300 capitalize">{product.category}</td>
                                            <td className="px-4 py-3 text-primary font-semibold">SR {product.price}</td>
                                            <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">{product.description}</td>
                                            <td className="px-4 py-3 flex gap-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="px-3 py-1 bg-blue-900 text-blue-200 rounded hover:bg-blue-800 transition-colors text-sm font-semibold"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="px-3 py-1 bg-red-900 text-red-200 rounded hover:bg-red-800 transition-colors text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
