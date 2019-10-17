import React, { useState } from "react";
//import { initialize, followBranch } from "core";
//import styled from "styled-components";
//import { QueryType } from "core/dist/types";

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

/*const FilterView = ({properties, callback}: {properties: string[], callback: any}) => {
  const [checked, setChecked] = useState<{[prop: string]: boolean}>({});
  const [value, setValue] = useState("");
  
  
  
  console.log("properties: " + properties);
  return (
    <div>{
      properties.map(prop  => (
        <label key={prop}>
          <input key={prop || ""} type="checkbox" name={prop} checked={checked[prop] || false} onChange={e => setChecked({...checked, [prop]: e.target.checked})} />
          {prop}
          </label>
        ))
      
    }
    <input type="text" value={value} onChange={e => setValue(e.target.value)} />
    <button onClick={() => callback(Object.keys(checked).filter(key => checked[key]), value)}>Filter</button>
    </div>
  )
}*/
export default FilterView;
