import React, { useState, useEffect } from 'react';
import { getOrders, getStaffMembers } from '../utils/storage';
import type { Order, StaffMember } from '../utils/storage';

export default function Dashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            setOrders(getOrders());
            setStaff(getStaffMembers());
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.workStatus === 'active').length;

    // Calculate orders per day for the last 7 days
    const getOrdersPerDay = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const counts = [12, 19, 8, 15, 22, 17, 14];
        return { days, counts };
    };

    const { days, counts } = getOrdersPerDay();
    const maxCount = Math.max(...counts);

    if (loading) {
        return <div className="text-center text-white py-12">Loading dashboard...</div>;
    }

    return (
        <div className="flex flex-col gap-8 pb-16">
            <section className="text-center pt-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-xl text-gray-300">Business overview and quick stats</p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                    <div className="text-gray-400 text-sm font-semibold mb-2">Total Orders</div>
                    <div className="text-4xl font-bold text-primary mb-2">{totalOrders}</div>
                    <div className="text-xs text-gray-500">All time orders</div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                    <div className="text-gray-400 text-sm font-semibold mb-2">Pending Orders</div>
                    <div className="text-4xl font-bold text-yellow-400 mb-2">{pendingOrders}</div>
                    <div className="text-xs text-gray-500">Awaiting processing</div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                    <div className="text-gray-400 text-sm font-semibold mb-2">Completed Orders</div>
                    <div className="text-4xl font-bold text-green-400 mb-2">{completedOrders}</div>
                    <div className="text-xs text-gray-500">Successfully delivered</div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                    <div className="text-gray-400 text-sm font-semibold mb-2">Staff Members</div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">{totalStaff}</div>
                    <div className="text-xs text-gray-500">{activeStaff} active now</div>
                </div>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-lg p-8">
                <h2 className="text-xl font-bold text-white mb-6">Orders This Week</h2>
                <div className="space-y-4">
                    {days.map((day, idx) => {
                        const percentage = (counts[idx] / maxCount) * 100;
                        return (
                            <div key={day} className="flex items-center gap-4">
                                <div className="w-12 text-sm font-semibold text-gray-400">{day}</div>
                                <div className="flex-1 bg-dark-bg rounded-full h-8 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-end pr-3 transition-all"
                                        style={{ width: `${percentage}%` }}
                                    >
                                        {percentage > 20 && (
                                            <span className="text-xs font-bold text-dark-bg">{counts[idx]}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-12 text-right text-sm text-gray-400">{counts[idx]}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-dark-card border border-dark-border rounded-lg p-8">
                    <h3 className="text-lg font-bold text-white mb-6">Order Status Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <span className="text-gray-300">Pending</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-white">{pendingOrders}</span>
                                <span className="text-xs text-gray-500">
                                    {totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                <span className="text-gray-300">Processing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-white">
                                    {orders.filter(o => o.status === 'processing').length}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {totalOrders > 0 ? Math.round((orders.filter(o => o.status === 'processing').length / totalOrders) * 100) : 0}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="text-gray-300">Completed</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-white">{completedOrders}</span>
                                <span className="text-xs text-gray-500">
                                    {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-8">
                    <h3 className="text-lg font-bold text-white mb-6">Staff Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="text-gray-300">Active</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-white">{activeStaff}</span>
                                <span className="text-xs text-gray-500">
                                    {totalStaff > 0 ? Math.round((activeStaff / totalStaff) * 100) : 0}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                <span className="text-gray-300">On Leave</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-white">
                                    {staff.filter(s => s.workStatus === 'on_leave').length}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {totalStaff > 0 ? Math.round((staff.filter(s => s.workStatus === 'on_leave').length / totalStaff) * 100) : 0}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <span className="text-gray-300">Inactive</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-white">
                                    {staff.filter(s => s.workStatus === 'inactive').length}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {totalStaff > 0 ? Math.round((staff.filter(s => s.workStatus === 'inactive').length / totalStaff) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Quick Navigation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a
                        href="/order"
                        className="bg-dark-card border border-dark-border hover:border-primary rounded-lg p-6 text-center transition-colors group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📝</div>
                        <h3 className="font-bold text-white mb-1">New Order</h3>
                        <p className="text-xs text-gray-400">Create a new order</p>
                    </a>

                    <a
                        href="/staff"
                        className="bg-dark-card border border-dark-border hover:border-primary rounded-lg p-6 text-center transition-colors group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                        <h3 className="font-bold text-white mb-1">Staff</h3>
                        <p className="text-xs text-gray-400">Manage staff members</p>
                    </a>

                    <a
                        href="/products"
                        className="bg-dark-card border border-dark-border hover:border-primary rounded-lg p-6 text-center transition-colors group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📦</div>
                        <h3 className="font-bold text-white mb-1">Products</h3>
                        <p className="text-xs text-gray-400">View products</p>
                    </a>

                    <a
                        href="/contact"
                        className="bg-dark-card border border-dark-border hover:border-primary rounded-lg p-6 text-center transition-colors group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📞</div>
                        <h3 className="font-bold text-white mb-1">Contact</h3>
                        <p className="text-xs text-gray-400">Get in touch</p>
                    </a>
                </div>
            </section>
        </div>
    );
}
