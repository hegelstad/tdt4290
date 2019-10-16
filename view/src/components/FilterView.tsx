import React, {useState} from "react";
import { initialize, followBranch } from "core";
//import styled from "styled-components";


/*
const FilterChecklist = ({properties, callback}: {properties: string[], callback: any}) => {
  const [checked, setChecked] = useState<{[prop: string]: boolean}>({});
  const [value, setValue] = useState("");

  return (
    <div>{
      properties.map(prop => (
        <input key={prop} type="checkbox" checked={checked[prop] || false} onChange={e => setChecked({...checked, [prop]: e.target.checked})} />
      ))
    }
    <input type="text" value={value} onChange={e => setValue(e.target.value)} />
    <button onClick={() => callback(Object.keys(checked).filter(key => checked[key]), value)}>Filter</button>
    </div>
  )
}*/

const FilterView = (props: FilterProps) =>{
/*
  interface checkedKeyState{
    key: string;
    checked: boolean;
  }*/

   // const [keys, setKeys] = useState<string[]>([]);
    const [keys, setKeys] =useState<Map<string, boolean>>(new Map());
    const {config} = props;

    console.log("Filter view: ")
    console.log(config);

   const test_query = async () => {
    console.log("Create base query object:");
    let query = await initialize(config);
    console.log(query);

    console.log("Select all Departments:");
    query = await followBranch(query, { type: "label", value: "Department" });
    console.log(query);

    console.log("Follow all Belongs To relations:");
    query = await followBranch(query, {
      type: "edge",
      value: "Belongs To",
      direction: "in"
    });
    console.log(query);
    
    console.log("Show properties:");
    console.log(query.properties);
    query.properties.forEach(prop => {
      console.log(prop);
    });
    return(query.properties);
  }

  const properties = test_query();

    const FilterNameList = (props: any) => {
      const names = props.filters;
      const filterList = names.map((name: String) =>
      <li><button>{name}</button></li>
      );
      return (
        <ul>{filterList}</ul>
      );
    }






    /*NOT IN USE

    const FilterKeyList = (props: any) => {
      
      const keysPromise = props.keys as Promise<string[]>;
      keysPromise.then(keys => {
        setKeys(keys);
      })
      
      
      const keyList = keys.map((key: any) =>
      <li>{key}</li>);
      return(
        <ul>{keyList}</ul>
      );
    }
*//*
    const handleInputChange(props: any) =>{
      
    };*/
/*
    const FilterKeyList2 = (props: any) => {
      const keysPromise = props.keys as Promise<string[]>;
      let checked = false;
      let checkedState: checkedKeyState;
      let checkedStateList: checkedKeyState[];
      keysPromise.then(keys => {
        keys.map((key: any) =>
        checkedState = {
          "key" : key,
          "checked": checked
        },
        checkedStateList.push(checkedState)
        );
        setKeys2(checkedStateList);
        })
        const keyList = keys2.map((checkedState: any) =>{
          <label>
            <input
          name={checkedState.key}
          type="checkbox"
          checked={checkedState.checked}
          onChange={handleInputChange(checkedState)}
          /></label>
      });*/



    
/*
      const CreateKeys2 =  (props: any) =>{
        const checked = false;

        const keysPromise = props.keys as Promise<string[]>;
        const checkedKeys = new Map<string,boolean>();
        keysPromise.then(keys => {
          keys.map((key: string) =>
          checkedKeys.set(key, checked)
          )
          
        })
        setKeys2(checkedKeys);
        console.log("Sets keys.      Keys: " + keys2);
      };

      CreateKeys2(properties);
*/

    
      
      const FilterKeyList = (props:any) => {

        const checked = false;

        const keysPromise = props.keys as Promise<string[]>;
        const checkedKeys = new Map<string,boolean>();
        keysPromise.then(keys => {
          keys.map((key: string) =>
          checkedKeys.set(key, checked)
          )
          
        })
        setKeys(checkedKeys);
        return(
          <form>{keyList}</form>
          );
        }

        const keyList = () =>{
          return Object.values(keys).map(keyElement =>{
            return (
              <label>
                <input
                  name={keyElement.key}
                  type="checkbox"
                  checked={keyElement.checked}
                  /*onChange={handleInputChange()}*/
                />
              </label>
            )
          })
        };
/*
        const mapCategories = () => {
          return Object.values(categories).map(category => {
            let { categoryID, categoryName, questions } = category;
            return (
              <Category
                key={categoryID}
                categoryName={categoryName}
                questions={questions}
                obligatoryIDs={obligatoryIDs}
                ratingQuestionAnswers={ratingQuestionAnswers}
                textQuestionAnswers={textQuestionAnswers}
                getText={getText}
                getRating={getRating}
              />
            );
          });
        };
*/

        /*
        const keyElement = (checked:boolean, key:string) =>{
          <label>
              <input
            name={key}
            type="checkbox"
            checked={checked}*/
            /*onChange={handleInputChange()}*/
            /*/></label>
          };*/

        /* NOT IN USE
          const keyList = keys2.map((checkedState: any) =>{
            <label>
              <input
            name={checkedState.key}
            type="checkbox"
            checked={checkedState.checked}
            onChange={handleInputChange(checkedState)}
            /></label>
        });

      const keyList = keys.map((key: any) =>
      <label>
        <input
        name={key}
        type="checkbox"
        checked={keys2[key]}
        onChange={setKeys2(key)}
        >
        </input>
      </label>);
    }

    <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        */
    
    const filterNames = ["Has", "Has key", "Has value", "Has ID"];

    return (
        <div>
            <FilterNameList filters={filterNames} />
            <FilterKeyList keys={properties}/>
        </div>
    );
    
    
}

export default FilterView;