"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import "./pokemon.css";

const LIMIT = 20; // Number of Pokémon to fetch per request

async function fetchPokemonData(offset = 0, filter = "", searchQuery = "") {
  const params = new URLSearchParams({
    limit: LIMIT,
    offset: offset,
  });

  if (filter.startsWith("generation-")) {
    const generation = parseInt(filter.split("-")[1], 10);
    const response = await fetch(
      `https://pokeapi.co/api/v2/generation/${generation}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const pokemonNames = data.pokemon_species.map((species) => species.name);
    params.append("name", pokemonNames.join(","));
  } else if (filter.startsWith("type-")) {
    const type = filter.split("-")[1];
    params.append("type", type);
  }

  if (searchQuery) {
    params.append("name", searchQuery);
  }

  console.log("Fetching Pokémon with params:", params.toString());

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.results;
}

async function fetchPokemonDetails(pokemonList) {
  const CONCURRENT_REQUESTS = 10; // Limit the number of concurrent requests
  const pokemonDetails = [];

  for (let i = 0; i < pokemonList.length; i += CONCURRENT_REQUESTS) {
    const chunk = pokemonList.slice(i, i + CONCURRENT_REQUESTS);
    const chunkDetails = await Promise.all(
      chunk.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch details for ${pokemon.name}: ${res.statusText}`
          );
        }
        const pokemonData = await res.json();
        return pokemonData;
      })
    );
    pokemonDetails.push(...chunkDetails);
  }

  return pokemonDetails;
}

export default function PokemonFetch() {
  const [pokePosts, setPokePosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const offset = (page - 1) * LIMIT;
        const pokemonList = await fetchPokemonData(offset, filter, searchQuery);
        const pokemonDetails = await fetchPokemonDetails(pokemonList);
        setPokePosts(pokemonDetails);
        setFilteredPosts(pokemonDetails);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [page, filter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="pokemon-container">
      <h1 className="pokemon-title">Who do you choose?</h1>
      <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <div className="pokemon-grid">
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/Pokemon/${post.id}`}>
            <div className="pokemon-card">
              <h2 className="pokemon-name">{post.name}</h2>
              <p className="pokemon-type">
                Type:{" "}
                {post.types.map((typeInfo) => typeInfo.type.name).join(", ")}
              </p>
              <img
                src={post.sprites.front_default}
                alt={post.name}
                className="pokemon-image"
              />
            </div>
          </Link>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
