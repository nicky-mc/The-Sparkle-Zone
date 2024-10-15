import React from "react";

export default function Search({ onSearch }) {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search Marvel Characters"
        className="search-input"
        onChange={handleSearchChange}
      />
    </div>
  );
}
