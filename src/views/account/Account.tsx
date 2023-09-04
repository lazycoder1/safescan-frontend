import Footer from '@/components/global/footer/Footer';
import Navbar from '@/components/global/navbar/Navbar';
import React, { useEffect, useState } from 'react';
import {
    getAddressActivity,
    UserOp,
    AddressActivity,
    tokenBalance,
    getAddressBalances,
    getAddressERC20Transfers,
    getAddressERC721Transfers,
    tokenTransferAlchemy,
    getAddressTransactions,
    Transaction
} from '@/components/common/apiCalls/jiffyApis';
import { Breadcrumbs, Link, Box, Tab, Tabs, Typography, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { getFee, getTimePassed, shortenString } from '@/components/common/utils';
import Token from '@/components/common/Token';
import { NETWORK_ICON_MAP, NETWORK_SCANNER_MAP } from '@/components/common/constants';
import Skeleton from 'react-loading-skeleton-2';
import CopyButton from '@/components/common/copy_button/CopyButton';
import Table, { tableDataT } from '@/components/common/table/Table';
import Pagination from '@/components/common/table/Pagination';
import TransactionDetails from './TransactionDetails';
import HeaderSection from './HeaderSection';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useConfig } from '@/context/config';
import { set } from 'lodash';
import LinkAndCopy from '@/components/common/LinkAndCopy';
import { MultiSigTransaction, SafeModuleTransaction, getSafeAddress, getSafeModuleTransactions, getSafeMultiSigTransactions, moduleTransaction, Safe } from '@/components/common/apiCalls/safeScanApis';

// import Skeleton from '@/components/Skeleton';
export const BUTTON_LIST = [
    {
        name: 'Default View',
        key: 'Default View',
    },
    {
        name: 'Original',
        key: 'Original',
    },
];

const DEFAULT_PAGE_SIZE = 10;

const userOpColumns = [
    { name: 'UserOp Hash', sort: true },
    { name: 'Age', sort: true },
    { name: 'Sender', sort: false },
    { name: 'Target', sort: false },
    { name: 'Fee', sort: true },
];

const moduleTransactionColumns = [
    { name: 'Transaction Hash', sort: true },
    { name: 'Age', sort: true },
    { name: 'Sender', sort: false },
    { name: 'Target', sort: false },
];

const multiSigTransactionColumns = [
    { name: 'Transaction Hash', sort: true },
    { name: 'Age', sort: true },
    { name: 'Sender', sort: false },
    { name: 'Target', sort: false },
    { name: 'Fee', sort: true },
];

const erc20TransferColumns = [
    { name: 'Transaction Hash', sort: true },
    { name: 'Block Number', sort: true },
    { name: 'From', sort: false },
    { name: 'To', sort: false },
    { name: 'Value', sort: true },
];

const erc721TransferColumns = [
    { name: 'Transaction Hash', sort: true },
    { name: 'Block Number', sort: true },
    { name: 'From', sort: false },
    { name: 'To', sort: false },
    { name: 'Token ID', sort: true },
];

const constructValueRowForTokenTransfer = (erc20Transfer: tokenTransferAlchemy, network: string) => {
    let value = calculateTokenValue(parseInt(erc20Transfer.rawContract.value ? erc20Transfer.rawContract.value : '0'), erc20Transfer.rawContract.decimal)
    let asset = erc20Transfer.asset ? (erc20Transfer.asset.length > 5 ? erc20Transfer.asset.slice(0,4) + '...': erc20Transfer.asset) : shortenString(erc20Transfer.rawContract.address)
    let component = <LinkAndCopy text={asset} link={NETWORK_SCANNER_MAP[network] + '/address/' + erc20Transfer.rawContract.address} copyText={null}/>
    return { value, component };
}

const constructTokenIdRowForTokenTransfer = (erc721Transfer: tokenTransferAlchemy, network: string) => {
    let value = erc721Transfer.tokenId ? erc721Transfer.tokenId : '0'
    let asset = erc721Transfer.asset ? erc721Transfer.asset : '0'
    asset = asset.length > 5 ? asset.slice(0,5) + '...' : asset
    let component = <LinkAndCopy text={asset} link={NETWORK_SCANNER_MAP[network] + '/address/' + erc721Transfer.rawContract.address} copyText={null}/>
    return { value: parseInt(value).toString(), component };
}

const getAgoFromAssetTransfer = (assetTransfer: tokenTransferAlchemy) => {
    if (assetTransfer.metadata?.blockTimestamp) 
        return getTimePassed((new Date(assetTransfer.metadata?.blockTimestamp)).getTime()/1000)
    else return parseInt(assetTransfer.blockNum).toString();
}

const constructERC20TransferRows = (erc20Transfers: tokenTransferAlchemy[], network: string): tableDataT['rows'] => {
    let newRows = [] as tableDataT['rows'];
    if (!erc20Transfers) return newRows;
    erc20Transfers.forEach((erc20Transfer) => {
        let { value, component } = constructValueRowForTokenTransfer(erc20Transfer, network);
        newRows.push({
            token: {
                text: erc20Transfer.hash,
                icon: NETWORK_ICON_MAP[network],
                type: 'erc20Transfer',
            },
            ago: getAgoFromAssetTransfer(erc20Transfer),
            sender: erc20Transfer.from,
            target: [erc20Transfer.to],
            fee: { value, component },
            status: true,
        });
    });
    return newRows;
};

const constructERC721TransferRows = (erc721Transfers: tokenTransferAlchemy[], network: string): tableDataT['rows'] => {
    let newRows = [] as tableDataT['rows'];
    if (!erc721Transfers) return newRows;
    erc721Transfers.forEach((erc721Transfer) => {
        let { value, component } = constructTokenIdRowForTokenTransfer(erc721Transfer, network);
        newRows.push({
            token: {
                text: erc721Transfer.hash,
                icon: NETWORK_ICON_MAP[network],
                type: 'erc721Transfer',
            },
            ago: getAgoFromAssetTransfer(erc721Transfer),
            sender: erc721Transfer.from,
            target: [erc721Transfer.to],
            fee: { value: value, component: component },
            status: true,
        });
    });
    return newRows;
};

const createUserOpsTableRows = (userOps: UserOp[]): tableDataT['rows'] => {
    let newRows = [] as tableDataT['rows'];
    if (!userOps) return newRows;
    userOps.forEach((userOp) => {
        newRows.push({
            token: {
                text: userOp.userOpHash,
                icon: NETWORK_ICON_MAP[userOp.network],
                type: 'userOp',
            },
            ago: getTimePassed(userOp.blockTime!),
            sender: userOp.sender,
            target: userOp.target ? userOp.target : ['Unavailable!'],
            fee: getFee(userOp.actualGasCost, userOp.network as string),
            status: userOp.success!,
        });
    });
    return newRows;
};

const createModuleTransactionTableRows = (transactions: SafeModuleTransaction[], network: string): tableDataT['rows'] => {
    let newRows = [] as tableDataT['rows'];
    if (!transactions) return newRows;
    transactions.forEach((transaction) => {
        newRows.push({
            token: {
                text: transaction.transactionHash,
                icon: NETWORK_ICON_MAP[network],
                type: 'transaction',
            },
            ago: getTimePassed((new Date(transaction.executionDate)).getTime()/1000),
            sender: transaction.module,
            target: [transaction.to],
            status: transaction.isSuccessful,
        });
    });
    return newRows;
};

const createMultiSigTransactionTableRows = (transactions: MultiSigTransaction[], network: string): tableDataT['rows'] => {
    let newRows = [] as tableDataT['rows'];
    if (!transactions) return newRows;
    transactions.forEach((transaction) => {
        newRows.push({
            token: {
                text: transaction.transactionHash,
                icon: NETWORK_ICON_MAP[network],
                type: 'transaction',
            },
            ago: getTimePassed((new Date(transaction.blockTimestamp)).getTime()/1000),
            sender: transaction.safe,
            target: [transaction.to],
            fee: getFee(parseInt(transaction.ethGasPrice), network),
            status: transaction.isSuccessful,
        });
    });
    return newRows;
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function calculateTokenValue(value: number, decimals: string | null): string {
    let responseValue;
    if (decimals == null) responseValue = (value / Math.pow(10, 18))
    else responseValue = (value / Math.pow(10, parseInt(decimals)));
    
    if (responseValue < 0.0001) return responseValue.toExponential(2);
    else return responseValue.toFixed(4);
}

function Account(props: any) {
    const router = useRouter();
    const [tableLoading, setTableLoading] = useState(true);
    const [tabNo, setTabNo] = useState(0);
    const { addressMapping } = useConfig();
    const hash = props.slug && props.slug[0];
    const network = router.query && (router.query.network as string);
    const [rows, setRows] = useState([] as tableDataT['rows']);
    const [addressInfo, setAddressInfo] = useState<Safe>();
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, _setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [tokenBalances, setTokenBalances] = useState<tokenBalance[]>([]);
    const [erc20Transfers, setErc20Transfers] = useState<tokenTransferAlchemy[]>([]);
    const [erc20TransfersTableRows, setErc20TransfersTableRows] = useState<tableDataT['rows']>([]);
    const [erc721TransfersTableRows, setErc721TransfersTableRows] = useState<tableDataT['rows']>([]);
    const [erc721Transfers, setErc721Transfers] = useState<tokenTransferAlchemy[]>([]);
    const [erc20PageNo, setErc20PageNo] = useState(0);
    const [erc721PageNo, setErc721PageNo] = useState(0);
    const [moduleTransactions, setModuleTransactions] = useState<SafeModuleTransaction[]>([]);
    const [multiSigTransactions, setMultiSigTransactions] = useState<MultiSigTransaction[]>([]);
    const [moduleTxnCount, setModuleTxnCount] = useState(0);
    const [multiSigTxnCount, setMultiSigTxnCount] = useState(0);
    const [multiSigTransactionsTableRows, setMultiSigTransactionsTableRows] = useState<tableDataT['rows']>([]);
    const [moduleTransactionsTableRows, setModuleTransactionsTableRows] = useState<tableDataT['rows']>([]);
    const [transactionsPageNo, setTransactionsPageNo] = useState(0);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // update the page No after changing the pageSize
    const setPageSize = (size: number) => {
        _setPageSize(size);
        setPageNo(0);
        setErc20PageNo(0);
        setErc721PageNo(0);
    };

    // fetch erc 20 balances
    const loadAccountBalances = async (name: string, network: string) => {
        const tokenBalances = await getAddressBalances(name, network, DEFAULT_PAGE_SIZE, pageNo, toast);
        setTokenBalances(tokenBalances);
    };

    const loadAccountModuleTransactions = async (name: string, network: string) => {
        const moduleTransactionsResponse = await getSafeModuleTransactions(name, network, DEFAULT_PAGE_SIZE, pageNo, toast);
        const count = moduleTransactionsResponse.count;
        
        const moduleTransactions = moduleTransactionsResponse.results;
        const moduleTransactionsTableRows = createModuleTransactionTableRows(moduleTransactions.slice(0, pageSize * (pageNo + 1)), network);
        console.log("module Transactions - "+moduleTransactions);
        
        setModuleTxnCount(count)
        setModuleTransactions(moduleTransactions);
        setModuleTransactionsTableRows(moduleTransactionsTableRows);
    };

    const loadAccountMultiSigTransactions = async (name: string, network: string) => {
        setTableLoading(true);
        const multiSigTransactionsResponse = await getSafeMultiSigTransactions(name, network, DEFAULT_PAGE_SIZE, pageNo, toast);
        const count = multiSigTransactionsResponse.count;
        const multiSigTransactions = multiSigTransactionsResponse.results;
        const multiSigTransactionsTableRows = createMultiSigTransactionTableRows(multiSigTransactions.slice(0, pageSize * (pageNo + 1)), network);
        
        setMultiSigTxnCount(count);
        setMultiSigTransactions(multiSigTransactions);
        setMultiSigTransactionsTableRows(multiSigTransactionsTableRows);
        setTableLoading(false);
    };

    // fetch erc20 transfers
    const loadAccountERC20Transfers = async (name: string, network: string) => {
        const erc20Transfers = await getAddressERC20Transfers(name, network ? network : '', DEFAULT_PAGE_SIZE, pageNo, toast);
        const erc20TableRows = constructERC20TransferRows(erc20Transfers.slice(0, pageSize * (pageNo + 1)), network ? network : '');
        setErc20Transfers(erc20Transfers);
        setErc20TransfersTableRows(erc20TableRows);
    };

    // getch erc721 transfers
    const loadAccountERC721Transfers = async (name: string, network: string) => {
        const erc721Transfers = await getAddressERC721Transfers(name, network ? network : '', DEFAULT_PAGE_SIZE, pageNo, toast);
        const erc721TableRows = constructERC721TransferRows(erc721Transfers.slice(0, pageSize * (pageNo + 1)), network ? network : '');
        setErc721TransfersTableRows(erc721TableRows);
        setErc721Transfers(erc721Transfers);
    };

    // load the account details.
    const loadAccountDetails = async (name: string, network: string) => {
        setTableLoading(true);
        const safe = await getSafeAddress(name, network);
        if (safe) {
            setAddressInfo(safe);
        }
        setTableLoading(false);
    };

    useEffect(() => {
        let erc20RowData = constructERC20TransferRows(
            erc20Transfers.slice(pageSize * erc20PageNo, pageSize * (erc20PageNo + 1)),
            network ? network : '',
        );
        setErc20TransfersTableRows(erc20RowData);
        let erc721RowData = constructERC721TransferRows(
            erc721Transfers.slice(pageSize * erc721PageNo, pageSize * (erc721PageNo + 1)),
            network ? network : '',
        );
        setErc721TransfersTableRows(erc721RowData);
    }, [erc20PageNo, erc721PageNo]);

    let prevHash = hash;
    let prevNetwork = network;
    useEffect(() => {
        // Check if hash or network have changed
        if (prevHash !== undefined || prevNetwork !== undefined) {
            prevHash = hash;
            prevNetwork = network;
            loadAccountDetails(hash as string, network as string);
            loadAccountModuleTransactions(hash as string, network as string);
            loadAccountMultiSigTransactions(hash as string, network as string);
            loadAccountBalances(hash as string, network as string);
            loadAccountERC20Transfers(hash as string, network as string);
            loadAccountERC721Transfers(hash as string, network as string);
        }
    }, [hash, network]);

    if (!mounted) return <></>;

    return (
        <div className="">
            <Navbar searchbar />
            <section className="px-3 py-10">
                <div className="container px-0">
                    <div className="flex flex-row">
                        <Link href="/" className="text-gray-500">
                            <ArrowBackIcon
                                style={{ height: '15px', width: '15px', marginRight: '20px', marginLeft: '10px', marginBottom: '3px' }}
                            />
                        </Link>
                        <Breadcrumbs aria-label="breadcrumb" className="font-['Roboto']">
                            <Link underline="hover" color="inherit" href={`/?network=${network ? network : ''}`}>
                                Home
                            </Link>
                            <Link
                                underline="hover"
                                color="text.primary"
                                href={`/address/${hash}?network=${network ? network : ''}`}
                                aria-current="page"
                            >
                                {shortenString(hash as string)}
                            </Link>
                        </Breadcrumbs>
                    </div>
                    <h1 className="text-3xl font-bold">Account</h1>
                </div>
            </section>
            <HeaderSection item={addressInfo} network={network} />
            <TransactionDetails item={addressInfo ? addressInfo : {} as Safe} network={network} addressMapping={addressMapping} tokenBalances={tokenBalances} tableLoading={tableLoading}/>

            <div className="container px-0">
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabNo} onChange={(e, newTabNo) => setTabNo(newTabNo)} aria-label="basic tabs example">
                            <Tooltip title='Multi Signature Transactions' placement='top'><Tab label={`Multi Signature Txns (${multiSigTxnCount})`} tabIndex={0} {...a11yProps(0)} /></Tooltip> 
                            <Tooltip title='Module Transactions' placement='top'><Tab label={`Module Transactions (${moduleTxnCount})`} tabIndex={3} {...a11yProps(2)} /></Tooltip>
                            <Tooltip title='ERC-20 Transfers' placement='top'><Tab label={`Token Transfers (${erc20Transfers.length})`} tabIndex={1} {...a11yProps(1)} /></Tooltip>
                            <Tooltip title='ERC721 + ERC1155 Transfers' placement='top'><Tab label={`NFT Transfers (${erc721Transfers.length})`} tabIndex={2} {...a11yProps(2)} /></Tooltip>
                        </Tabs>
                    </Box>
                    <TabPanel value={tabNo} index={0}>
                        <Table
                            rows={multiSigTransactionsTableRows}
                            columns={multiSigTransactionColumns}
                            loading={tableLoading}
                        />
                        <Pagination
                            pageDetails={{
                                pageNo,
                                setPageNo,
                                pageSize,
                                setPageSize,
                                totalRows: multiSigTxnCount, //TODO
                            }}
                        />
                    </TabPanel>
                    <TabPanel value={tabNo} index={1}>
                        <Table
                            rows={moduleTransactionsTableRows}
                            columns={moduleTransactionColumns}
                            loading={tableLoading}
                        />
                        <Pagination
                            pageDetails={{
                                pageNo: transactionsPageNo,
                                setPageNo: setTransactionsPageNo,
                                pageSize,
                                setPageSize,
                                totalRows: moduleTransactionsTableRows.length,
                                fixedPageSize: moduleTxnCount,
                            }}
                        />
                    </TabPanel>
                    <TabPanel value={tabNo} index={2}>
                        <Table
                            rows={erc20TransfersTableRows}
                            columns={erc20TransferColumns}
                            loading={tableLoading}
                        />
                        <Pagination
                            pageDetails={{
                                pageNo: erc20PageNo,
                                setPageNo: setErc20PageNo,
                                pageSize,
                                setPageSize,
                                totalRows: erc20Transfers.length,
                            }}
                        />
                    </TabPanel>
                    <TabPanel value={tabNo} index={3}>
                        <Table
                            rows={erc721TransfersTableRows}
                            columns={erc721TransferColumns}
                            loading={tableLoading}
                        />
                        <Pagination
                            pageDetails={{
                                pageNo: erc721PageNo,
                                setPageNo: setErc721PageNo,
                                pageSize,
                                setPageSize,
                                totalRows: erc721Transfers.length,
                            }}
                        />
                    </TabPanel>
                </Box>
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
}

export default Account;
