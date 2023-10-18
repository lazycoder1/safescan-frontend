export const NETWORK_LIST = [
    {
        name: 'Polygon',
        key: 'polygon',
        iconPath: '/images/polygon-icon.svg',
        iconPathInverted: '/images/polygon-icon.svg',
    },
    {
        name: 'Mainnet',
        key: 'mainnet',
        iconPath: '/images/ethereum-logo-rainbow.svg',
        iconPathInverted: '/images/ethereum-logo-rainbow.svg',
    },
    {
        name: 'Arbitrum One',
        key: 'arbitrum-one',
        iconPath: '/images/arbitrum-logo.svg',
        iconPathInverted: '/images/arbitrum-logo.svg',
    },
    {
        name: 'Optimism',
        key: 'optimism',
        iconPath: '/images/icon-container (6).svg',
        iconPathInverted: '/images/icon-container (6).svg',
    },
];

export const PAGE_SIZE_LIST: number[] = [10, 25, 50, 100];

interface NETWORK_ICON_MAP {
    [key: string]: string;
}

export const NETWORK_ICON_MAP: NETWORK_ICON_MAP = {
    mainnet: '/images/ethereum-logo-rainbow.svg',
    goerli: '/images/eth-diamond-purple.svg',
    sepolia: '/images/eth-diamond-purple.svg',
    matic: '/images/polygon-icon.svg',
    polygon: '/images/polygon-icon.svg',
    mumbai: '/images/polygon-mumbai-icon.svg',
    'optimism-goerli': '/images/icon-container (6).svg',
    optimism: '/images/icon-container (6).svg',
    'arbitrum-one': '/images/arbitrum-logo.svg',
    'arbitrum-goerli': '/images/arbitrum-logo.svg',
    'avalanche': '/images/avalanche-logo-red.svg',
    'avalanche-fuji': '/images/avalanche-logo-red.svg',
    'fantom': '/images/fantom-logo.svg',
    'fantom-testnet': '/images/fantom-logo.svg',
    'base-testnet': '/images/base-logo.svg',
    'base': '/images/base-logo.svg',
    'gnosis': '/images/gnosis-logo.svg',
    'bsc': '/images/bsc-logo.svg',
    'fuse': '/images/fuse-logo.svg',
};

export const NETWORK_SCANNER_MAP: { [key: string]: string } = {
    mainnet: 'https://etherscan.io',
    goerli: 'https://goerli.etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    mumbai: 'https://mumbai.polygonscan.com',
    matic: 'https://polygonscan.com',
    polygon: 'https://polygonscan.com',
    'optimism-goerli': 'https://goerli-optimism.etherscan.io',
    'arbitrum-one': 'https://arbiscan.io',
    'arbitrum-goerli': 'https://goerli.arbiscan.io',
    optimism: 'https://optimistic.etherscan.io',
    avalanche: 'https://snowtrace.io',
    "base-testnet": 'https://goerli.basescan.org',
    fantom: 'https://ftmscan.com/',
    "fantom-testnet": 'https://testnet.ftmscan.com',
    gnosis: 'https://gnosisscan.io',
    bsc: 'https://bscscan.com',
    "avalanche-fuji": 'https://testnet.snowtrace.io',
    "fuse": 'https://explorer.fuse.io',
    'base': 'https://basescan.org',
};

export const POWERED_BY_LOGO_MAP: { [id: string]: {[id: string]: string} } = {
    pimlico: {
        small:'/images/pimlico.svg',
        wide: '',
    },
    biconomy: {
        small:'/images/Biconomy-small.svg',
        wide: '/images/Biconomy-wide.svg',
    },
    candide: {
        small: '/images/candide.svg',
        wide: '/images/candide.svg',
    },
};

export const fallBack = 'fallback';
