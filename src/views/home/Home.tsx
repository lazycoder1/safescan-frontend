import Button from '@/components/common/Button';
import Table, { tableDataT } from '@/components/common/table/Table';
import Footer from '@/components/global/footer/Footer';
import Navbar from '@/components/global/navbar/Navbar';
import RecentMetrics from '@/components/global/recent_metrics/RecentMetrics';
import React, { useState, useEffect } from 'react';
import BundlesTable from './bundles_table.json';
import BundlersTable from './bundlers_table.json';
import PaymastersTable from './paymasters_table.json';
import OperationsTable from './operations_table.json';
import Searchblock from '../../components/global/searchblock/Searchblock';
import NetworkSelector from '@/components/common/NetworkSelector';
import { NETWORK_ICON_MAP } from '@/components/common/constants';
import { getLatestBundles, getLatestUserOps, getTopBundlers, getTopPaymasters } from '@/components/common/apiCalls/jiffyApis';
import { getFee, getTimePassed } from '@/components/common/utils';
import { useConfig } from '../../context/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfoButton from '@/components/common/InfoButton';
import Header from '@/components/common/Header';
import {
    getLatestMultiSigTransactions,
    getLatestModuleTransactions,
    MultiSigTransaction,
    moduleTransaction,
} from '@/components/common/apiCalls/safeScanApis';

function Home() {
    const { selectedNetwork, setSelectedNetwork } = useConfig();
    // const [selectedNetwork, setSelectedNetwork] = useState('polygon');
    const [safeMultiSigTable, setSafeMultiSigTable] = useState<tableDataT>({"columns": [
        { "name": "Transaction Hash", "sort": true },
        { "name": "Age", "sort": true },
        { "name": "Safe", "sort": false },
        { "name": "Target", "sort": false }
    ]} as tableDataT);
    const [safeModuleTable, setSafeModuleTable] = useState<tableDataT>({"columns": [
        { "name": "Transaction Hash", "sort": true },
        { "name": "Age", "sort": true },
        { "name": "Safe", "sort": false },
        { "name": "Target", "sort": false }
    ]} as tableDataT);
    const [safeModuleLoading, setSafeModuleLoading] = useState(true);
    const [safeMultiSigLoading, setSafeMultiSigLoading] = useState(true);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        refreshSafeMultiSigTransactions(selectedNetwork);
        refreshSafeModuleTransactions(selectedNetwork);
    }, [selectedNetwork]);

    const refreshSafeMultiSigTransactions = async (network: string) => {
        if (!network) return;
        const latestMultiSigTransactions = await getLatestMultiSigTransactions(network);
        let newRow = [] as tableDataT['rows'];
        latestMultiSigTransactions.forEach((tx: MultiSigTransaction) => {
            newRow.push({
                token: {
                    text: tx.safeTxHash,
                    icon: NETWORK_ICON_MAP[network],
                    type: 'safeMultiSig',
                },
                ago: getTimePassed(tx.blockTimestamp),
                sender: tx.from,
                target: [tx.to],
                status: true,
            });
        });
        setSafeMultiSigTable({ ...safeMultiSigTable, rows: newRow.slice(0, 10) });
        setSafeMultiSigLoading(false);
        setLoading(false);
    };

    const refreshSafeModuleTransactions = async (network: string) => {
        if (!network) return;
        const latestModuleTransactions = await getLatestModuleTransactions(network);
        let newRow = [] as tableDataT['rows'];
        latestModuleTransactions.forEach((tx: moduleTransaction) => {
            newRow.push({
                token: {
                    text: tx.transactionHash,
                    icon: NETWORK_ICON_MAP[network],
                    type: 'safeModuleTransaction',
                },
                ago: getTimePassed(tx.blockTimestamp),
                sender: tx.from,
                target: [tx.to],
                status: true,
            });
        });
        setSafeModuleTable({ ...safeModuleTable, rows: newRow.slice(0, 10) });
        setSafeModuleLoading(false);
    };

    return (
        <div>
            <Navbar />
            <section className="py-6">
                <div className="container">
                    <h1 className="mb-2 text-xl font-bold leading-8 md:text-3xl md:mb-4">
                        The best{' '}
                        <a href="https://app.safe.global/home" target="_blank" style={{ textDecoration: 'underline' }}>
                            safe
                        </a>{' '}
                        explorer 🚀
                    </h1>
                    <div>
                        <Searchblock isNavbar={false} />
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="flex flex-wrap items-center justify-between gap-3 py-2 mb-4 md:gap-10">
                    
                    <NetworkSelector selectedNetwork={selectedNetwork} handleNetworkChange={setSelectedNetwork} disabled={loading} />
                </div>
            </div>
            {/* {selectedNetwork != 'matic' && <RecentMetrics selectedNetwork={selectedNetwork} setLoading={setLoading} loading={loading} />} */}
            <section className="mb-12">
                <div className="container grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div>
                        <Table
                            {...(safeMultiSigTable as tableDataT)}
                            loading={safeMultiSigLoading}
                            caption={{
                                children: 'Recent Safe MultiSig',
                                icon: '/images/cube-unfolded.svg',
                                text: 'Recent Safe MultiSig Processed by selected chain',
                            }}
                        />
                        {/* <div className="mt-4">
                            <Button href="/recentBundles">View all Safe MultiSig Transaction</Button>
                        </div> */}
                    </div>
                    <div>
                        <Table
                            {...(safeModuleTable as tableDataT)}
                            loading={safeModuleLoading}
                            caption={{
                                children: 'Recent Safe Modules',
                                icon: '/images/cube-unfolded.svg',
                                text: 'Recent Safe Modules Processed by selected chain',
                            }}
                        />

                        {/* <div className="mt-4">
                            <Button href="/recentBundles">View all Safe Module Transaction</Button>
                        </div> */}
                    </div>
                </div>
            </section>
            {/* <section className="mb-12">
                <div className="container grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div>
                        <Table
                            {...(bundlesTable as tableDataT)}
                            loading={bundleTableLoading}
                            caption={{
                                children: 'Recent Bundles',
                                icon: '/images/swap-vertical-bold (1).svg',
                                text: 'Recent bundles Processed by selected chain',
                            }}
                        />

                        <div className="mt-4">
                            <Button href="/recentBundles">View all bundles</Button>
                        </div>
                    </div>
                    <div>
                        <Table
                            {...(operationsTable as tableDataT)}
                            loading={userOpTableLoading}
                            caption={{
                                children: 'Recent User Operations',
                                icon: '/images/swap-vertical-bold (1).svg',
                                text: 'Recent User Operations Processed by selected chain',
                            }}
                        />
                        <div className="mt-4">
                            <Button href="/recentUserOps">View all User operations</Button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-12">
                <div className="container grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div>
                        <Table
                            {...(bundlersTable as tableDataT)}
                            loading={bundlerTableLoading}
                            caption={{
                                children: 'Top Bundlers',
                                icon: '/images/swap-vertical-bold (1).svg',
                                text: 'Top Bundlers by selected chain',
                            }}
                        />

                        <div className="mt-4">
                            <Button href="/bundlers">View all Bundlers</Button>
                        </div>
                    </div>
                    <div>
                        <Table
                            {...(paymastersTable as tableDataT)}
                            loading={paymasterTableLoading}
                            caption={{
                                children: 'Top Paymasters',
                                icon: '/images/swap-vertical-bold (1).svg',
                                text: 'Top Paymaster by selected chain',
                            }}
                        />
                        <div className="mt-4">
                            <Button href="/paymasters">View all Paymasters</Button>
                        </div>
                    </div>
                </div>
            </section> */}
            <ToastContainer />
            {/* <Footer /> */}
        </div>
    );
}

export default Home;
