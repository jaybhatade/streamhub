import { useEffect } from 'react';
import HeaderTwo from "../components/HeaderTwo";
import { seriesList } from "../MovieData";
import SeriesScroll from '../components/SeriesScroll';

function SeriesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div className="w-full h-fit min-h-screen">
      <HeaderTwo title={"Series Section"} />
    <div className="w-full h-fit min-h-screen bg-gradient-to-b from-black via-[#2296ad]/20 to-black text-white pt-20">
    <SeriesScroll series={seriesList} startIndex={0} endIndex={10} headingTitle={"Series Collection"}/>
    </div>
    </div>
  );
}

export default SeriesPage;
