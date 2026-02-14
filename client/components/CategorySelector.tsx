'use client';

/**
 * Category Selector Component
 * Shows category filter when wallet is connected
 */

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

interface CategorySelectorProps {
    onCategoryChange: (category: string | null) => void;
    selectedCategory: string | null;
}

export default function CategorySelector({
    onCategoryChange,
    selectedCategory
}: CategorySelectorProps) {
    const { isConnected } = useAccount();
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories when component mounts
    useEffect(() => {
        if (isConnected) {
            setLoading(true);
            fetch('/api/markets/top10')
                .then(res => res.json())
                .then(data => {
                    setCategories(data.categories || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch categories:', err);
                    setLoading(false);
                });
        }
    }, [isConnected]);

    // Don't show if wallet not connected
    if (!isConnected) {
        return null;
    }

    return (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                        Wallet Connected
                    </span>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Category
                    </label>
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => {
                            const val = e.target.value || null;
                            onCategoryChange(val);
                        }}
                        disabled={loading}
                        className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {loading && (
                        <p className="text-xs text-gray-500 mt-1">Loading categories...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
