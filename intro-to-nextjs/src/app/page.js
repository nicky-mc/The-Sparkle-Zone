import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Next.js App</h1>
      <Image
        className="rounded-lg shadow-md"
        src="/imposter-got.gif" // Correct path to the image in the public directory
        alt="Imposter GIF"
        width={400}
        height={400}
        priority
      />
      <p className="mt-8 text-lg text-center">
        This is a simple Next.js application. Edit{" "}
        <code className="bg-gray-200 p-1 rounded">src/app/page.js</code> to get
        started.
      </p>
    </div>
  );
}
