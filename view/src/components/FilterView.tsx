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
            {properties.map(prop => (
              <option key={prop} value={prop}>
                {prop}
              </option>
            ))}
          </select>
          <input type="text" value={fieldValue} onChange={handleInputChange} />
          <button onClick={() => callback(filterKey, fieldValue)}>
            Filter
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FilterView;
