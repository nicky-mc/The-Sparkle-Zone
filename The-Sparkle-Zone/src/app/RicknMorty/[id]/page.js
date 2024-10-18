"use client"; // Mark this as a Client Component

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ricknmorty.css"; // Import the CSS file
const CharacterDetailPage = ({ params }) => {
  const { id } = params; // Access the character ID directly from params
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        setCharacter(response.data);
      } catch (error) {
        console.error("Error fetching character details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharacter(); // Fetch character details only if ID is available
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!character) return <div>No character found.</div>;

  // Dynamic styling based on character status
  const getStatusStyle = () => {
    switch (character.status) {
      case "Alive":
        return { backgroundColor: "#d4edda", color: "#155724" }; // Light green for alive
      case "Dead":
        return { backgroundColor: "#f8d7da", color: "#721c24" }; // Light red for dead
      case "unknown":
        return { backgroundColor: "#fff3cd", color: "#856404" }; // Light yellow for unknown
      default:
        return {}; // Default styling
    }
  };

  return (
    <div className="character-detail" style={getStatusStyle()}>
      <div className="character-info">
        <img
          src={character.image}
          alt={character.name}
          className="character-image"
        />
        <div className="character-text">
          <h1>{character.name}</h1>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Gender: {character.gender}</p>
          <p>Origin: {character.origin.name}</p>
          <p>Location: {character.location.name}</p>
          <h2>Appears in:</h2>
          <ul>
            {character.episode.map((episodeUrl) => (
              <li key={episodeUrl}>
                {episodeUrl.split("/").pop()}{" "}
                {/* Extract episode number from URL */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailPage;
