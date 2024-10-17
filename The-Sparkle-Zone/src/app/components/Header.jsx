import Link from "next/link";

export default function Header() {
  return (
    <header className="header bg-gray-800 text-white p-4">
      <nav className="nav flex flex-wrap justify-between items-center">
        <div className="nav-brand text-lg font-bold mb-2 md:mb-0">
          Sparkle Zone
        </div>
        <ul className="nav-list flex flex-wrap space-x-4">
          <li className="nav-item mb-2 md:mb-0">
            <Link href="/" className="nav-link hover:underline">
              Home
            </Link>
          </li>
          <li className="nav-item mb-2 md:mb-0">
            <Link href="/Blog" className="nav-link hover:underline">
              Blog
            </Link>
          </li>
          <li className="nav-item mb-2 md:mb-0">
            <Link href="/About" className="nav-link hover:underline">
              About
            </Link>
          </li>
          <li className="nav-item mb-2 md:mb-0">
            <Link href="/Contacts" className="nav-link hover:underline">
              Contacts
            </Link>
          </li>
          <li className="nav-item mb-2 md:mb-0">
            <Link href="/Pokemon" className="nav-link hover:underline">
              Pokemon
            </Link>
          </li>
          <li className="nav-item mb-2 md:mb-0">
            <Link href="/Counter" className="nav-link hover:underline">
              Counter
            </Link>
          </li>
          <li className="nav-item mb-2 md:mb-0">
            <Link href="/Marvel" className="nav-link hover:underline">
              Marvel
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
