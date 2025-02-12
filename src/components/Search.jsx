import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { movieList, seriesList } from '../MovieData';
import { debounce } from 'lodash-es';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);

  const filterData = useCallback((searchQuery) => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === '') {
      setFilteredMovies([]);
      setFilteredSeries([]);
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

      {/* Display Movies */}
      {filteredMovies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {filteredMovies.map((movie) => (
              <Link
                to={`/player/${movie.id}`}
                key={movie.id}
                className="block"
              >
                <div className="rounded-lg shadow-md overflow-hidden h-full hover:scale-105 duration-300 ease-in-out transition-all">
                  <div className="p-2">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-56 md:h-40 lg:h-56 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-center line-clamp-2">{movie.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Display Series */}
      {filteredSeries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {filteredSeries.map((show) => (
              <Link
                key={show.id}
                to={`/series/${show.id}/${show.season}/1`} // Defaulting to season 1, episode 1
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

      {/* Display message if no results */}
      {query.trim() !== '' && filteredMovies.length === 0 && filteredSeries.length === 0 && (
        <p className="text-white text-center">No results found.</p>
      )}
    </div>
  );
};

export default MovieSearch;