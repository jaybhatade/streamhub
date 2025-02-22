import { FaUser } from "react-icons/fa";
import { Link} from "react-router-dom";


function Heading() {
  return (
    <div>
        <div id="header" className="w-full h-fit bg-black p-3 px-4 pl-3 sticky items-center top-0 flex justify-between">
            <img src="/images/MainLogo1.png" className="h-[8vh] md:max-w-[200px] "/>
            <Link to={"/profile"} className="rounded-full p-2 bg-[#269FB6] h-fit">
              <FaUser size={16}/>
            </Link>
        </div>
    </div>
  )
}

export default Heading
