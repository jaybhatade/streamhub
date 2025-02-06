import { useEffect } from 'react';
import Search from '../components/Search'
import HeaderTwo from '../components/HeaderTwo';


function SearchPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div>
      <div className='w-full h-fit min-h-[100dvh]'>
        <HeaderTwo title={"Search Movies"}/>
      <div className=' w-full h-full bg-gradient-to-b from-black via-[#2296ad]/20 to-black text-white justify-center items-start flex'>
      <Search/>
      </div>
    </div>
    </div>
  )
}

export default SearchPage
