'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CustomConnectButton } from './CustomConnectButton';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/guide', label: 'Beginner Guide' },
    { href: '/wallet-tracker', label: 'Wallet Tracker' },
    { href: '/top10', label: 'Top10' },
    { href: '/arbitrage', label: 'Arbitrage' },
    { href: '/strategies', label: 'Strategies' },
    { href: '/ideas', label: 'Ideas' },
    { href: '/agents', label: 'Agents' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/api', label: 'API' },
    { href: '/waitlist', label: 'Waitlist' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              PredictorIQ
            </Link>
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {/* Custom styled ConnectButton wrapper */}
            <div className="connect-wallet-wrapper">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
