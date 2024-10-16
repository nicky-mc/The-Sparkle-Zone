import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to my About Page</h1>
      <p className="text-lg mb-4">I'm a coding nerdy girl in Norfolk</p>
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white">
        <Image
          src="/18A6B43C-FF49-4E7F-A1F9-BB71AEEA7437.jpeg" // Direct path from the public directory
          alt="Profile Photo"
          fill // Use fill prop instead of layout
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes prop
          style={{ objectFit: "cover" }} // Use style prop instead of objectFit
          priority // Add priority prop for LCP
        />
      </div>
    </div>
  );
}
