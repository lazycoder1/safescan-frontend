import { tokenBalance } from '@/components/common/apiCalls/jiffyApis';
import Chip, { ChipProps } from '@/components/common/chip/Chip';
import { NETWORK_SCANNER_MAP, POWERED_BY_LOGO_MAP } from '@/components/common/constants';
import CopyButton from '@/components/common/copy_button/CopyButton';
import DisplayFee from '@/components/common/displayfee/DisplayFee';
import IconText from '@/components/common/IconText';
import Caption from '@/components/common/Caption';
import { getFee, getTimePassed, shortenString } from '@/components/common/utils';
import { Link, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton-2';
import { Safe } from '@/components/common/apiCalls/safeScanApis';
import TransactionDetailsRow from '@/components/common/TransactionDetailsRow';

interface TransactionDetailsProps {
    item: Safe;
    network: string;
    addressMapping: any;
    tableLoading: boolean;
    tokenBalances: tokenBalance[];
}

export default function TransactionDetails({ item, network, addressMapping, tableLoading, tokenBalances }: TransactionDetailsProps) {
    console.log('🚀 ~ file: TransactionDetails.tsx:11 ~ TransactionDetails ~ item:', item);
    const [tableLoading1, setTableLoading1] = useState(true);
    const [selectValue, setSelectValue] = useState(0 as number);
    const [totalBalance, setTotalBalance] = useState(0 as number);

    const calculateTotalBalance = (tokenBalances: tokenBalance[]) => {
        let total = 0;
        tokenBalances.forEach((tokenBalance) => {
            total += tokenBalance.quote;
        });
        setTotalBalance(total);
    }

    useEffect(() => {
        setTableLoading1(true);
        if (network) {
            setTimeout(() => {
                setTableLoading1(false);
            }, 1000);
        }
    }, [network]);

    useEffect(() => {
        calculateTotalBalance(tokenBalances);
    })

    let skeletonCards = Array(3).fill(0);
    const router = useRouter();
    return (
        <div>
            <section className="mt-[48px] px-3">
                <div className="container px-0">
                    <div>
                        <Caption icon={'/images/cube.svg'} text={''}>
                            Account Details
                        </Caption>
                    </div>
                    <div className="bg-white overflow-auto rounded shadow-300 mb-[20px]">
                        {tableLoading ? (
                            skeletonCards.map((index: number) => <Skeleton height={55} key={index} />)
                        ) : (
                            <div>
                                <section className="">
                                    <div className="container px-0 rounded">
                                        <TransactionDetailsRow header={"Safe"} value={item?.address} network={network} link={`${NETWORK_SCANNER_MAP[network]}/address/${item.address}`} />
                                        <TransactionDetailsRow header={"Transactions executed"} value={item?.nonce ? item?.nonce.toString() : "0"} network={network} />
                                        <TransactionDetailsRow header={"Owners"} value={item?.owners?.join(", ")} network={network}  />
                                        {totalBalance > -1 && (
                                            <div className="flex md:pt-[0px] pt-[16px] items-center md:border-b border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
                                            <div className="md:w-[280px] px-[16px] py-[8px] flex items-center gap-2">
                                                <IconText icon={'/images/sader.svg'}>
                                                    <span className="text-[14px] font-normal md:block hidden leading-5 text-dark-600">
                                                        Total Balance
                                                    </span>
                                                </IconText>
                                            </div>
                                            <div className="flex-1 gap-2 break-words ">
                                                <div>
                                                    <p className="text-[14px] text-[#455A64] md:hidden block">Total Balance</p>
                                                </div>
                                                <div className="justify-between block md:flex">
                                                    <div className="flex items-center gap-[10px]">
                                                        <span className="text-dark-600 md:text-[14px] text-[16px] break-all leading-5">
                                                            {`$${totalBalance.toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                        {tokenBalances?.length > 0 && (
                                            <div className="flex md:pt-[0px] pt-[16px] items-center md:border-b border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
                                                <div className="md:w-[280px] px-[16px] py-[8px] flex items-center gap-2">
                                                    <IconText icon={'/images/sader.svg'}>
                                                        <span className="text-[14px] font-normal md:block hidden leading-5 text-dark-600">
                                                            ERC20 Balances
                                                        </span>
                                                    </IconText>
                                                </div>
                                                <div className="flex-1 gap-2 break-words ">
                                                    <div>
                                                        <p className="text-[14px] text-[#455A64] md:hidden block">ERC20 Balances</p>
                                                    </div>
                                                    <div className="justify-between block md:flex">
                                                        <div className="flex items-center gap-[10px]">
                                                            <span className="text-dark-600 md:text-[14px] text-[16px] break-all leading-5">
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={selectValue}
                                                                    label="Age"
                                                                    className="w-[300px]"
                                                                    onChange={(e) => setSelectValue(e.target.value as number)}
                                                                >
                                                                    {tokenBalances?.map((token: tokenBalance, index: number) => {
                                                                        
                                                                            return (
                                                                                <MenuItem key={index} value={index}>
                                                                                    <div className="flex flow-root w-full gap-2">
                                                                                        <div className="float-left">
                                                                                            {token.contract_name}  
                                                                                        </div>
                                                                                        <div className="float-right">
                                                                                            {(parseInt(token.balance)/10**token.contract_decimals).toFixed(4)} (${(token.quote_rate*parseInt(token.balance)/10**token.contract_decimals).toFixed()}) 
                                                                                        </div>
                                                                                    </div>
                                                                                </MenuItem>
                                                                            );
                                                                        
                                                                    })}
                                                                </Select>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
