"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import md5 from "md5";
import Link from "next/link";
import "./marvel.css";

const publicKey = "acd8dde3905a52aee2158bcaad534542";
const privateKey = "166565337f589e692c7754078e37348f64e7d169";

export default function MarvelPage() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCharacters = async () => {
      const ts = new Date().getTime();
      const hash = md5(ts + privateKey + publicKey);
      const limit = 20;
      const offset = (page - 1) * limit;

      try {
        const response = await axios.get(
          `https://gateway.marvel.com:443/v1/public/characters`,
          {
            params: {
              apikey: publicKey,
              ts: ts,
              hash: hash,
              limit: limit,
              offset: offset,
              nameStartsWith: searchTerm || undefined,
            },
          }
        );
        setCharacters(response.data.data.results);
        setFilteredCharacters(response.data.data.results);
        setTotalPages(Math.ceil(response.data.data.total / limit));
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [page, searchTerm]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    // The API will handle the filtering based on the searchTerm
  };

  const handleFilterChange = (e) => {
    const filterValue = e.target.value.toLowerCase();
    if (filterValue === "all") {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter((character) =>
        character.name.toLowerCase().startsWith(filterValue)
      );
      setFilteredCharacters(filtered);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="marvel-container">
      <h1 className="marvel-title">Marvel Characters</h1>
      <form onSubmit={handleSearch} className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search characters..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>
      <select onChange={handleFilterChange} className="filter-select">
        <option value="all">All Characters</option>
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
        <option value="e">E</option>
        <option value="f">F</option>
        <option value="g">G</option>
        <option value="h">H</option>
        <option value="i">I</option>
        <option value="j">J</option>
        <option value="k">K</option>
        <option value="l">L</option>
        <option value="m">M</option>
        <option value="n">N</option>
        <option value="o">O</option>
        <option value="p">P</option>
        <option value="q">Q</option>
        <option value="r">R</option>
        <option value="s">S</option>
        <option value="t">T</option>
        <option value="u">U</option>
        <option value="v">V</option>
        <option value="w">W</option>
        <option value="x">X</option>
        <option value="y">Y</option>
        <option value="z">Z</option>
      </select>
      <div className="marvel-grid">
        {filteredCharacters.map((character) => (
          <div key={character.id} className="marvel-card">
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
              className="marvel-image"
            />
            <h3 className="marvel-name">{character.name}</h3>
            <Link
              href={`/Marvel/${character.id}`}
              className="text-blue-500 hover:underline"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>

        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
