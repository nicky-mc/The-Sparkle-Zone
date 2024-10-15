import Link from "next/link";
import "../pokemon.css";

async function fetchPokemonData(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default async function PokemonDetail({ params }) {
  const { id } = params;
  let pokemon;
  let error;

  try {
    pokemon = await fetchPokemonData(id);
  } catch (err) {
    error = err;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pokemon-detail-container">
      <Link href="/Pokemon" className="back-link">
        Back to list
      </Link>
      <h1 className="pokemon-detail-title">{pokemon.name}</h1>
      <div className="pokemon-detail-card">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokemon-detail-image"
        />
        <p className="pokemon-detail-type">
          Type: {pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}
        </p>
        <p className="pokemon-detail-info">Height: {pokemon.height}</p>
        <p className="pokemon-detail-info">Weight: {pokemon.weight}</p>
      </div>
    </div>
  );
}
