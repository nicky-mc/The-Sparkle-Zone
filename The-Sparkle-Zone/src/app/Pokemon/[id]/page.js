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
        <div className="pokemon-detail-image-section">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="pokemon-detail-image"
          />
        </div>
        <div className="pokemon-detail-info-section">
          <h2 className="pokemon-detail-info-title">Basic Information</h2>
          <p className="pokemon-detail-info">
            Type:{" "}
            {pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}
          </p>
          <p className="pokemon-detail-info">Height: {pokemon.height}</p>
          <p className="pokemon-detail-info">Weight: {pokemon.weight}</p>
          <p className="pokemon-detail-info">
            Abilities:{" "}
            {pokemon.abilities
              .map((abilityInfo) => abilityInfo.ability.name)
              .join(", ")}
          </p>
        </div>
        <div className="pokemon-detail-stats">
          <h2 className="pokemon-detail-stats-title">Base Stats</h2>
          <ul>
            {pokemon.stats.map((statInfo) => (
              <li key={statInfo.stat.name}>
                {statInfo.stat.name}: {statInfo.base_stat}
              </li>
            ))}
          </ul>
        </div>
        <div className="pokemon-detail-moves">
          <h2 className="pokemon-detail-moves-title">Moves</h2>
          <ul>
            {pokemon.moves.slice(0, 10).map((moveInfo) => (
              <li key={moveInfo.move.name}>{moveInfo.move.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
