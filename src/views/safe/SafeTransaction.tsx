import Footer from '@/components/global/footer/Footer';
import Navbar from '@/components/global/navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { getPoweredBy, getUserOp, getUserOpMetadata, metadata, PoweredBy, Trace, UserOp, showToast } from '@/components/common/apiCalls/jiffyApis';
import { Breadcrumbs, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CopyButton from '@/components/common/copy_button/CopyButton';
import Caption from '@/components/common/Caption';
import IconText from '@/components/common/IconText';
import Chip from '@/components/common/chip/Chip';
import sx from './usertable.module.sass';
import { useRouter } from 'next/router';
import { getFee, getTimePassed, shortenString } from '@/components/common/utils';
import { fallBack, NETWORK_ICON_MAP, NETWORK_LIST, NETWORK_SCANNER_MAP } from '@/components/common/constants';

import Tooltip from '@mui/material/Tooltip';
import Skeleton from 'react-loading-skeleton-2';
import moment from 'moment';
import HeaderSection from './HeaderSection';
import TransactionDetails from './TransactionDetails';
import DeveloperDetails from './DeveloperDetails';
import { useConfig } from '@/context/config';
import Table, { tableDataT } from '@/components/common/table/Table';
import User from '@/components/global/navbar/User';
import Spinner from '@/components/common/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMultiSigTransaction } from '@/components/common/apiCalls/safeScanApis';


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const passedTime = (time: number) => {
    let currentTime = (new Date()).getTime();
    let passedTime = currentTime - time;
    return passedTime;
}

async function returnTransactionData(hash: string, network: string, toast: any) {
    let currentTime = (new Date()).getTime();
    let txData = await getMultiSigTransaction(hash, network)
    while (Object.keys(txData).length == 0) {
        await sleep(1000);
        txData = await getMultiSigTransaction(hash, network)
        if (passedTime(currentTime) > 10000) {
            showToast(toast, 'Error fetching data');
            break;
        }
    }
    return txData;
}

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
const columns = [
    { name: 'Hash', sort: true },
    { name: 'Age', sort: true },
    { name: 'Sender', sort: true },
    { name: 'Target', sort: true },
];

const createDuplicateUserOpsRows = (userOps: UserOp[], handleRowClicked: (id: number) => void): tableDataT['rows'] => {
    let newRows = [] as tableDataT['rows'];
    if (!userOps) return newRows;
    userOps.forEach((userOp, i) => {
        newRows.push({
            token: {
                text: userOp.userOpHash,
                icon: NETWORK_ICON_MAP[userOp.network],
                type: 'userOp',
                onTokenClicked: handleRowClicked,
                value: i,
            },
            ago: getTimePassed(userOp.blockTime!),
            sender: userOp.sender,
            target: userOp.target ? userOp.target : ['Unavailable!'],
            fee: getFee(userOp.actualGasCost, userOp.network as string),
            status: userOp.success ? userOp.success : true,
        });
    });
    return newRows;
};

function RecentUserOps(props: any) {
    const router = useRouter();
    const [tableLoading, setTableLoading] = useState(true);
    const { selectedNetwork, setSelectedNetwork, addressMapping } = useConfig();

    const hash = props.slug && props.slug[0];
    // const network = router.query && router.query.network;
    const network = 'polygon';

    const [selectedColor, setSelectedColor] = useState(BUTTON_LIST[0].key);
    // const [userOpsData, setuserOpsData] = useState<UserOp[]>([] as UserOp[]);
    const [showUserOpId, setShowUserOpId] = useState<number>(0);
    // const [responseData, setresponseData] = useState<PoweredBy>();
    // const [metaData, setMetaData] = useState<metadata>();
    // const [duplicateUserOpsRows, setDuplicateUserOpsRows] = useState<tableDataT['rows']>([] as tableDataT['rows']);

    const [safeTransactionData, setSafeTransactionData] = useState<any>({});

    const refreshSafeTable = async (hash: string) => {
        setSafeTransactionData(await returnTransactionData(hash, 'polygon', toast));
        
        setTableLoading(false);
        
    };

    // const handleDuplicateRowClick = (id: number) => {
    //     setShowUserOpId(id);
    // };
    useEffect(() => {
        console.log('safeTransactionData', safeTransactionData);
    }, [safeTransactionData])

    let prevHash = hash;
    useEffect(() => {
        setSelectedNetwork(network as string);
        // Check if hash or network have changed
        if (prevHash !== undefined) {
            prevHash = hash;
            const refreshTable = () => {
                refreshSafeTable(hash as string);
            };

            refreshTable();
        }
    }, [hash]);

    // const fetchUserOpMetadata = async (hash: string, network: string) => {
    //     const metaData = await getUserOpMetadata(hash as string, network, toast);
    //     setMetaData(metaData);
    // }

    // const fetchPoweredBy = async () => {
    //     const beneficiary =
    //         userOpsData
    //             ?.map((item) => item.beneficiary ?? '')
    //             .filter((item) => item !== null)
    //             .join(',') || '';
    //     const paymaster = userOpsData?.map((item) => item.paymaster)?.[0] || '';
    //     const sender = userOpsData?.map((item) => item.sender)?.[0] || '';
    //     const getReached = await getPoweredBy(beneficiary, paymaster, toast);
    //     setresponseData(getReached);
    // };
    useEffect(() => {
        // getMultiSigTransaction();
        // fetchPoweredBy();
    }, []);

    // useEffect(() => {
    //     if (showUserOpId>=0 && userOpsData.length > showUserOpId){
    //         fetchUserOpMetadata(userOpsData[showUserOpId].userOpHash, userOpsData[showUserOpId].network);
    //     }
    // }, [userOpsData, showUserOpId]);

    let skeletonCards = Array(13).fill(0);
    let skeletonCards1 = Array(2).fill(0);
    return (
        <div className="">
            <Navbar searchbar />
            <section className="px-3 py-10">
                <div className="container">
                    <div className="flex flex-row">
                        <Link href="/" className="text-gray-500">
                            <ArrowBackIcon
                                style={{ height: '15px', width: '15px', marginRight: '20px', marginLeft: '10px', marginBottom: '3px' }}
                            />
                        </Link>
                        <Breadcrumbs aria-label="breadcrumb" className="font-['Roboto']">
                            <Link underline="hover" color="inherit" href={'/' + (selectedNetwork ? '?network=' + selectedNetwork : '')}>
                                Home
                            </Link>
                            <Link
                                underline="hover"
                                color="text.primary"
                                // href={`/userOpHash/${hash}?network=${network ? network : ''}`}
                                // onClick={() => setShowUserOpId(-1)}
                                aria-current="page"
                            >
                                {shortenString(hash as string)}
                            </Link>
                        </Breadcrumbs>
                    </div>
                </div>
            </section>
            <>
                    <>
                        <HeaderSection safeHash={safeTransactionData?.safeTxHash} transactionHash={safeTransactionData?.transactionHash} network={network} loading={tableLoading} />
                        <TransactionDetails
                            tableLoading={tableLoading}
                            skeletonCards={skeletonCards}
                            item={safeTransactionData}
                            // responseData={responseData}
                            addressMapping={addressMapping}
                            // metaData={metaData}
                            // setMetadata={setMetaData}
                            selectedNetwork={selectedNetwork}
                        />
                        
                    </>
                
            </>
            <ToastContainer />
            {/* <Footer /> */}
        </div>
    );
}

export default RecentUserOps;
