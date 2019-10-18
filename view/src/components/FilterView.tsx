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

  const handleSubmit = (callback: any) => {
    if (filterKey !== "" && fieldValue !== "") {
      callback(filterKey, fieldValue);
    }
  };

  const componentHasFilter = (filters: string[]) => {
    if (filters.length > 0) {
      return true;
    }
    return false;
  };

  console.log("properties: " + properties);
  return (
    <div>
      {componentHasFilter(properties) ? (
        <div>
          <h3>Filter</h3>
          <select value={filterKey} onChange={handleDropDownChange}>
            <option key={"default"} value="">
              --Choose field--
            </option>
            {properties.map(prop => (
              <option key={prop} value={prop}>
                {prop}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={fieldValue}
            onChange={handleInputChange}
            placeholder="Select a value..."
          />
          <button onClick={() => handleSubmit(callback)}>Filter</button>
        </div>
      ) : null}
    </div>
  );
};

export default FilterView;
