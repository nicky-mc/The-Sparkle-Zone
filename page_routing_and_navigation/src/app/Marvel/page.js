"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import md5 from "md5";
import Link from "next/link";
import MarvelSearch from "../components/MarvelSearch";
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
  const [filter, setFilter] = useState("all");

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
              ...(filter !== "all" && { nameStartsWith: filter }),
              ...(filter === "all" &&
                searchTerm && { nameStartsWith: searchTerm }),
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
  }, [page, searchTerm, filter]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0); // Scroll to top
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0); // Scroll to top
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    setPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="marvel-container">
      <h1 className="marvel-title">Marvel Characters</h1>
      <MarvelSearch
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
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
