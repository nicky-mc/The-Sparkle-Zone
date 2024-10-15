import React, { useState } from "react";

export default function MarvelSearch({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    onFilterChange(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search characters..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <select onChange={handleFilterChange} className="filter-select">
        <option value="all">All Characters</option>
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
        <option value="e">E</option>
        <option value="f">F</option>
        <option value="g">G</option>
        <option value="h">H</option>
        <option value="i">I</option>
        <option value="j">J</option>
        <option value="k">K</option>
        <option value="l">L</option>
        <option value="m">M</option>
        <option value="n">N</option>
        <option value="o">O</option>
        <option value="p">P</option>
        <option value="q">Q</option>
        <option value="r">R</option>
        <option value="s">S</option>
        <option value="t">T</option>
        <option value="u">U</option>
        <option value="v">V</option>
        <option value="w">W</option>
        <option value="x">X</option>
        <option value="y">Y</option>
        <option value="z">Z</option>
      </select>
    </div>
  );
}
