import React from "react";

export default function SearchBar({ onSearch, onFilterChange }) {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    onFilterChange(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="search-input"
          onChange={handleSearchChange}
        />
        <button className="search-button">Search</button>
        <select className="filter-select" onChange={handleFilterChange}>
          <option value="">All Generations</option>
          <option value="generation-1">Generation 1</option>
          <option value="generation-2">Generation 2</option>
          <option value="generation-3">Generation 3</option>
          <option value="generation-4">Generation 4</option>
          <option value="generation-5">Generation 5</option>
          <option value="generation-6">Generation 6</option>
          <option value="generation-7">Generation 7</option>
          <option value="generation-8">Generation 8</option>
          <option value="generation-9">Generation 9</option>
        </select>
      </div>
    </div>
  );
}
