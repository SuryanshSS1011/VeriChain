// pages/issue/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useWalletContext } from '../../contexts/WalletContext';
import { useArweave } from '../../contexts/ArweaveContext';
import CertificateForm from '../../components/organisms/certificate/CertificateForm';
import WalletManager from '../../components/organisms/wallet/WalletManager';
import TokenRequest from '../../components/molecules/storage/TokenRequest';
import PermanentStorageInfo from '../../components/molecules/storage/PermanentStorageInfo';
import Modal from '../../components/molecules/modals/Modal';
import { InformationCircleIcon } from '@heroicons/react/outline';

export default function IssuePage() {
    const router = useRouter();
    const { address, connect, disconnect } = useWalletContext();
    const {
        isInitialized: isStorageInitialized,
        initializeWithArConnect,
        generateTestWallet
    } = useArweave();

    const [issuanceSuccess, setIssuanceSuccess] = useState(null);
    const [showStorageModal, setShowStorageModal] = useState(false);
    const [showTokenModal, setShowTokenModal] = useState(false);

    // Check if storage is initialized on mount
    useEffect(() => {
        // If not storage initialized and wallet is connected, show storage modal
        if (address && !isStorageInitialized) {
            setShowStorageModal(true);
        }
    }, [address, isStorageInitialized]);

    // Handle successful issuance
    const handleIssued = (result) => {
        setIssuanceSuccess(result);

        // Redirect to the certificate detail page after successful issuance
        if (result.success && result.certificateId) {
            setTimeout(() => {
                router.push(`/verify/${result.certificateId}`);
            }, 2000);
        }
    };

    // Handle storage initialization
    const handleInitializeStorage = async () => {
        setShowStorageModal(true);
    };

    // Handle initializing with ArConnect
    const handleConnectArConnect = async () => {
        try {
            await initializeWithArConnect();
            setShowStorageModal(false);
            // Show token modal after successful connection
            setShowTokenModal(true);
        } catch (error) {
            console.error('Failed to connect ArConnect:', error);
        }
    };

    // Handle initializing with demo wallet
    const handleUseDemoStorage = async () => {
        try {
            await generateTestWallet();
            setShowStorageModal(false);
            // Show token modal after successful connection
            setShowTokenModal(true);
        } catch (error) {
            console.error('Failed to initialize demo storage:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Issue Certificate | VeriChain</title>
                <meta name="description" content="Issue new blockchain-verified credentials with permanent storage on AR.IO" />
            </Head>

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Issue New Certificate</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Create and issue a new blockchain-verified credential with permanent storage on AR.IO testnet.
                    </p>
                </div>

                {/* Information panel about permanent storage */}
                <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-700 dark:text-blue-300 p-4 rounded-lg mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium">About Permanent Storage</h3>
                            <p className="text-sm mt-1">
                                VeriChain uses AR.IO testnet for permanent, decentralized storage of credential metadata.
                                This ensures your certificates remain accessible even if the issuing institution no longer exists.
                                <button
                                    onClick={() => setShowStorageModal(true)}
                                    className="ml-1 text-primary dark:text-primary-light hover:underline"
                                >
                                    Learn more
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {address ? (
                    <div className="space-y-6">
                        {/* Certificate Form */}
                        <CertificateForm
                            walletAddress={address}
                            onIssued={handleIssued}
                            onInitializeStorage={handleInitializeStorage}
                        />

                        {/* Show token request option if storage is initialized */}
                        {isStorageInitialized && (
                            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                <TokenRequest
                                    onSuccess={() => {
                                        // Close the token modal if it's open
                                        setShowTokenModal(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <WalletManager
                        onBlockchainConnect={connect}
                        showBoth={true}
                        activeTab="blockchain"
                    />
                )}
            </div>

            {/* Storage Modal */}
            <Modal
                isOpen={showStorageModal}
                onClose={() => setShowStorageModal(false)}
                title="Initialize AR.IO Storage"
                size="lg"
            >
                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Before issuing certificates, you need to initialize AR.IO storage.
                            This is where the certificate metadata will be permanently stored.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option 1: ArConnect */}
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Use ArConnect</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Connect with the ArConnect (Wander) browser extension if you already have it installed.
                            </p>
                            <button
                                onClick={handleConnectArConnect}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Connect ArConnect
                            </button>
                        </div>

                        {/* Option 2: Demo Wallet */}
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <h3 className="text-lg font-medium mb-2">Use Demo Storage</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                For demonstration purposes, use our demo storage option to test certificate issuance.
                            </p>
                            <button
                                onClick={handleUseDemoStorage}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                            >
                                Use Demo Storage
                            </button>
                        </div>
                    </div>

                    <PermanentStorageInfo />
                </div>
            </Modal>

            {/* Token Request Modal */}
            <Modal
                isOpen={showTokenModal}
                onClose={() => setShowTokenModal(false)}
                title="Request AR.IO Testnet Tokens"
                size="md"
            >
                <div className="p-6">
                    <TokenRequest
                        onSuccess={() => {
                            // Close the token modal after successful request
                            setTimeout(() => {
                                setShowTokenModal(false);
                            }, 3000);
                        }}
                    />
                </div>
            </Modal>
        </>
    );
}