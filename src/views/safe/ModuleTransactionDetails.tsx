import { UserOp, erc20Transfer, metadata } from '@/components/common/apiCalls/jiffyApis';
import { NETWORK_SCANNER_MAP, POWERED_BY_LOGO_MAP } from '@/components/common/constants';
import CopyButton from '@/components/common/copy_button/CopyButton';
import DisplayFee from '@/components/common/displayfee/DisplayFee';
import IconText from '@/components/common/IconText';
import LinkAndCopy from '@/components/common/LinkAndCopy';
import Status from '@/components/common/status/Status';
import Caption from '@/components/common/Caption';
import { shortenString } from '@/components/common/utils';
import { Link, Tooltip, Box, CircularProgress } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';
import { populateERC20TransfersWithTokenInfo } from '@/components/common/apiCalls/jiffyApis';

export interface ExecutionTraceType {
    traceData: {
        from: string;
        to: string;
        value: string;
        input: string;
        output: string;
        gasUsed: string;
        gas: string;
        type: string;
        method?: string;
        decodedInput?: Array<{
            value: string;
            type: string;
            name: string;
        }>;
    };
    next: Array<ExecutionTraceType> | null;
}

import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton-2';
import ERC20Transfers from './ERC20Transfers';
import ExecutionTrace from './ExecutionTrace';
import ERC721Transfers from './ERC721Transfers';
import TransactionDetailsRow from '@/components/common/TransactionDetailsRow';
import { SafeModuleTransaction } from '@/components/common/apiCalls/safeScanApis';
export default function ModuleTransactionDetails({
    tableLoading,
    skeletonCards,
    item,
    addressMapping,
    selectedNetwork,
}: {
    tableLoading: boolean,
    skeletonCards: any,
    item: SafeModuleTransaction,
    addressMapping: any,
    selectedNetwork: string
}) {
    const router = useRouter();
    const [showMetadata, setShowMetadata] = useState(false);
    const [reload, setReload] = useState(0);
    const [targets, setTargets] = useState([] as Array<string>);
    const [invokes, setInvokes] = useState([] as Array<string>);
    const [values, setValues] = useState([] as Array<number>);
    const [beneficiary, setBeneficiary] = useState('');
    const [type, setType] = useState('');

    console.log('item', item);

    return (
        <div>
            <section className="mt-[48px] px-3">
                <div className="container px-0">
                    <div>
                        <Caption icon={'/images/cube.svg'} text={''}>
                            Transaction Details
                        </Caption>
                    </div>
                    <div className="mb-10 overflow-auto bg-white rounded shadow-300">
                        {tableLoading ? (
                            skeletonCards.map((index: number) => <Skeleton height={55} key={index} />)
                        ) : (
                            <div>
                                <section className="">
                                    <div className="container px-0 rounded">
                                            <TransactionDetailsRow
                                                key="1"
                                                header={'Sender'}
                                                value={item?.module}
                                                network="polygon"
                                                // link={`/account/${item?.safe}?network=${item?.network ? item?.network : ''}`}
                                            />
                                            <TransactionDetailsRow
                                                key="2"
                                                header={'Receiver'}
                                                value={item?.to}
                                                network="polygon"
                                                // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                            />
                                            <TransactionDetailsRow
                                                key="3"
                                                header={'Value'}
                                                value={item?.value}
                                                network="polygon"
                                                // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                            />
                                            <TransactionDetailsRow
                                                key="4"
                                                header={'Transaction Hash'}
                                                value={item?.transactionHash}
                                                network="polygon"
                                                // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                            />
                                            <TransactionDetailsRow
                                                key="5"
                                                header={'Block Number'}
                                                value={item?.blockNumber.toString()}
                                                network="polygon"
                                                // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                            />
                                            <TransactionDetailsRow
                                                key="6"
                                                header={'Safe Module ID'}
                                                value={item?.moduleTransactionId}
                                                network="polygon"
                                                // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                            />
                                            
                                            <TransactionDetailsRow
                                                key="8"
                                                header={'Success'}
                                                value={item?.isSuccessful ? 'Success' : 'Failure'}
                                                network="polygon"
                                            />
                                            <TransactionDetailsRow
                                                key="9"
                                                header={'Timestamp'}
                                                value={item?.executionDate}
                                                network="polygon"
                                            />
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
