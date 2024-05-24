import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./SearchForm.module.css";

const URL = `${import.meta.env.VITE_API_BASE_URL}/types`;

/**
 * A search form allowing users to specify a text-search and type-search parameter. On submitting the
 * form, the onSearch event function will be called with these parameters (supplying null if the parameters
 * are empty strings).
 *
 * Loads the valid Pokemon types from the backend.
 */
export default function SearchForm({ onSearch }) {
  const [textSearch, setTextSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get(URL).then((response) => setTypes(response.data));
  }, []);

  /**
   * Handles form submission by calling onSearch with the textSearch and typeSearch values, unless they are
   * empty strings in which case null will be used instead.
   */
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(textSearch.length > 0 ? textSearch : null, typeSearch.length > 0 ? typeSearch : null);
  }

  return (
    <form onSubmit={handleSubmit} className={styles['form-container']}>
      <label htmlFor="search">Text search:</label>
      <input
        id="search"
        type="text"
        value={textSearch}
        onChange={(e) => setTextSearch(e.target.value)}
        placeholder="Search for Pokemon names or Pokedex text"
      />
      <label htmlFor="types">Type search:</label>
      <select id="types" value={typeSearch} onChange={(e) => setTypeSearch(e.target.value)}>
        <option value={""}>Any</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
