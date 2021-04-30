import React from 'react';
import './common.css';
 
export default function MyApp({ Component, pageProps }) {
    return (
        <Component {...pageProps} />
    );
};