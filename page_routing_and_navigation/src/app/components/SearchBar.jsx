import { useState } from "react";

export default function SearchBar({ onSearch, onFilterChange }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    onFilterChange(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a Pokémon..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      <select
        value={filter}
        onChange={handleFilterChange}
        className="filter-select"
      >
        <option value="">All</option>
        <option value="generation-1">Generation 1</option>
        <option value="generation-2">Generation 2</option>
        <option value="generation-3">Generation 3</option>
        <option value="generation-4">Generation 4</option>
        <option value="generation-5">Generation 5</option>
        <option value="generation-6">Generation 6</option>
        <option value="generation-7">Generation 7</option>
        <option value="generation-8">Generation 8</option>
        <option value="generation-9">Generation 9</option>
        <option value="type-grass">Grass Type</option>
        <option value="type-fire">Fire Type</option>
        <option value="type-water">Water Type</option>
        <option value="type-electric">Electric Type</option>
        <option value="type-ice">Ice Type</option>
        <option value="type-fighting">Fighting Type</option>
        <option value="type-poison">Poison Type</option>
        <option value="type-ground">Ground Type</option>
        <option value="type-flying">Flying Type</option>
        <option value="type-psychic">Psychic Type</option>
        <option value="type-bug">Bug Type</option>
        <option value="type-rock">Rock Type</option>
        <option value="type-ghost">Ghost Type</option>
        <option value="type-dark">Dark Type</option>
        <option value="type-dragon">Dragon Type</option>
        <option value="type-steel">Steel Type</option>
        <option value="type-fairy">Fairy Type</option>
      </select>
    </div>
  );
}
