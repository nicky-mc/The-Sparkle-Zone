import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <header className="mb-8">
        <Image
          src="/fail.jpeg" // Path to your image in the public folder
          alt="Error Image"
          width={300} // Adjust the width as needed
          height={300} // Adjust the height as needed
          className="rounded-lg" // Optional: Add some styling to the image
        />
      </header>
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-lg text-center max-w-md">
          We're sorry, but the page you were looking for doesn't exist. <br />{" "}
          Maybe next time you'll roll a 20. Sorry!
        </p>
        <div className="flex gap-4 mt-4">
          <a
            className="rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2"
            href="/"
          >
            Go to Home
          </a>
        </div>
      </main>
      <footer className="mt-8">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Mortoza-Colwes All rights reserved.
        </p>
      </footer>
    </div>
  );
}
