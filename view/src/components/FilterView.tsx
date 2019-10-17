import React, { useState } from "react";

const FilterView = ({
  properties,
  callback
}: {
  properties: string[];
  callback: any;
}) => {
  const [filterKey, setFilterKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleDropDownChange = (event: any) => {
    setFilterKey(event.target.value);
    console.log("FilterKey: " + filterKey);
  };

  const handleInputChange = (event: any) => {
    setFieldValue(event.target.value);
  };

  console.log("properties: " + properties);
  return (
    <div>
      <label>
        Select a property to filter on:{" "}
        <select value={filterKey} onChange={handleDropDownChange}>
          {properties.map(prop => (
            <option key={prop} value={prop}>
              {prop}
            </option>
          ))}
        </select>
      </label>
      <input type="text" value={fieldValue} onChange={handleInputChange} />
      <button onClick={() => callback(filterKey, fieldValue)}>Filter</button>
    </div>
  );
};

export default FilterView;
