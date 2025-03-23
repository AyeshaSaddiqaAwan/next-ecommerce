"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .search-container {
        display: flex;
        align-items: center;
        gap: 0px;
        flex-grow: 1;
        max-width: 500px;
        border: 1px solid #2c7cf1;
        border-radius: 4px;
      }

      .search-container input {
        padding: 5px;
        flex-grow: 1;
        border: 1px solid #2c7cf1;
        border-radius: 3px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }

      .search-container select {
        padding: 5px;
        border: 1px solid #2c7cf1;
        border-radius: 5px;
      }

      .search-container button {
        padding: 6px 15px;
        background: #2c7cf1;
        color: white;
        border: none;
        border-radius: 2px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      router.push(`/list?name=${query}&category=${category}`);
    }
  };

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <input
        type="text"
        name="name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>All Categories</option>
        <option>Electronics</option>
        <option>Fashion</option>
        <option>Home & Kitchen</option>
        <option>Sports</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
