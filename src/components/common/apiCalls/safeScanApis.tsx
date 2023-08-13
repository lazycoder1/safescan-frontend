import axios from 'axios';
import { LATEST_MULTI_SIG_TRANSACTIONS, LATEST_MODULE_TRANSACTIONS } from './queries';
import { head } from 'lodash';
import { config } from 'process';

const HEADERS = {
    'Content-Type': 'application/json',
    // 'X-CSRFToken': 'RYLFUhHa9msgdH46fH3lhTN9jygyI7eq1aSGBYeZHhY9dRD55E6V0ZC0ebu78vxe'
};

const SAFE_BASE_URL: {[key: string]: string} = {
    "polygon": "https://safe-transaction-polygon.safe.global/api",
}

const GRAPH_URL = {
    "polygon": "https://api.thegraph.com/subgraphs/name/lazycoder1/subgraph-safe-matic"
}

export interface MultiSigTransaction {
    value: string;
    from: string;
    to: string;
    success: boolean;
    blockTimestamp: number;
    transactionHash: string;
    safeTxHash: string;
    safe: string;
    operation: number;
    gasToken: string;
    baseGas: number;
    gasPrice: string;
    data: string;
    refundReceiver: string;
    nonce: number;
    executionDate: string;
    submissionDate: string;
    blockNumber: number;
    executor: string;
    isExecuted: boolean;
    isSuccessful: boolean;
    ethGasPrice: string;
    maxFeeGasPrice: string;
    gasUsed: number;
    fee: string;
    dataDecoded: any;
    trusted: boolean;
    confirmations: number;
    signatures: string;
}

export interface moduleTransaction {
    value: string;
    from: string;
    to: string;
    success: boolean;
    blockTimestamp: number;
    transactionHash: string;
}


export const getLatestMultiSigTransactions = async () => {
    const response = await axios.post(
        GRAPH_URL['polygon'],
        {
                query: LATEST_MULTI_SIG_TRANSACTIONS,
        },
        {
            headers: HEADERS,
        },
    );
    console.log(response.data.data)
    return response.data.data.safeMultiSigTransactions;
};

export const getLatestModuleTransactions = async () => {
    const response = await axios.post(
        GRAPH_URL['polygon'],
        {
                query: LATEST_MODULE_TRANSACTIONS,
        },
        {
            headers: HEADERS,
        },
    );
    console.log(response.data.data)
    return response.data.data.safeModuleTransactions;
}

export const getMultiSigTransaction = async (transactionHash: string, selectedNetwork: string) => {
    let response = {data: {}}
    try {
        response = await axios.get(SAFE_BASE_URL[selectedNetwork] + '/v1/multisig-transactions/' + transactionHash+ '/');
    } catch (e) {
        console.log(e);
        return response;
    }
    return response.data;
}


