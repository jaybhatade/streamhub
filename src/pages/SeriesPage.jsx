import { useEffect } from 'react';
import HeaderTwo from "../components/HeaderTwo";
import { seriesList } from "../MovieData";
import SeriesScroll from '../components/SeriesScroll';

function SeriesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div className="w-full h-fit min-h-screen bg-black text-white pt-20">
      <HeaderTwo title={"Series Section"} />

    <SeriesScroll series={seriesList} startIndex={0} endIndex={10} headingTitle={"Series Collection"}/>
    </div>
  );
}

export default SeriesPage;
