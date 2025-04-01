import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { movieList, seriesList } from '../MovieData';
import { debounce } from 'lodash-es';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [mixedResults, setMixedResults] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [randomSeries, setRandomSeries] = useState([]);

  useEffect(() => {
    // Get 10 random movies and series on initial load
    const shuffledMovies = [...movieList].sort(() => 0.5 - Math.random());
    const shuffledSeries = [...seriesList].sort(() => 0.5 - Math.random());
    setRandomMovies(shuffledMovies.slice(0, 10));
    setRandomSeries(shuffledSeries.slice(0, 10));
  }, []);

  const filterData = useCallback((searchQuery) => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === '') {
      setFilteredMovies([]);
      setFilteredSeries([]);
      setMixedResults([]);
    } else {
      // Filter movies
      const filteredMovies = movieList.filter((movie) =>
        movie.title.toLowerCase().includes(trimmedQuery)
      );
      setFilteredMovies(filteredMovies);

      // Filter series
      const filteredSeries = seriesList.filter((series) =>
        series.title.toLowerCase().includes(trimmedQuery)
      );
      setFilteredSeries(filteredSeries);

      // Create mixed results
      const mixed = [...filteredMovies.map(m => ({...m, type: 'movie'})), 
                     ...filteredSeries.map(s => ({...s, type: 'series'}))]
        .sort((a, b) => a.title.localeCompare(b.title));
      setMixedResults(mixed);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      filterData(searchQuery);
    }, 300),
    [filterData]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    debouncedSearch(inputValue);
  };

  return (
    <div className="container mx-auto my-4 px-4 pt-16">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a movie or series"
        className="w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#269FB6]"
      />

      {/* Show random content when no search query */}
      {query.trim() === '' && (
        <>
          {/* Random Movies */}
          <div className="pt-4">
            <div className="text-2xl text-white pl-2">Suggested Movies</div>
            <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide py-2"
                 style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {randomMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/player/${movie.id}`}
                  className="flex-shrink-0 p-2 w-[150px] hover:scale-110 transition-all ease-in-out duration-300"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-[200px] rounded-lg shadow-md object-cover"
                  />
                  <div className="pt-1">
                    <h1 className="text-xs text-[#cfcfcf] line-clamp-2 overflow-hidden">{movie.title}</h1>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Random Series */}
          <div className="pt-4">
            <div className="text-2xl text-white pl-2">Suggested Series</div>
            <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide py-2"
                 style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {randomSeries.map((show) => (
                <Link
                  key={show.id}
                  to={`/series/${show.id}/${show.season}/1`}
                  className="flex-shrink-0 p-2 w-[150px] hover:scale-110 transition-all ease-in-out duration-300"
                >
                  <img
                    src={show.poster}
                    alt={show.title}
                    className="w-full h-[200px] rounded-lg shadow-md object-cover"
                  />
                  <div className="pt-1">
                    <h1 className="text-xs text-[#cfcfcf] line-clamp-2 overflow-hidden">{`S${show.season} ${show.title}`}</h1>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Movies Scroll */}
      {filteredMovies.length > 0 && (
        <div className="pt-4">
          <div className="text-2xl text-white pl-2">Movies</div>
          <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide py-2"
               style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/player/${movie.id}`}
                className="flex-shrink-0 p-2 w-[150px] hover:scale-110 transition-all ease-in-out duration-300"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-[200px] rounded-lg shadow-md object-cover"
                />
                <div className="pt-1">
                  <h1 className="text-xs text-[#cfcfcf] line-clamp-2 overflow-hidden">{movie.title}</h1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Series Scroll */}
      {filteredSeries.length > 0 && (
        <div className="pt-4">
          <div className="text-2xl text-white pl-2">Series</div>
          <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide py-2"
               style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {filteredSeries.map((show) => (
              <Link
                key={show.id}
                to={`/series/${show.id}/${show.season}/1`}
                className="flex-shrink-0 p-2 w-[150px] hover:scale-110 transition-all ease-in-out duration-300"
              >
                <img
                  src={show.poster}
                  alt={show.title}
                  className="w-full h-[200px] rounded-lg shadow-md object-cover"
                />
                <div className="pt-1">
                  <h1 className="text-xs text-[#cfcfcf] line-clamp-2 overflow-hidden">{`S${show.season} ${show.title}`}</h1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mixed Results Grid */}
      {mixedResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl text-white pl-2 mb-4">All Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {mixedResults.map((item) => (
              <Link
                key={item.id}
                to={item.type === 'movie' ? `/player/${item.id}` : `/series/${item.id}/${item.season}/1`}
                className="hover:scale-110 transition-all ease-in-out duration-300"
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-[200px] rounded-lg shadow-md object-cover"
                />
                <div className="pt-1">
                  <h1 className="text-xs text-[#cfcfcf] line-clamp-2 overflow-hidden">
                    {item.type === 'series' ? `S${item.season} ${item.title}` : item.title}
                  </h1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Display message if no results */}
      {query.trim() !== '' && filteredMovies.length === 0 && filteredSeries.length === 0 && (
        <p className="text-white text-center">No results found.</p>
      )}
    </div>
  );
};

export default MovieSearch;