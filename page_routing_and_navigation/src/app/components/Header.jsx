import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <div className="text-lg font-bold">Sparkle Zone</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/About" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/Contacts" className="hover:underline">
              Contacts
            </Link>
          </li>
          <li>
            <Link href="/posts/1" className="hover:underline">
              Post 1
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
