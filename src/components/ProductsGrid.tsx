import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/storage';
import type { Product } from '../utils/storage';

const CATEGORIES = [
    { id: 'all', label: 'All Products' },
    { id: 'chandeliers', label: 'Chandeliers' },
    { id: 'lights', label: 'LED Lights' },
    { id: 'wires', label: 'Wiring' },
    { id: 'accessories', label: 'Accessories' }
];

const CATEGORY_ICONS: Record<string, string> = {
    chandeliers: '🕯️',
    lights: '💡',
    wires: '🔌',
    accessories: '⚙️'
};

export default function ProductsGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
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

    const filteredProducts = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

    if (loading) {
        return <div className="text-center text-white py-12">Loading products...</div>;
    }

    return (
        <div className="flex flex-col gap-12 pb-16">
            <section className="text-center pt-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Products</h1>
                <p className="text-xl text-gray-300">Browse our premium lighting collection</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-6">Filter by Category</h2>
                <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeCategory === category.id
                                    ? 'bg-primary text-dark-bg'
                                    : 'bg-dark-card border border-dark-border text-gray-300 hover:border-primary'
                            }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <div className="text-sm text-gray-400 mb-6">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="bg-dark-card border border-dark-border rounded-lg p-12 text-center">
                        <div className="text-4xl mb-4">📦</div>
                        <p className="text-gray-400">No products found in this category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-primary transition-colors group"
                            >
                                <div className="aspect-square bg-gradient-to-br from-dark-border to-dark-bg flex items-center justify-center group-hover:from-primary/20 group-hover:to-dark-bg transition-colors">
                                    <div className="text-6xl">{CATEGORY_ICONS[product.category] || '📦'}</div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-white flex-1">{product.name}</h3>
                                        <span className="text-xs bg-dark-bg px-2 py-1 rounded text-primary whitespace-nowrap">{product.category}</span>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden">{product.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-primary">SR {product.price.toLocaleString()}</div>
                                        <span className="text-xs bg-green-900/30 border border-green-700 text-green-300 px-2 py-1 rounded">In Stock</span>
                                    </div>

                                    <a
                                        href="/order"
                                        className="mt-4 block w-full text-center px-4 py-2 bg-primary text-dark-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Order Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
