"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import "./pokemon.css";

async function fetchAllPokemonData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  const totalPokemon = data.count;

  let allPokemon = [];
  let nextUrl = `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`; // Fetch all Pokémon in one request

  while (nextUrl) {
    const response = await fetch(nextUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    allPokemon = allPokemon.concat(data.results);
    nextUrl = data.next; // Update the URL for the next page
  }

  const CONCURRENT_REQUESTS = 10; // Limit the number of concurrent requests
  const pokemonDetails = [];

  for (let i = 0; i < allPokemon.length; i += CONCURRENT_REQUESTS) {
    const chunk = allPokemon.slice(i, i + CONCURRENT_REQUESTS);
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

  // Fetch generation data
  const generationPromises = [];
  for (let i = 1; i <= 9; i++) {
    generationPromises.push(
      fetch(`https://pokeapi.co/api/v2/generation/${i}`).then((res) =>
        res.json()
      )
    );
  }
  const generations = await Promise.all(generationPromises);

  // Map Pokémon to their respective generations
  const generationMap = {};
  generations.forEach((generation, index) => {
    generation.pokemon_species.forEach((species) => {
      generationMap[species.name] = index + 1;
    });
  });

  // Add generation information to Pokémon details
  pokemonDetails.forEach((pokemon) => {
    pokemon.generation = generationMap[pokemon.name];
  });

  return pokemonDetails;
}

export default function PokemonFetch() {
  const [pokePosts, setPokePosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAllPokemonData();
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

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="pokemon-container">
      <h1 className="pokemon-title">Pokemon</h1>
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
    </div>
  );
}
