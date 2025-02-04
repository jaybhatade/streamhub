import { useParams, Link } from 'react-router-dom';
import SeriesPlayer from './SeriesPlayer';
import { seriesList } from '../MovieData';
import HeaderTwo from '../components/HeaderTwo';

const Jaybhatade = () => {
  const { id, season, episode } = useParams();

  console.log('URL ID:', id);
  console.log('Season:', season);
  console.log('Episode:', episode);
  console.log('Series List:', seriesList);

  const series = seriesList.find(series => series.id === id);

  if (!series) {
    return (
      <div className="p-4">
        <Link to="/" className="text-red-600 hover:underline mb-4 inline-block">&larr; Back to Series</Link>
        <h2 className="text-xl font-bold mb-4">Series not found</h2>
        <p>Debug Information:</p>
        <ul className="list-disc pl-5">
          <li>URL ID: {id}</li>
          <li>Number of series in list: {seriesList.length}</li>
          <li>Series IDs in list: {seriesList.map(s => s.id).join(', ')}</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="">
      <HeaderTwo title={"Series"} />
      <div className="w-full h-fit pt-20 ">
        <SeriesPlayer series={series} season={parseInt(season, 10)} episode={parseInt(episode, 10)} />
      </div>
    </div>
  );
};

export default Jaybhatade;
