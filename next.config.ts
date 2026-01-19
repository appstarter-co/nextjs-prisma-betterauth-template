import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: '**', // This wildcard allows any hostname
            port: '',
            pathname: '**', // This wildcard allows any path
        },
        ],
    },
};

export default nextConfig; ``