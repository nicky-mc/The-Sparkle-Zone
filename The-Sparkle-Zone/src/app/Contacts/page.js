import Image from "next/image";

export default function Contacts() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to my Contacts Page</h1>
      <p className="text-lg mb-4">
        You can contact me on Instagram @cinazotromselwoc
      </p>
      <a
        href="https://www.instagram.com/cin_azotromselwoc/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
          <Image
            src="/insta.jpeg" // Direct path from the public directory
            alt="Instagram Logo"
            fill // Use fill prop instead of layout
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes prop
            style={{ objectFit: "contain" }} // Use style prop instead of objectFit
            priority // Add priority prop for LCP
          />
        </div>
      </a>
      <p className="text-lg mt-4">
        Or email me at{" "}
        <a href="mailto:d.mortozacowles@gmail.com" className="underline">
          d.mortozacowles@gmail.com
        </a>
      </p>
    </div>
  );
}
