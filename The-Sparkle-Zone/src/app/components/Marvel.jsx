"use client";

import React from "react";
import Link from "next/link";
import Search from "./MarvelSearch"; // Ensure this path is correct

export default function Marvel({ characters, onSearch, isLoading, error }) {
  return (
    <div className="marvel-container">
      <Search onSearch={onSearch} />
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="marvel-grid">
        {characters.map((character) => (
          <div key={character.id} className="marvel-card">
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
              className="marvel-image"
            />
            <h2 className="marvel-name">{character.name}</h2>
            <p className="marvel-description">
              {character.description || "No description available."}
            </p>
            <Link
              href={`/marvel/${character.id}/page`}
              className="text-blue-500 hover:underline"
            >
              More Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
