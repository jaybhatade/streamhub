import { useEffect } from 'react';
import Heading from '../components/Header'
import Mainslider from "../components/mainslider";
import ScrollComponent from "../components/ScrollComponent";
import { movieList} from '../MovieData';
import RandomScroll from '../components/RandomScroll'



function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div className=' '>
      <header>
        <Heading/>
      </header>
      

      <Mainslider />
    <div className='bg-gradient-to-b from-black via-[#2296ad]/20 to-black'>
    <ScrollComponent movies={movieList} startIndex={35} endIndex={47} headingTitle={"Bollywood Action Movies"}/>

      <ScrollComponent movies={movieList} startIndex={67} endIndex={88} headingTitle={"Comedy Collection"}/>
      <RandomScroll movies={movieList} count={15} headingTitle={"Recommended For You"}/>

      <ScrollComponent movies={movieList} startIndex={20} endIndex={35} headingTitle={"Action Movies"} />
      
      <ScrollComponent movies={movieList} startIndex={46} endIndex={56} headingTitle={"Bollywood Horror Movies"} />
    </div>
    </div>
  );
}

export default Home;
