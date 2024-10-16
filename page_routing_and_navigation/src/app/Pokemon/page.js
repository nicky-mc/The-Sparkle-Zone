"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head"; // Import Head component
import SearchBar from "../components/SearchBar";
import styles from "./pokemon.css"; // Use CSS module

const CONCURRENT_REQUESTS = 152; // Increased limit for concurrent requests
const RETRY_LIMIT = 3; // Number of retry attempts for failed requests

async function fetchPokemonDataByGeneration(generation) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/generation/${generation}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  const pokemonNames = data.pokemon_species.map((species) => species.name);
  return pokemonNames;
}

async function fetchPokemonDetails(pokemonNames) {
  const pokemonDetails = [];

  for (let i = 0; i < pokemonNames.length; i += CONCURRENT_REQUESTS) {
    const chunk = pokemonNames.slice(i, i + CONCURRENT_REQUESTS);
    const chunkDetails = await Promise.all(
      chunk.map(async (name) => {
        let attempts = 0;
        while (attempts < RETRY_LIMIT) {
          try {
            const res = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${name}`
            );
            if (!res.ok) {
              throw new Error(
                `Failed to fetch details for ${name}: ${res.statusText}`
              );
            }
            const pokemonData = await res.json();
            return pokemonData;
          } catch (error) {
            attempts++;
            console.error(
              `Error fetching details for ${name}: ${error.message}. Attempt ${attempts} of ${RETRY_LIMIT}`
            );
            if (attempts >= RETRY_LIMIT) {
              return null;
            }
          }
        }
      })
    );
    pokemonDetails.push(...chunkDetails.filter((data) => data !== null));
  }

  return pokemonDetails;
}

export default function PokemonFetch() {
  const [pokePosts, setPokePosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generation, setGeneration] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const pokemonNames = await fetchPokemonDataByGeneration(generation);
        const pokemonDetails = await fetchPokemonDetails(pokemonNames);
        setPokePosts(pokemonDetails);
        setFilteredPosts(pokemonDetails);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [generation]);

  const handleGenerationChange = (gen) => {
    setGeneration(gen);
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className={styles.pokemonContainer}>
      <Head>
        <title>Pokémon Explorer</title>
        <meta
          name="description"
          content="Explore Pokémon by generation and find detailed information about each Pokémon."
        />
        <meta
          name="keywords"
          content="Pokémon, Generation, Pokedex, Pokémon Details, Pokémon Types"
        />
        <meta name="author" content="Your Name" />
      </Head>
      <h1 className={styles.pokemonTitle}>Who do you choose?</h1>
      <div className={styles.generationButtons}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
          <button
            key={gen}
            onClick={() => handleGenerationChange(gen)}
            className={`${styles.generationButton} ${
              generation === gen ? styles.active : ""
            }`}
          >
            Generation {gen}
          </button>
        ))}
      </div>
      <SearchBar onSearch={() => {}} onFilterChange={() => {}} />
      <div className={styles.pokemonGrid}>
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/Pokemon/${post.id}`}>
            <div className={styles.pokemonCard}>
              <h2 className={styles.pokemonName}>{post.name}</h2>
              <p className={styles.pokemonType}>
                Type:{" "}
                {post.types.map((typeInfo) => typeInfo.type.name).join(", ")}
              </p>
              <img
                src={post.sprites.front_default}
                alt={post.name}
                className={styles.pokemonImage}
              />
            </div>
          </Link>
        ))}
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
}
