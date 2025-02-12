import { useEffect } from 'react';
import HeaderTwo from "../components/HeaderTwo";
import { seriesList } from "../MovieData";
import SeriesScroll from '../components/SeriesScroll';
import SM from '../components/SM'

function SeriesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div className="w-full h-fit min-h-screen pt-20">
      <HeaderTwo title={"Series Section"} />
      <SM />

    <div className="w-full h-fit min-h-screen bg-gradient-to-b from-black via-[#2296ad]/20 to-black text-white">
    <SeriesScroll series={seriesList} startIndex={0} endIndex={10} headingTitle={"Series Collection"}/>
    <SeriesScroll series={seriesList} startIndex={10} endIndex={20} headingTitle={"Series Collection"}/>
    <SeriesScroll series={seriesList} startIndex={20} endIndex={30} headingTitle={"Series Collection"}/>
    <SeriesScroll series={seriesList} startIndex={30} endIndex={40} headingTitle={"Series Collection"}/>
    <SeriesScroll series={seriesList} startIndex={40} endIndex={50} headingTitle={"Series Collection"}/>
    <SeriesScroll series={seriesList} startIndex={50} endIndex={60} headingTitle={"Series Collection"}/>
    <SeriesScroll series={seriesList} startIndex={60} endIndex={70} headingTitle={"Series Collection"}/>
    <SeriesScroll series={seriesList} startIndex={70} endIndex={80} headingTitle={"Series Collection"}/>

    </div>
    </div>
  );
}

export default SeriesPage;
