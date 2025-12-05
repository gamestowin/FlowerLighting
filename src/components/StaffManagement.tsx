import React, { useState, useEffect } from 'react';
import { getStaffMembers, addStaffMember, updateStaffMember, deleteStaffMember } from '../utils/storage';
import type { StaffMember } from '../utils/storage';

const JOB_ROLES = [
    'Sales Manager',
    'Product Specialist',
    'Warehouse Manager',
    'Customer Service',
    'Logistics Officer',
    'Finance Manager',
    'Operations Manager',
    'Delivery Driver'
];

const WORK_STATUSES = [
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'on_leave', label: 'On Leave' }
];

export default function StaffManagement() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        jobRole: '',
        phone: '',
        workStatus: 'active' as const
    });

    useEffect(() => {
        loadStaff();
    }, []);

    function loadStaff() {
        try {
            setStaff(getStaffMembers());
            setLoading(false);
        } catch (error) {
            console.error('Error loading staff:', error);
            setLoading(false);
        }
    }

    function handleAddClick() {
        setEditingStaff(null);
        setFormData({
            name: '',
            jobRole: '',
            phone: '',
            workStatus: 'active'
        });
        setShowForm(true);
    }

    function handleEditClick(member: StaffMember) {
        setEditingStaff(member);
        setFormData({
            name: member.name,
            jobRole: member.jobRole,
            phone: member.phone,
            workStatus: member.workStatus
        });
        setShowForm(true);
    }

    function handleSave() {
        if (!formData.name.trim() || !formData.jobRole.trim() || !formData.phone.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (editingStaff) {
                updateStaffMember(editingStaff.id, {
                    name: formData.name,
                    jobRole: formData.jobRole,
                    phone: formData.phone,
                    workStatus: formData.workStatus
                });
            } else {
                addStaffMember({
                    name: formData.name,
                    jobRole: formData.jobRole,
                    phone: formData.phone,
                    workStatus: formData.workStatus
                });
            }
            setShowForm(false);
            setEditingStaff(null);
            loadStaff();
        } catch (error) {
            console.error('Error saving staff member:', error);
            alert('Error saving staff member. Please try again.');
        }
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to remove this staff member?')) {
            try {
                deleteStaffMember(id);
                loadStaff();
            } catch (error) {
                console.error('Error deleting staff member:', error);
                alert('Error deleting staff member. Please try again.');
            }
        }
    }

    function handleCancel() {
        setShowForm(false);
        setEditingStaff(null);
        setFormData({
            name: '',
            jobRole: '',
            phone: '',
            workStatus: 'active'
        });
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-900 text-green-200 border-green-700';
            case 'on_leave':
                return 'bg-orange-900 text-orange-200 border-orange-700';
            case 'inactive':
                return 'bg-red-900 text-red-200 border-red-700';
            default:
                return 'bg-gray-900 text-gray-200 border-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return '✓';
            case 'on_leave':
                return '🌴';
            case 'inactive':
                return '✕';
            default:
                return '?';
        }
    };

    if (loading) {
        return <div className="text-center text-white py-12">Loading staff...</div>;
    }

    return (
        <div className="flex flex-col gap-12 pb-16">
            <section className="text-center pt-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Staff Management</h1>
                <p className="text-xl text-gray-300">Manage your team members and their work status</p>
            </section>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-card border border-dark-border rounded-lg p-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Team Overview</h2>
                    <p className="text-gray-400">Total staff: {staff.length}</p>
                </div>
                <button
                    onClick={() => (showForm ? handleCancel() : handleAddClick())}
                    className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                        showForm ? 'bg-red-900 text-red-200 hover:bg-red-800' : 'bg-primary text-dark-bg hover:opacity-90'
                    }`}
                >
                    {showForm ? '✕ Cancel' : '+ Add Staff Member'}
                </button>
            </div>

            {showForm && (
                <div className="bg-dark-card border border-dark-border rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white font-semibold mb-2">Full Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white font-semibold mb-2">Job Role *</label>
                                <select
                                    value={formData.jobRole}
                                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="">Select job role</option>
                                    {JOB_ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+966 5X XXX XXXX"
                                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">Work Status</label>
                            <select
                                value={formData.workStatus}
                                onChange={(e) => setFormData({ ...formData, workStatus: e.target.value as 'active' | 'inactive' | 'on_leave' })}
                                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                {WORK_STATUSES.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleSave}
                                className="flex-1 px-6 py-3 bg-primary text-dark-bg font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                {editingStaff ? '✓ Update' : '✓ Add'} Staff Member
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-6 py-3 bg-dark-bg border border-dark-border text-gray-300 font-bold rounded-lg hover:border-primary transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {staff.length === 0 ? (
                <div className="bg-dark-card border border-dark-border rounded-lg p-12 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-gray-400">No staff members yet. Click "Add Staff Member" to get started.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border bg-dark-card/50">
                                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Name</th>
                                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Job Role</th>
                                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Phone</th>
                                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member.id} className="border-b border-dark-border hover:bg-dark-card/30 transition-colors">
                                    <td className="px-6 py-4 text-white font-semibold">{member.name}</td>
                                    <td className="px-6 py-4 text-gray-300">{member.jobRole}</td>
                                    <td className="px-6 py-4 text-gray-300">
                                        <a href={`tel:${member.phone}`} className="text-primary hover:text-white transition-colors">
                                            {member.phone}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(member.workStatus)}`}
                                        >
                                            <span>{getStatusIcon(member.workStatus)}</span>
                                            <span>
                                                {member.workStatus === 'on_leave' ? 'On Leave' : member.workStatus === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(member)}
                                            className="px-4 py-2 bg-blue-900 text-blue-200 rounded-lg hover:bg-blue-800 transition-colors font-semibold text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="px-4 py-2 bg-red-900 text-red-200 rounded-lg hover:bg-red-800 transition-colors font-semibold text-sm"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">✓</div>
                    <div className="text-2xl font-bold text-green-400">{staff.filter((s) => s.workStatus === 'active').length}</div>
                    <p className="text-gray-400">Active Staff</p>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">🌴</div>
                    <div className="text-2xl font-bold text-orange-400">{staff.filter((s) => s.workStatus === 'on_leave').length}</div>
                    <p className="text-gray-400">On Leave</p>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">✕</div>
                    <div className="text-2xl font-bold text-red-400">{staff.filter((s) => s.workStatus === 'inactive').length}</div>
                    <p className="text-gray-400">Inactive</p>
                </div>
            </div>
        </div>
    );
}
