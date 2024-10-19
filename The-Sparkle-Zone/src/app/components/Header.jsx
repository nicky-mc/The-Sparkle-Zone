"use client";

import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="flex justify-between items-center">
        <div className="nav-brand">Sparkle Zone</div>

        {/* Theme toggle button */}
        <button onClick={toggleTheme} className="p-2 text-white">
          {theme === "light" ? (
            <MoonIcon className="h-6 w-6" />
          ) : (
            <SunIcon className="h-6 w-6" />
          )}
        </button>

        {/* Hamburger Menu for mobile */}
        <button className="md:hidden p-2 text-white" onClick={toggleMenu}>
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Desktop menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/Blog" className="nav-link">
            Blog
          </Link>
          <Link href="/Create" className="nav-link">
            Create-A-Blog
          </Link>
          <Link href="/About" className="nav-link">
            About
          </Link>
          <Link href="/Contacts" className="nav-link">
            Contacts
          </Link>
          <Link href="/Pokemon" className="nav-link">
            Pokemon
          </Link>
          <Link href="/Marvel" className="nav-link">
            Marvel
          </Link>
          <Link href="/RicknMorty" className="nav-link">
            Rick and Morty
          </Link>
          <Link href="/Counter" className="nav-link">
            Counter
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col space-y-4 mt-4">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/Blog" className="nav-link">
            Blog
          </Link>
          <Link href="/Create" className="nav-link">
            Create-A-Blog
          </Link>
          <Link href="/About" className="nav-link">
            About
          </Link>
          <Link href="/Contacts" className="nav-link">
            Contacts
          </Link>
          <Link href="/Pokemon" className="nav-link">
            Pokemon
          </Link>
          <Link href="/Marvel" className="nav-link">
            Marvel
          </Link>
          <Link href="/RicknMorty" className="nav-link">
            Rick and Morty
          </Link>
          <Link href="/Counter" className="nav-link">
            Counter
          </Link>
        </nav>
      )}
    </header>
  );
}
