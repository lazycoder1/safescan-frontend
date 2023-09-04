import Head from 'next/head';
import Link from 'next/link';


const SEO = () => (
    <Head>
        <meta name="description" content="Safe Ecosystem Explorer !" />
        <meta name="keywords" content="Safe, Account Abstraction, Explorer, BlockChain"></meta>
        <meta name="author" content="Jiffy Labs"></meta>
        <meta property="og:title" content="Safe Scan - Safe Explorer" />
        <meta property="og:type" content="blockchain explorer" />
        {/* <meta property="og:url" content="https://www.jiffyscan.xyz/" /> */}
        <meta property="og:image" content="https://jiffyscan-public-assets.s3.us-east-2.amazonaws.com/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@jiffylabs"></meta>
        <meta name="twitter:creator" content="@jiffylabs"></meta>
        <meta name="twitter:title" content="Safe Scan - Safe ecosystem Explorer"></meta>
        <meta name="twitter:description" content="Transaction Explorer for safe ecosystem"></meta>
        <meta name="twitter:image" content="https://jiffyscan-public-assets.s3.us-east-2.amazonaws.com/favicon.jpg"></meta>
        <title>Safe Scan - Safe Ecosystem Explorer</title>
    </Head>
);

export default SEO;
