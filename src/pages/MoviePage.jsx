import { useEffect } from 'react';
import HeaderTwo from "../components/HeaderTwo";
import ScrollComponent from "../components/ScrollComponent";
import { movieList } from "../MovieData";
import SeriesScroll from '../components/SeriesScroll';
import Mainslider from '../components/mainslider'

function MoviePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div className="w-full h-fit min-h-screen pt-20">
      <HeaderTwo title={"Movies Section"} />
    <Mainslider />
    <div className="w-full h-fit min-h-screen bg-gradient-to-b from-black via-[#2296ad]/20 to-black text-white">
    <ScrollComponent movies={movieList} startIndex={9} endIndex={20} headingTitle={"Marvel Movies"}/>

    <ScrollComponent movies={movieList} startIndex={20} endIndex={35} headingTitle={"Action Movies"}/>

    <ScrollComponent movies={movieList} startIndex={35} endIndex={46} headingTitle={"Bollywood Action Movies"}/>
      <ScrollComponent movies={movieList} startIndex={46} endIndex={56} headingTitle={"Bollywood Horror Movies"} />
      
      <ScrollComponent movies={movieList} startIndex={56} endIndex={67} headingTitle={"Horror Movies"} />
      
    <ScrollComponent movies={movieList} startIndex={67} endIndex={88} headingTitle={"Comedy Collection"}/>
    <ScrollComponent movies={movieList} startIndex={88} endIndex={98} headingTitle={"Comedy Collection"}/>
    </div>
    </div>
  );
}

export default MoviePage;
