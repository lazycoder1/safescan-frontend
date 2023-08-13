import Link from 'next/link';
import React from 'react';

function Logo() {
    return (
        <Link href="/">
            {/* <img className="hidden md:block" src="/images/Frame 21.svg" alt="" /> */}
            {/* <img src="/images/Frame 19 (1).svg" className="block md:hidden" alt="" /> */}
            <h2 className=" block text-[#455A64] text-[18px] font-bold">Safescan</h2>
        </Link>
    );
}

export default Logo;
