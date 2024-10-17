import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';

const DownloadWindowsInstaller = () => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        fetch('https://api.cloudrift.ai/internal/release/fair-desktop-full/stable/windows-x86_64/latest/url')
            .then((response) => response.text())
            .then((url) => setUrl(url));
    }, []);

    if (!url) {
        return <span>Loading...</span>;
    }

    return <Link to={url}>Download Windows Installer</Link>;
};

export default DownloadWindowsInstaller;
