import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "ngit.org.in",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "ngistudyzone.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "www.ngistudyzone.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "img.freepik.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.pinimg.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.ytimg.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "media.9curry.com",
                pathname: "/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Permissions-Policy",
                        value: "camera=(self), microphone=(), geolocation=(self), interest-cohort=()",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net https://checkout.razorpay.com https://unpkg.com; script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://checkout.razorpay.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; connect-src 'self' https://emkc.org https://*.emkc.org https://api.razorpay.com https://lumberjack.razorpay.com; frame-src 'self' https://www.google.com https://www.youtube.com https://*.google.com https://onecompiler.com https://*.onecompiler.com https://checkout.razorpay.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; worker-src 'self' blob:;",
                    },
                ],
            },
        ];
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/react-icons"],
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
} as any;

export default nextConfig as NextConfig;
