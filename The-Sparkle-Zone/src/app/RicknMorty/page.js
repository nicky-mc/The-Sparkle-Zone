"use client"; // Mark this as a Client Component

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import "./ricknmorty.css"; // Import the CSS file

const CharacterListPage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchCharacters();
  }, []); // Fetch all characters on initial load

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character?name=${query}`
      );
      setCharacters(response.data.results || []); // Set results or an empty array if no results
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value); // Update query state with search input
  };

  const handleSearchClick = () => {
    setLoading(true); // Set loading to true while fetching
    fetchCharacters(); // Fetch characters based on the current query
  };

  if (loading) return <div>Loading characters...</div>;

  return (
    <div className="character-list">
      <h1>Rick and Morty Characters</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search characters..."
          value={query}
          onChange={handleSearchChange} // Update the query state on input change
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          Search
        </button>{" "}
        {/* Search button */}
      </div>
      <div className="character-grid">
        {characters.length > 0 ? (
          characters.map((character) => (
            <div key={character.id} className="character-card">
              <Link href={`/RicknMorty/${character.id}`}>
                <img
                  src={character.image}
                  alt={character.name}
                  className="character-image"
                />
                <h2>{character.name}</h2>
                <p>Status: {character.status}</p>
                <p>Species: {character.species}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No characters found.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterListPage;
