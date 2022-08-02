import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { useEffect } from "react";

const FilterFunctions = ({
  allFunctions,
  setDisplayFunctions,
}) => {
  const [selectedFilter, setFilterName] = useState("Relevance");
  const [searchFunctionName, setSearchFunctionName] = useState("");




  const sort = (filter) => {
    setFilterName(filter);
    let updatedFuncArr = allFunctions;
    if (filter === "Relevance") {
      allFunctions.sort((a, b) =>
        a.stars.size < b.stars.size ? 1 : b.stars.size < a.stars.size ? -1 : 0
      );
      setDisplayFunctions(allFunctions);
      return;
    } else if (filter === "A-Z" || filter === "Z-A") {
      updatedFuncArr = [
        ...allFunctions.sort((f1, f2) => {
          const n1 = f1.name.toUpperCase();
          const n2 = f2.name.toUpperCase();
          if (n1 < n2) {
            return -1;
          }
          if (n1 > n2) {
            return 1;
          }
          return 0;
        }),
      ];
      if (filter === "Z-A") {
        updatedFuncArr = updatedFuncArr.reverse();
      }
    } else if (filter === "Read") {
      updatedFuncArr = allFunctions.filter((func) => func.isRead === true);
    } else if (filter === "Write") {
      updatedFuncArr = allFunctions.filter((func) => func.isRead === false);
    }
    setDisplayFunctions(updatedFuncArr);
  };

  const filterByName = (name) => {
    const cleanedName = name.toUpperCase();
    const updatedFuncArr = allFunctions.filter((func) =>
      func.name.toUpperCase().includes(cleanedName)
    );
    setDisplayFunctions(updatedFuncArr);
    setSearchFunctionName(name);
  };

  return (
    <div className="bar">
      <button className="function-button">
        <BsSearch className="search-icon" />
      </button>
      <input
        className="outer-search"
        placeholder="Search a function name"
        value={searchFunctionName}
        onChange={(e) => filterByName(e.target.value)}
      ></input>

      <select
        value={selectedFilter}
        className="filter-select"
        onChange={(e) => sort(e.target.value)}
      >
        <option value="Relevance">Relevance</option>
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
        <option value="Read">Read</option>
        <option value="Write">Write</option>
      </select>
    </div>
  );
};

export default FilterFunctions;
