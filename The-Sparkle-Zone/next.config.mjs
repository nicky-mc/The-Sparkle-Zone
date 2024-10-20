/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hasatlmjddrwgmaaosen.supabase.co",
        pathname: "/storage/v1/object/public/image_for_url/**",
      },
    ],
  },
  env: {
    SUPABASE_DB_CONNECTION_URL: process.env.SUPABASE_DB_CONNECTION_URL,
    SUPABASE_DB_CONNECTION_PASSWORD:
      process.env.SUPABASE_DB_CONNECTION_PASSWORD,
    NEXT_PUBLIC_SUPABASE_PASSWORD: process.env.NEXT_PUBLIC_SUPABASE_PASSWORD,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
};

export default nextConfig;
