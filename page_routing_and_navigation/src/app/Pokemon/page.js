"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import "./pokemon.css";

const LIMIT = 20; // Number of Pokémon to fetch per request

async function fetchPokemonData(offset = 0) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
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
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const pokemonList = await fetchPokemonData(offset);
        const pokemonDetails = await fetchPokemonDetails(pokemonList);
        setPokePosts((prevPosts) => [...prevPosts, ...pokemonDetails]);
        setFilteredPosts((prevPosts) => [...prevPosts, ...pokemonDetails]);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [offset]);

  const handleSearch = (query) => {
    const filtered = pokePosts.filter((post) =>
      post.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleFilterChange = (filter) => {
    let filtered = pokePosts;
    if (filter.startsWith("generation-")) {
      const generation = parseInt(filter.split("-")[1], 10);
      filtered = pokePosts.filter((post) => post.generation === generation);
    } else if (filter.startsWith("type-")) {
      const type = filter.split("-")[1];
      filtered = pokePosts.filter((post) =>
        post.types.some((typeInfo) => typeInfo.type.name === type)
      );
    }
    setFilteredPosts(filtered);
  };

  const loadMorePokemon = () => {
    setOffset((prevOffset) => prevOffset + LIMIT);
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="pokemon-container">
      <h1 className="pokemon-title">Who do you Ch</h1>
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
      {!loading && (
        <button onClick={loadMorePokemon} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
}
