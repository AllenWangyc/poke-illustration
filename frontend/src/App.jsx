import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SearchForm from "./components/SearchForm";
import axios from "axios";
import SpeciesList from "./components/SpeciesList";
import InfiniteScroll from "react-infinite-scroll-component";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/species`;

/**
 * Main application. Handles loading of Pokemon species data, and displays a SearchForm and SpeciesList.
 */
export default function App() {
  const [species, setSpecies] = useState([]);
  const [page, setPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // TODO Load species from backend with useEffect and either axios or fetch()

  useEffect(() => {
    fetchSpecies(0, resultsPerPage, true);
  }, []);

  const fetchSpecies = async (page, resultsPerPage, reset = false) => {
    try {
      const res = await axios.get(BASE_URL, {
        params: { page, resultsPerPage }
      });
      if (res.data.length < resultsPerPage) {
        setHasMore(false);
      }
      setSpecies(prevSpecies => reset ? res.data : [...prevSpecies, ...res.data]);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSpecies(nextPage, resultsPerPage);
  };

  /**
   * Handles a search by resetting the scroll to the top position and modifying the URL.
   *
   * @param {string} textSearch a string if a text search should be performed; otherwise null.
   * @param {string} typeSearch a string if a type search should be performed; otherwise null.
   */
  const handleSearch = async (textSearch, typeSearch) => {
    const params = { page: 0, resultsPerPage };
    if (textSearch) {
      params.text = textSearch;
    }
    if (typeSearch) {
      params.type = typeSearch;
    }
    try {
      const res = await axios.get(BASE_URL, { params });
      setSpecies(res.data);
      setPage(0); // reset the page to first page
      setHasMore(res.data.length === resultsPerPage);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>My Pokedex</h1>
      <h2>Search</h2>
      <SearchForm onSearch={handleSearch} />
      <h2>Matches (scroll to load more)</h2>
      <InfiniteScroll
        dataLength={species.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <SpeciesList species={species} />
      </InfiniteScroll>
    </div>
  );
}
