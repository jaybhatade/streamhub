import { Link } from "react-router-dom";

const SeriesScroll = ({ series, startIndex = 0, endIndex, headingTitle }) => {
  // If endIndex is not provided, use the length of the series array
  const slicedSeries = series.slice(startIndex, endIndex || series.length);

  return (
    <div className="pt-4">
      <div className="text-2xl text-white pl-2">{headingTitle}</div>
      <div
        className="flex overflow-x-auto overflow-y-hidden scrollbar-hide py-2"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {slicedSeries.map((show) => (
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
  );
};

export default SeriesScroll;
