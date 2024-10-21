import Image from "next/image";

export default function Contacts() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to my Contacts Page</h1>
      <p className="text-lg mb-4">
        You can contact me on Instagram @cinazotromselwoc
      </p>
      
      {/* Instagram Link */}
      <a
        href="https://www.instagram.com/cin_azotromselwoc/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
          <Image
            src="/insta.jpeg" // Direct path from the public directory
            alt="Instagram Logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </a>

      {/* LinkedIn Link */}
      <a
        href="https://uk.linkedin.com/in/dominique-mortoza-cowles"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4"
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
          <Image
            src="/linkedin.jpeg"
            alt="LinkedIn Logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </a>

      {/* GitHub Link */}
      <a
        href="https://github.com/nicky-mc"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4"
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
          <Image
            src="/github.jpeg"
            alt="GitHub Logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </a>

      {/* Email Link with Letter Icon */}
      <a
        href="mailto:d.mortozacowles@gmail.com"
        className="mt-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
          <Image
            src="/IMG_3606.jpeg" // Ensure the filename matches exactly
            alt="Email Icon"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </a>
    </div>
  );
}