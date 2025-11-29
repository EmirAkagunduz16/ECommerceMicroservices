"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="hidden sm:flex items-center gap-2 border ring-1 ring-gray-200 rounded-md px-2 py-1 shadow-md">
      <Search className="w-4 h-4 text-gray-500 cursor-pointer" />
      <input
        type="search"
        placeholder="Search"
        className=" outline-0 text-sm"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(value);
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
