import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="hidden sm:flex items-center gap-2 border ring-1 ring-gray-200 rounded-md px-2 py-1 shadow-md">
      <Search className="w-4 h-4 text-gray-500 cursor-pointer" />
      <input
        type="search"
        placeholder="Search"
        className=" outline-0 text-sm"
      />
    </div>
  );
};

export default SearchBar;
