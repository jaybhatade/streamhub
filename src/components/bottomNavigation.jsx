import React, { useState, useEffect, useRef } from 'react';
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { MdLocalMovies } from "react-icons/md";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaCrown } from "react-icons/fa"
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [premiumClicks, setPremiumClicks] = useState(0);
    const clickTimerRef = useRef(null);

    const getLinkStyle = (path) => (
        location.pathname === path ? "text-[#269FB6]" : ""
    );

    useEffect(() => {
        if (premiumClicks === 7) {
            navigate('/about');
            setPremiumClicks(0);
        }

        // Reset clicks if no click within 1 second
        clickTimerRef.current = setTimeout(() => {
            setPremiumClicks(0);
        }, 1000);

        return () => {
            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current);
            }
        };
    }, [premiumClicks, navigate]);

    const handlePremiumClick = (e) => {
        e.preventDefault();
        setPremiumClicks(prev => prev + 1);

        if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
        }

        if (premiumClicks === 6) {
            // This will be the 7th click, so we'll handle it in the useEffect
        } else {
            // Normal behavior: navigate to premium page
            navigate('/premium');
        }
    };

    return (
        <div>
            <div id="bottomNav" className="w-full h-fit bg-zinc-900 fixed bottom-0 py-4 rounded-t-lg z-50">
                <div className="flex h-full w-full justify-around items-center">
                    <Link to="/" className={`flex flex-col gap-1 items-center justify-between hover:text-[#269FB6] transition-all duration-200 ease-in-out ${getLinkStyle("/")}`}>
                        <AiFillHome size={25} className={getLinkStyle("/")} />
                        <h3 className="text-xs">Home</h3>
                    </Link>
                    <Link to="/movies" className={`flex flex-col gap-1 items-center justify-between hover:text-[#269FB6] transition-all duration-200 ease-in-out ${getLinkStyle("/movies")}`}>
                        <MdLocalMovies size={25} className={getLinkStyle("/movies")} />
                        <h3 className="text-xs">Movies</h3>
                    </Link>
                    <Link to="/search" className={`flex flex-col gap-1 items-center justify-between hover:text-[#269FB6] transition-all duration-200 ease-in-out ${getLinkStyle("/search")}`}>
                        <FaSearch size={25} className={getLinkStyle("/search")} />
                        <h3 className="text-xs">Search</h3>
                    </Link>
                    <Link to="/series" className={`flex flex-col gap-1 items-center justify-between hover:text-[#269FB6] transition-all duration-200 ease-in-out ${getLinkStyle("/series")}`}>
                        <BiSolidMoviePlay size={25} className={getLinkStyle("/series")} />
                        <h3 className="text-xs">Series</h3>
                    </Link>
                    <Link to="/premium" className={`flex flex-col gap-1 items-center text-yellow-200 justify-between hover:text-[#269FB6] transition-all duration-200 ease-in-out ${getLinkStyle("/premium")}`} onClick={handlePremiumClick}>
                        <FaCrown size={25} className={getLinkStyle("/premium")} /> {/* Replaced FaUser with GiCrown */}
                        <h3 className="text-xs">Premium</h3>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navigation;