import axios from 'axios';
import { LATEST_MULTI_SIG_TRANSACTIONS, LATEST_MODULE_TRANSACTIONS, GET_MODULE_TRANSACTIONS, CHECK_TRANSACTION_HASH } from './queries';
import { head } from 'lodash';
import { config } from 'process';
import { ethers } from 'ethers';
import { StringLiteral } from 'typescript';

const HEADERS = {
    'Content-Type': 'application/json',
    // 'X-CSRFToken': 'RYLFUhHa9msgdH46fH3lhTN9jygyI7eq1aSGBYeZHhY9dRD55E6V0ZC0ebu78vxe'
};

const SAFE_BASE_URL: { [key: string]: string } = {
    polygon: 'https://safe-transaction-polygon.safe.global/api',
};

const GRAPH_URL: { [key: string]: string } = {
    polygon: 'https://api.thegraph.com/subgraphs/name/lazycoder1/subgraph-safe-matic',
};

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

export interface SafeModuleTransactionResponse {
    count: number;
    next: string;
    previous: string;
    results: SafeModuleTransaction[];
}

export interface SafeMultiSigTransactionResponse {
    count: number;
    next: string;
    previous: string;
    results: MultiSigTransaction[];
}
export interface SafeModuleTransaction {
    created: string;
    executionDate: string;
    blockNumber: number;
    isSuccessful: boolean;
    transactionHash: string;
    module: string;
    to: string;
    value: string;
    data: string;
    operation: number;
    dataDecoded?: {
        method: string;
        parameters: [
            {
                name: string;
                type: string;
                value: string;
            },
        ];
    };
    moduleTransactionId: string;
}
export interface moduleTransaction {
    value: string;
    from: string;
    to: string;
    success: boolean;
    blockTimestamp: number;
    transactionHash: string;
}

export interface Safe {
    address: string;
    nonce: number;
    threshold: number;
    owners: string[];
    masterCopy: string;
    modules: string[];
    fallbackHandler: string;
    gaurd: string;
    version: string;
}

// Path: src/components/common/apiCalls/safeScanApis.tsx
const sendGraphPostRequest = async (network: string, query: any, variables?: any) => {
    const response = await axios.post(GRAPH_URL[network], { query, variables }, { headers: HEADERS });
    return response.data.data;
};

const sendSafeApiGetRequest = async (network: string, endpoint: string) => {
    console.log('network - ',network);
    const url = `${SAFE_BASE_URL[network]}/${endpoint}`;
    console.log('url - ',url);
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error calling Safe API:', error);
        return null;
    }
};

export const getLatestMultiSigTransactions = async () => {
    const query = LATEST_MULTI_SIG_TRANSACTIONS;
    const data = await sendGraphPostRequest('polygon', query);
    return data.safeMultiSigTransactions;
};

export const getLatestModuleTransactions = async () => {
    const query = LATEST_MODULE_TRANSACTIONS;
    const data = await sendGraphPostRequest('polygon', query);
    return data.safeModuleTransactions;
};

export const getMultiSigTransaction = async (transactionHash: string, selectedNetwork: string) => {
    const endpoint = `v1/multisig-transactions/${transactionHash}`;
    return await sendSafeApiGetRequest(selectedNetwork, endpoint);
};

export const getSafeModuleTransaction = async (transactionHash: string, selectedNetwork: string): Promise<SafeModuleTransaction | null> => {
    const graphResponse = await sendGraphPostRequest(selectedNetwork, GET_MODULE_TRANSACTIONS, { transactionHash });
    const transactionFromGraph = graphResponse.safeModuleTransactions[0];
    const checkSumAddress = ethers.utils.getAddress(transactionFromGraph.from);
    const endpoint = `v1/safes/${checkSumAddress}/module-transactions/?transaction_hash=${transactionHash}`;
    const safeResponse = await sendSafeApiGetRequest(selectedNetwork, endpoint);
    return safeResponse.results[0];
};

export const getSafeAddress = async (safe: string, network: string): Promise<Safe> => {
    const checkSumAddress = ethers.utils.getAddress(safe);
    const endpoint = `v1/safes/${checkSumAddress}`;
    const data = await sendSafeApiGetRequest(network, endpoint);
    return data || ({} as Safe);
};

export const getSafeMultiSigTransactions = async (
    safe: string,
    network: string,
    pageSize: number,
    pageNumber: number,
    toast: any,
): Promise<SafeMultiSigTransactionResponse> => {
    const checkSumAddress = ethers.utils.getAddress(safe);
    const endpoint = `v1/safes/${checkSumAddress}/multisig-transactions/`;
    const data = await sendSafeApiGetRequest(network, endpoint);
    console.log('data multisig txns - ', data);
    
    return data?.count > 0 ? data : {count: 0, next: '', previous: '', results: []};
};

export const getSafeModuleTransactions = async (
    safe: string,
    network: string,
    pageSize: number,
    pageNumber: number,
    toast: any,
): Promise<SafeModuleTransactionResponse> => {
    const checkSumAddress = ethers.utils.getAddress(safe);
    const endpoint = `v1/safes/${checkSumAddress}/module-transactions/`;
    const data = await sendSafeApiGetRequest(network, endpoint);
    console.log('data module txns - ', data)
    return data?.count > 0 ? data : {count: 0, next: '', previous: '', results: []};
};

export const checkTransactionHash = async (transactionHash: string, network: string) => {
    if (transactionHash.substring(0,2) == "0x") 
        transactionHash = transactionHash.substring(2);
    const graphResponse = await sendGraphPostRequest(network, CHECK_TRANSACTION_HASH, { transactionHash });
    if (graphResponse.safeModuleTransactions.length > 0) {
        return {type:"module", transactionHash: "0x" + transactionHash};
    } else if (graphResponse.safeMultiSigTransactions.length > 0) {
        return {type: "multiSig", transactionHash: graphResponse.safeMultiSigTransactions[0].safeTxHash};
    } else {
        return {type: "none", transactionHash: "0x"+transactionHash};
    }
};