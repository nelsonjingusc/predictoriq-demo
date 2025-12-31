/**
 * Demo Mode Utilities
 * 
 * Provides helpers for switching between demo (mock data) and live (API) modes
 */

import { useEffect, useState } from 'react';

/**
 * Check if demo mode is enabled via environment variable
 */
export function isDemoMode(): boolean {
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

/**
 * React hook to use either mock data or real API call based on demo mode
 * 
 * @param apiCall - Async function that makes the real API call
 * @param mockData - Mock data to return in demo mode
 * @returns Object with data, loading, and error states
 */
export function useMockData<T>(
    apiCall: () => Promise<T>,
    mockData: T
): { data: T | null; loading: boolean; error: string | null } {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                if (isDemoMode()) {
                    // In demo mode, simulate a brief loading delay for realism
                    await new Promise(resolve => setTimeout(resolve, 300));
                    setData(mockData);
                } else {
                    // In live mode, make actual API call
                    const result = await apiCall();
                    setData(result);
                }
            } catch (err: any) {
                // Only set error in live mode; in demo mode, fall back to mock data
                if (isDemoMode()) {
                    setData(mockData);
                } else {
                    setError(err.message || 'Failed to fetch data');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, error };
}

/**
 * Get a user-friendly message about demo mode status
 */
export function getDemoModeMessage(): string {
    if (isDemoMode()) {
        return 'Demo mode enabled - showing sample data';
    }
    return 'Live mode - connecting to API';
}

/**
 * Check if demo mode banner should be shown
 * (can be dismissed, stored in sessionStorage)
 */
export function shouldShowDemoBanner(): boolean {
    if (typeof window === 'undefined') return false;
    if (!isDemoMode()) return false;

    const dismissed = sessionStorage.getItem('demo_banner_dismissed');
    return dismissed !== 'true';
}

/**
 * Dismiss the demo mode banner (stores in sessionStorage)
 */
export function dismissDemoBanner(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('demo_banner_dismissed', 'true');
    }
}
