import Image from "next/image";

export default function Contacts() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to my Contacts Page</h1>
      <p className="text-lg mb-4 text-center">
        You can contact me on the following links:
      </p>

      {/* Row of Social Links */}
      <div className="flex space-x-6 justify-center">
        {/* Instagram Link */}
        <a
          href="https://www.instagram.com/cin_azotromselwoc/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
            <Image
              src="/insta.jpeg"
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
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
            <Image
              src="/IMG_3606.jpeg"
              alt="Email Icon"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </a>
      </div>
    </div>
  );
}