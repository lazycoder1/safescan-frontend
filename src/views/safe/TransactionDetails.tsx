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

interface confirmation {
    owner: string;
    submissionDate: string;
}

interface ConfirmationProps {
    confirmations: confirmation[];
}
function Confirmations({ confirmations }: ConfirmationProps): React.ReactNode {
    return (
        <div className="">
            {confirmations.map((confirmation, index) => (
                <div key={index} className="items-center flow-root md:flex">
                    <LinkAndCopy text={confirmation.owner} copyText={confirmation.owner} link={null}></LinkAndCopy> at{' '}
                    {confirmation.submissionDate}
                </div>
            ))}
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton-2';
import ERC20Transfers from './ERC20Transfers';
import ExecutionTrace from './ExecutionTrace';
import ERC721Transfers from './ERC721Transfers';
import TransactionDetailsRow from '@/components/common/TransactionDetailsRow';
export default function TransactionDetails({ tableLoading, skeletonCards, item, addressMapping, selectedNetwork }: any) {
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
                                            header={'Safe'}
                                            value={item?.safe}
                                            network="polygon"
                                            link={`/account/${item?.safe}?network=${selectedNetwork ? selectedNetwork : ''}`}
                                        />
                                        <TransactionDetailsRow
                                            key="2"
                                            header={'Target'}
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
                                            value={item?.blockNumber}
                                            network="polygon"
                                            // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                        />
                                        <TransactionDetailsRow
                                            key="6"
                                            header={'Safe Hash'}
                                            value={item?.safeTxHash}
                                            network="polygon"
                                            // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                        />
                                        <TransactionDetailsRow
                                            key="7"
                                            header={'Gas Used'}
                                            value={item?.gasUsed}
                                            network="polygon"
                                            // link={`/account/${item?.to}?network=${item?.network ? item?.network : ''}`}
                                        />
                                        <TransactionDetailsRow
                                            key="8"
                                            header={'Success'}
                                            value={item?.isSuccessful ? 'Success' : 'Failure'}
                                            network="polygon"
                                        />
                                        <TransactionDetailsRow key="9" header={'Timestamp'} value={item?.executionDate} network="polygon" />
                                        <TransactionDetailsRow key="10" header={'Nonce'} value={item?.nonce} network="polygon" />
                                        <TransactionDetailsRow
                                            key="11"
                                            header={'Approved by'}
                                            value={Confirmations({ confirmations: item?.confirmations })}
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
