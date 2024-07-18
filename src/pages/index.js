import React from 'react';

export default function Home() {
    React.useEffect(() => {
        window.location.href = 'https://faircompute.com/';
    }, []);
    return null;
}
