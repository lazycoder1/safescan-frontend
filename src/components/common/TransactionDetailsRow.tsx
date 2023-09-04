import IconText from '@/components/common/IconText';
import CopyButton from '@/components/common/copy_button/CopyButton';
import Link from '@mui/material/Link';
import React from 'react';
import LinkAndCopy from './LinkAndCopy';

interface Props {
    header: string;
    network: string;
    value: string | (React.ReactNode);
    link?: string;
    icon?: string;
}

function TransactionDetailsRow({ header, network, value, link, icon }: Props) {
    const isValueReactNode = !(typeof value == "string");
    return (
        <div className="flex items-center md:pt-[0px] pt-[16px]  md:border-b border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
            <div className="md:w-[280px] px-[16px] py-[8px] flex items-center gap-2">
                <IconText icon={icon ? icon : '/images/sader.svg'}>
                    <span className="text-[14px] font-normal md:block hidden leading-5 text-dark-600">{header}</span>
                </IconText>
            </div>
            <div className="flex-1 gap-2 break-words ">
                <div>
                    <p className="text-[14px] text-[#455A64] md:hidden block">{header}</p>
                </div>
                <div className="justify-between block md:flex">
                    {!isValueReactNode ? (
                        <div className="flex items-center gap-[10px]">
                            <LinkAndCopy text={value as string} link={link ? link : null} copyText={value as string} />

                            {link && (
                                <Link
                                    underline="hover"
                                    // color="text.primary"
                                    href={link}
                                    aria-current="page"
                                    className="text-blue-200 "
                                    target={'_blank'}
                                >
                                    <button className="hidden outline-none md:block focus:outline-none ring-0 focus:ring-0">
                                        <img src="/images/share.svg" alt="" />
                                    </button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-[10px]">{value}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TransactionDetailsRow;
