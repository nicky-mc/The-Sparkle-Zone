/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hasatlmjddrwgmaaosen.supabase.co",
        pathname: "/storage/v1/object/public/image_for_url/**", // Use ** to match any file in this path
      },
    ],
  },
};

export default nextConfig; // Use export default for ES module
