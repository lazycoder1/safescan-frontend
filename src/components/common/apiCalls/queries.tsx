export const LATEST_MULTI_SIG_TRANSACTIONS = `
query MyQuery {
    safeMultiSigTransactions(
      first: 10
      orderDirection: desc
      orderBy: blockTimestamp
    ) {
      value
      from
      to
      success
      blockTimestamp
      transactionHash
      safeTxHash
    }
    count(id: "count") {
      multiSignTransactions
      moduleTransactions
    }
  }
`;

export const LATEST_MODULE_TRANSACTIONS = `
query MyQuery {
    safeModuleTransactions(
      first: 10
      orderDirection: desc
      orderBy: blockTimestamp
    ) {
      value
      from
      to
      success
      blockTimestamp
      transactionHash
    }
    count(id: "count") {
      multiSignTransactions
      moduleTransactions
    }
  }
`;

export const GET_MODULE_TRANSACTIONS = `
  query MyQuery($transactionHash: String) {
    safeModuleTransactions(
      first: 1
      where: {transactionHash: $transactionHash}
    ) {
      value
      from 
      to
      transactionHash
      blockNumber
    }
  }
`

export const CHECK_TRANSACTION_HASH = `
  query MyQuery($transactionHash: String) {
    safeModuleTransactions(where: {transactionHash_contains: $transactionHash}) {
      id
      transactionHash
    }
    safeMultiSigTransactions(
      where: {or: [{safeTxHash_contains: $transactionHash}, {transactionHash_contains: $transactionHash}]}
    ) {
      id
      transactionHash
      safeTxHash
    }
  }
`