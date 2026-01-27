import React from "react";

const Filter = ({ filter, onFilterChange }) => {
  return (
    <div>
      search for a country: <input value={filter} onChange={onFilterChange} />
    </div>
  );
};

export default Filter;
