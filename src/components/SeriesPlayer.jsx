import { useState, useEffect } from 'react';
import ScrollComponent from "../components/ScrollComponent";
import { movieList } from "../MovieData";


const SeriesPlayer = ({ series, season, episode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(`${season}-${episode}`);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedEpisode]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!series) {
    return <div className="text-white text-center py-10">Series not found</div>;
  }

  const episodeCount = series.episode;
  const displayedEpisodes = showMore ? episodeCount : Math.min(episodeCount, 20);

  return (
    <div className='w-full h-fit'>
      <div className="bg-black rounded-xl flex flex-col md:flex-row shadow-md border-b-2 pb-6">
        <div className="w-full h-[200px] md:h-[400px] max-w-3xl mx-auto">
          <iframe
            src={`https://vidsrc.xyz/embed/tv/${series.id}/${selectedEpisode}`}
            title={`S${series.season} E${selectedEpisode} ${series.title}}`}
            className="w-full h-full rounded-lg shadow-md"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex flex-col justify-center md:justify-between items-center w-full md:w-[40%]">
          <div className="p-2 pb-4">
            <h2 className="text-2xl font-bold text-white pt-3 md:pt-0 pb-1">{`S${season} ${series.title}`}</h2>
            <div className="relative">
              <p className={`text-gray-300 mt-1 ${isExpanded ? '' : 'line-clamp-3 md:line-clamp-2'}`}>{series.plot}</p>
              {!isExpanded && <div className="absolute bottom-0 right-0 bg-gradient-to-l from-black to-transparent w-full h-6" />}
            </div>
            <button onClick={toggleExpand} className="text-[#1d7283] hover:text-[#1d7283]/80 mt-1 focus:outline-none">
              {isExpanded ? 'Less' : 'More'}
            </button>
          </div>
          <div className='w-full h-fit'>
            <p className='pl-2 text-gray-300'>Genre: {series.genre || "--"}</p>
            <p className='pl-2 text-gray-300'>Released: {series.released || "--"}</p>
            <div className='flex justify-between'>
              <p className='pl-2 text-gray-300'>Language: {series.language || "--"}</p>
              <p className='pr-2 lg:pr-6 text-gray-300'>Runtime: {series.runtime || "--"}</p>
            </div>
          </div>
          <div className='w-full px-2 mt-4'>
            <h3 className='text-white text-lg font-bold'>Episodes</h3>
            <div className='flex flex-wrap gap-4 mt-2 '>
              {Array.from({ length: displayedEpisodes }, (_, i) => i + 1).map((ep) => (
                <button
                  key={ep}
                  className={`w-20 h-10 rounded-lg text-white border ${selectedEpisode === `${season}-${ep}` ? 'bg-[#1d7283]' : 'border-gray-600 hover:bg-gray-700'}`}
                  onClick={() => setSelectedEpisode(`${season}-${ep}`)}
                >
                  {`Ep ${ep}`}
                </button>
              ))}
            </div>
            {episodeCount > 20 && !showMore && (
              <button onClick={() => setShowMore(true)} className="mt-2 text-[#1d7283] hover:text-[#1d7283]/80">
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
      <ScrollComponent movies={movieList} startIndex={9} endIndex={20} headingTitle={"Marvel Movies"} />
      <ScrollComponent movies={movieList} startIndex={20} endIndex={35} headingTitle={"Action Movies"} />
      <ScrollComponent movies={movieList} startIndex={35} endIndex={46} headingTitle={"Bollywood Action Movies"} />
      <ScrollComponent movies={movieList} startIndex={46} endIndex={56} headingTitle={"Bollywood Horror Movies"} />
      <ScrollComponent movies={movieList} startIndex={56} endIndex={67} headingTitle={"Horror Movies"} />
    </div>
  );
};

export default SeriesPlayer;