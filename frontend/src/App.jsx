import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SearchForm from "./components/SearchForm";
import axios from "axios";
import SpeciesList from "./components/SpeciesList";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/species`;

/**
 * Main application. Handles loading of Pokemon species data, and displays a SearchForm and SpeciesList.
 */
export default function App() {
  const [species, setSpecies] = useState([]);

  // TODO Load species from backend with useEffect and either axios or fetch()
  useEffect(() => {
    const getAllSpecies = async () => {
      try {
        const res = await axios.get(BASE_URL);
        setSpecies(res.data);
      } catch (error) {
        console.error('Error fetching search results', error);
      }
    };
    getAllSpecies();
  }, []);

  /**
   * Handles a search by resetting the scroll to the top position and modifying the URL.
   *
   * @param {string} textSearch a string if a text search should be performed; otherwise null.
   * @param {string} typeSearch a string if a type search should be performed; otherwise null.
   */
  async function handleSearch(textSearch, typeSearch) {
    const params = {};
    if (textSearch) {
      params.text = textSearch;
    }
    if (typeSearch) {
      params.type = typeSearch;
    }
    try {
      const res = await axios.get(BASE_URL, { params });
      setSpecies(res.data);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  }

  return (
    <div className={styles.container}>
      <h1>My Pokedex</h1>
      <h2>Search</h2>
      <SearchForm onSearch={handleSearch} />
      <h2>Matches (scroll to load more)</h2>
      <SpeciesList species={species} />
    </div>
  );
}
