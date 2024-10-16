"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import md5 from "md5";
import { useParams } from "next/navigation";
import "../marvel.css";
import Link from "next/link";

const publicKey = "acd8dde3905a52aee2158bcaad534542";
const privateKey = "166565337f589e692c7754078e37348f64e7d169";

export default function CharacterDetail() {
  const params = useParams();
  const id = params.id;
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCharacter = async () => {
      const ts = new Date().getTime();
      const hash = md5(ts + privateKey + publicKey);

      try {
        const response = await axios.get(
          `https://gateway.marvel.com:443/v1/public/characters/${id}`,
          {
            params: {
              apikey: publicKey,
              ts: ts,
              hash: hash,
            },
          }
        );
        setCharacter(response.data.data.results[0]);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (isLoading) return <div className="marvel-loading">Loading...</div>;
  if (error) return <div className="marvel-error">Error: {error.message}</div>;
  if (!character)
    return <div className="marvel-not-found">No character found</div>;

  return (
    <div className="marvel-detail-container">
      <div className="marvel-detail-header">
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
          className="marvel-detail-image"
        />
        <div className="marvel-detail-info">
          <h1 className="marvel-detail-name">{character.name}</h1>
          <p className="marvel-detail-description">
            {character.description || "No description available."}
          </p>
        </div>
      </div>

      <div className="marvel-detail-section">
        <h2 className="marvel-section-title">Comics</h2>
        <div className="marvel-grid">
          {character.comics.items.slice(0, 4).map((comic, index) => (
            <div key={index} className="marvel-comic-item">
              <p>{comic.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="marvel-detail-section">
        <h2 className="marvel-section-title">External Links</h2>
        <div className="marvel-links">
          {character.urls.map((url, index) => (
            <Link key={index} href={url.url} legacyBehavior>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="marvel-link-button"
              >
                {url.type}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
