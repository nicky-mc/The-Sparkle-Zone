"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import "./pokemon.css";

async function fetchPokemonData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      return res.json();
    })
  );
  return pokemonDetails;
}

export default function PokemonFetch() {
  const [pokePosts, setPokePosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchPokemonData();
        setPokePosts(data);
        setFilteredPosts(data);
      } catch (err) {
        setError(err);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (query) => {
    const filtered = pokePosts.filter((post) =>
      post.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="pokemon-container">
      <h1 className="pokemon-title">Pokemon</h1>
      <SearchBar onSearch={handleSearch} />
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
    </div>
  );
}
