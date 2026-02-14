'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function CustomConnectButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="relative group px-8 py-3 rounded-full bg-slate-900 text-white font-bold text-sm shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(93,93,255,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 tracking-wide">
                                            Connect Wallet
                                        </span>
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors shadow-sm"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white/50 hover:bg-white/80 border border-gray-200 rounded-full transition-all backdrop-blur-sm"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 18, height: 18 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>

                                    <button
                                        onClick={openAccountModal}
                                        type="button"
                                        className="px-4 py-2 rounded-full bg-white text-gray-800 font-medium text-sm border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        {account.displayName}
                                        <span className="text-gray-400 text-xs ml-1">
                                            {account.displayBalance
                                                ? `(${account.displayBalance})`
                                                : ''}
                                        </span>
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
