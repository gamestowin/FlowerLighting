import React, { useState, useEffect } from 'react';
import { getProducts, addOrder } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function OrderForm() {
    const [products, setProducts] = useState<Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const prods = getProducts();
            setProducts(prods);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        const formData = {
            name: (form.querySelector('[name="name"]') as HTMLInputElement).value,
            phone: (form.querySelector('[name="phone"]') as HTMLInputElement).value,
            item: (form.querySelector('[name="item"]') as HTMLSelectElement).value,
            quantity: parseInt((form.querySelector('[name="quantity"]') as HTMLInputElement).value),
            deliveryType: (form.querySelector('[name="deliveryType"]:checked') as HTMLInputElement).value as 'delivery' | 'pickup'
        };

        try {
            addOrder({
                name: formData.name,
                phone: formData.phone,
                item: formData.item,
                quantity: formData.quantity,
                deliveryType: formData.deliveryType
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Error submitting order. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center text-white">Loading products...</div>;
    }

    return (
        <div className="flex flex-col gap-12 pb-16 max-w-2xl mx-auto">
            <section className="text-center pt-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Place Your Order</h1>
                <p className="text-xl text-gray-300">Fill out the form below to order from Flower Lighting</p>
            </section>

            {!submitted ? (
                <section className="bg-dark-card border border-dark-border rounded-lg p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="name" className="block text-white font-semibold mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-white font-semibold mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="+966 5X XXX XXXX"
                            />
                        </div>

                        <div>
                            <label htmlFor="item" className="block text-white font-semibold mb-2">
                                Select Product
                            </label>
                            <select
                                id="item"
                                name="item"
                                required
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="">Choose a product...</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.name}>
                                        {product.name} - SR {product.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-white font-semibold mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                max="100"
                                defaultValue="1"
                                required
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-3">Delivery Method</label>
                            <div className="flex gap-6">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="delivery"
                                        name="deliveryType"
                                        value="delivery"
                                        defaultChecked
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor="delivery" className="ml-2 text-gray-300 cursor-pointer">
                                        Delivery
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="pickup"
                                        name="deliveryType"
                                        value="pickup"
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor="pickup" className="ml-2 text-gray-300 cursor-pointer">
                                        Pickup
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-4 bg-primary text-dark-bg font-bold rounded-lg hover:opacity-90 transition-opacity text-lg mt-4"
                        >
                            Submit Order
                        </button>
                    </form>
                </section>
            ) : (
                <div className="bg-green-900 border border-green-700 rounded-lg p-8 text-center">
                    <div className="text-5xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Order Submitted Successfully!</h2>
                    <p className="text-gray-300 mb-6">Thank you for your order. Our team will contact you shortly to confirm details.</p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-primary text-dark-bg font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Back to Home
                    </a>
                </div>
            )}
        </div>
    );
}
