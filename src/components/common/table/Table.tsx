import Chip, { ChipProps } from '@/components/common/chip/Chip';
import React, { useEffect, useState } from 'react';
import Token, { TokenType } from '@/components/common/Token';
import Caption, { CaptionProps } from '../Caption';
import ScrollContainer from 'react-indiana-drag-scroll';
import useWidth from '@/hooks/useWidth';
import { getCurrencySymbol } from '../utils';
import Skeleton from 'react-loading-skeleton-2';
import Status from '../status/Status';
import { POWERED_BY_LOGO_MAP } from '../constants';
// import Skeleton from '@/components/Skeleton';

export interface tableDataT {
    caption?: CaptionProps;
    columns: {
        name: string;
        sort: boolean;
    }[];
    rows: {
        token?: TokenType;
        ago?: string;
        sender?: string;
        target?: string[];
        fee?: fee;
        userOps?: string;
        status?: Boolean;
        account?: TokenType;
        count?: string;
        poweredBy?: string;
    }[];
    loading: boolean;
    onRowClick?: (idx: number) => void;
    hideHeader?: boolean;
}

export interface fee {
    value: string | { hex: string, type: string };
    gas?: {
        children: string;
        color: string;
    };
    component?: React.ReactNode;
}

function Table(props: tableDataT) {
    const { rows, columns, caption, onRowClick, hideHeader } = props;
    const width = useWidth();

    let skeletonCards = Array(5).fill(0);
    return (
        <div className="">
            {!hideHeader && caption?.text && <Caption icon={caption?.icon!} text={caption?.text}>
                {caption?.children}
            </Caption>}
            <ScrollContainer>
                <div style={width < 768 ? { minWidth: columns?.length * 160 } : {}}>
                    <table className="w-full bg-white border text-md shadow-200 border-dark-100">
                        <thead>
                            <tr>
                                {columns?.map(({ name, sort }, key) => {
                                    return (
                                        <th
                                            key={key}
                                            className={`py-3.5 px-4 border-b border-dark-100 group ${
                                                columns.length <= 3 ? 'md:first:wx-[55%]' : ''
                                            }`}
                                        >
                                            <div
                                                role={sort ? 'button' : undefined}
                                                className={`flex items-center gap-2.5 ${
                                                    columns.length <= 3 ? 'group-last:justify-end' : ''
                                                }`}
                                            >
                                                <span>{name}</span>
                                                {name === 'Age' ? sort && <img src="/images/span.svg" alt="" /> : null}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        {props.loading ? (
                            <tbody>
                                {skeletonCards.map((index: number) => {
                                    return (
                                        <>
                                            <tr>
                                                <td colSpan={5}>
                                                    <Skeleton height={40} key={index} />
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        ) : (
                            <tbody>
                                {rows?.map(({ ago, fee, sender, target, token, userOps, status, count, poweredBy }, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="[&_td]:border-b User_Operations_table [&_td]:border-dark-100 [&_td]:py-3.5 [&_td]:px-4 odd:bg-dark-25 hover:bg-dark-25"
                                        >
                                            {token && (
                                                <td className="">
                                                    <Token {...token} />
                                                </td>
                                            )}

                                            {ago && (
                                                <td className="">
                                                    {status === true ? (
                                                        <Status status="success" ago={ago} />
                                                    ) : (
                                                        <>
                                                            {status === false ? (
                                                                <Status status="failure" ago={ago} />
                                                            ) : (
                                                                <span className="tracking-normal">{ago}</span>
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            )}
                                            
                                            {userOps && (
                                                <td className="">
                                                    <span className="block text-center">{userOps}</span>
                                                </td>
                                            )}

                                            {sender && (
                                                <td className="">
                                                    <Token text={sender} type="blank" />
                                                </td>
                                            )}

                                            {target && (
                                                <td className="">
                                                    
                                                    { target.length > 0 &&  target.map((item, index) => {
                                                        console.log('target from table', target)
                                                        return (
                                                            <Token key={index} text={item} type="blank" />
                                                        )
                                                    })}
                                                </td>
                                            )}

                                            {fee && (
                                                <td className="">
                                                    <div className="flex items-center justify-end gap-2 text-right">
                                                        {fee.value ? <span>{typeof fee.value == "string" ? fee.value : parseInt(fee.value.hex)}</span> : "Unavailable" }
                                                        {fee.gas && fee.value && (
                                                            <Chip variant="outlined" color={fee.gas.color as ChipProps['color']}>
                                                                {fee.gas.children}
                                                            </Chip>
                                                        )}
                                                        {fee.component && fee.component}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        )}
                    </table>
                </div>
            </ScrollContainer>
        </div>
    );
}

export default Table;
