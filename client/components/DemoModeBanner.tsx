'use client';

import { useState, useEffect } from 'react';
import { shouldShowDemoBanner, dismissDemoBanner } from '@/lib/demo-mode';

/**
 * Demo Mode Banner Component
 * 
 * Displays an informational banner when the app is running in demo mode
 * with mock data. Can be dismissed by the user.
 */
export default function DemoModeBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(shouldShowDemoBanner());
    }, []);

    const handleDismiss = () => {
        dismissDemoBanner();
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-blue-900">
                            📊 Demo Mode Active
                        </p>
                        <p className="text-xs text-blue-700">
                            You're viewing sample data to showcase the interface. This is a frontend demonstration.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
                    aria-label="Dismiss banner"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
