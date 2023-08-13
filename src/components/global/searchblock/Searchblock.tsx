import { NETWORK_LIST } from '@/components/common/constants';
import { useConfig } from '@/context/config';
import { checkIfValidTerm, constructRedirectUrl } from '@/components/common/utils';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Options from './Options';
import { LinearProgress, Snackbar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMultiSigTransaction } from '@/components/common/apiCalls/safeScanApis';

const showToast = (toast: any, message: string) => {
    toast.error(message, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored"
    })
}

function Searchblock({ isNavbar }: { isNavbar: boolean }) {
    const { push } = useRouter();
    const [searching, setSearching] = useState(false);
    const [term, setTerm] = useState('');

    const handleChange = (e: any) => setTerm(e.target.value.trim());

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (checkIfValidTerm(term)) {
            setSearching(true);
            const res = await getMultiSigTransaction(term, 'polygon');
            if ('safe' in res && res.safe != null) {
                // const data = await res.json();
                // let redirectUrl;
                // if (data.foundInNetwork && data.type && data.term)
                //     redirectUrl = constructRedirectUrl(data.type, data.foundInNetwork, data.term);
                // if (redirectUrl) {
                //     push(redirectUrl);
                // } else {
                //     showToast(toast, "No results found")
                // }
                push(`/safeMultiSig/${term}`)
                setSearching(false);
            } else {
                showToast(toast, "Only safe multi sig tx hash supported for now")
                setSearching(false);
            }
        } else {
            showToast(toast, "Invalid search term ?")
        }
    };

    if (isNavbar) {
        return (
            <div className="shadow-300 bg-white rounded border-dark-200 flex-grow max-w-[400px]">
                <label className="flex justify-center">
                    <span onClick={handleSubmit} className="p-2.5 border-r border-dark-200" role="button">
                        <img src="/images/search.svg" alt="" />
                    </span>
                    <div className="flex items-center gap-2.5 pr-3 flex-grow">
                        <input
                            type="text"
                            className="flex-grow px-3 py-2 text-base placeholder:text-dark-500 text-dark-600"
                            placeholder="Search..."
                            value={term}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                        />
                        <span className="flex items-center justify-center h-5 px-3 rounded-full bg-dark-400">
                            <img className="" src="/images/span (1).svg" alt="" />
                        </span>
                    </div>
                </label>
                {searching && <LinearProgress />}
                <ToastContainer />
            </div>
        );
    } else {
        return (
            <div className="shadow-300 bg-white rounded border-dark-200 flex-grow max-w-[812px]">
                <label className="flex justify-center">
                    {/* <Options networkValue={networkValue} setNetworkValue={setNetworkValue} /> */}
                    <div className="flex items-center gap-2.5 pr-4 flex-grow">
                        <input
                            type="text"
                            className="text-base placeholder:text-dark-500 text-dark-600 px-4 py-2 flex-grow truncate min-w-0 max-w-none w-[0px]"
                            placeholder="Search by Safe Transaction Hash..."
                            value={term}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                        />
                        <span className="items-center justify-center hidden h-5 px-3 rounded-full bg-dark-400 md:flex">
                            <img className="" src="/images/span (1).svg" alt="" />
                        </span>
                    </div>
                    <div
                        role="button"
                        className="flex items-center gap-2 py-3.5 px-5 bg-dark-600 rounded-r text-white font-medium text-md tracking-[1.25px] uppercase"
                        onClick={handleSubmit}
                    >
                        <img src="/images/icon-container (25).svg" alt="" />
                        <span className="hidden md:block">Search</span>
                    </div>
                </label>
                {searching && <LinearProgress />}
                <ToastContainer />
            </div>
        );
    }
}

export default Searchblock;
