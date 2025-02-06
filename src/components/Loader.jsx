import { ThreeCircles } from "react-loader-spinner"
function Loader() {
  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
    <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#269FB6"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
    </div>
  )
}

export default Loader
