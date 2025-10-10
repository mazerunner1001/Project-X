import React, { useEffect, useRef, useState } from "react";
import NavbarExplore from '../components/NavbarExplore';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import MovieList from "../components/MovieList";
import Footer from "../components/Footer";
import Ad1 from '../assets/Designer (1).png';
import Ad2 from '../assets/Designer (2).png';
import Ad3 from '../assets/Designer (3).png';


const MovieSection = ({ title, type, Class, style1 = "", style2 = "" }) => {
  const [movies, setMovies] = useState([]);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${Class}/${type}?api_key=${apiKey}&language=en-US`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, [type]);

  return (
    <div>
      <div className="flex translate-y-4 justify-between">
        <h2 className="text-xl text-white font-bold ml-20">{title}</h2>
        <Link to="/movies" className="flex space-x-3 mr-10">
          <span className="text-gray-400">View All</span>
          <svg className="mt-1" fill="white" height="15px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 400.00 400.00" stroke="white" stroke-width="20"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg>
        </Link>
      </div>
      <MovieList type={type} Class={Class} style1={style1} style2={style2} />
    </div>
  );
};

const Advertisement = ({ image = 'https://via.placeholder.com/150', title = 'Title Placeholder', description = 'Description Placeholder' }) => {
  return (
    <div className="relative rounded-md bg-gray-800 w-11/12 h-40 mt-12 mb-6  flex justify-center mx-auto items-center">
      <img
        src={image}
        alt="Advertisement"
        className="absolute w-full h-full object-cover "
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-brightness-50 text-white text-center p-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg">{description}</p>
      </div>
    </div>
  );
};


const ExplorePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
      .then(res => res.json())
      .then(data => setPopularMovies(data.results));
  }, []);



  return (
    <>
      <div className="bg-black overflow-y-hidden">
        <NavbarExplore />
        <div className="poster relative">
          {popularMovies.length > 0 && (
            <Carousel
              showThumbs={false}
              autoPlay={true}
              transitionTime={3}
              infiniteLoop={true}
              showStatus={false}
              useKeyboardArrows={true}
              selectedItem={0}
            >
            {popularMovies && popularMovies.map(movie => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="no-underline text-white"
              >
                <div className="relative h-[650px]">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`}
                    alt={movie.original_title}
                    className="block w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent transition-opacity duration-300 hover:opacity-100" />
                  <div className="absolute top-80 left-0 w-full h-full flex flex-col  items-start px-20 pb-20 ">
                    <div className="text-[50px] font-extrabold text-sky-400 mb-2.5 ">{movie ? movie.original_title : ""}</div>
                    <div className="text-2xl mb-4 flex">
                      {movie ? movie.release_date : ""}
                      <span className="ml-12 flex">
                        {movie ? movie.vote_average : ""}
                        <svg className="mt-1 ml-1" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                          width="22px" height="22px" viewBox="0 0 64 64" enable-background="new 0 0 64 64">
                          <polygon fill="#38bdf8" stroke="#38bdf8" stroke-width="2" stroke-miterlimit="10" points="32,47 12,62 20,38 2,24 24,24 32,1 40,24	62,24 44,38 52,62 " />
                        </svg>
                      </span>
                    </div>
                    <div className="italic text-base mb-1.5 text-left w-1/2">{movie ? movie.overview : ""}</div>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
          )}
          <div className="relative">
            <MovieSection title="Trending Movies and tv" type="trending" Class="movie" style1="overflow-hidden" style2="overflow-x-scroll  space-x-1 overflow-y-none ml-8 pl-9" />
            <Advertisement
              image={Ad1}
              title="Be part of the conversation"
              description="Discuss your favorite films, theories, and reviews with fellow movie enthusiasts. Get movie information like never before, from box office hits to hidden gems"
            />
            <MovieSection title="Popular Movies" type="popular" Class="movie" style1="overflow-hidden" style2="overflow-x-scroll space-x-1 overflow-y-none ml-8 pl-9" />
            <MovieSection title="Popular TV" type="popular" Class="tv" style1="overflow-hidden" style2="overflow-x-scroll space-x-1 overflow-y-none ml-8 pl-9" />
            <Advertisement
              image={Ad2}
              title="Connect with movie buffs"
              description="Join a vibrant community of movie enthusiasts to discuss your favorite films, theories, and reviews. Explore a world of cinematic wonders, from blockbusters to indie treasures"
            />
            <MovieSection title="Top Rated Movies" type="top_rated" Class="movie" style1="overflow-hidden" style2="overflow-x-scroll space-x-1 overflow-y-none ml-8 pl-9" />
            <MovieSection title="Top Rated TV" type="top_rated" Class="tv" style1="overflow-hidden" style2="overflow-x-scroll space-x-1 overflow-y-none ml-8 pl-9" />
            <Advertisement
              image={Ad3}
              title="Dive into the world of cinema"
              description="Engage with fellow movie lovers and share your thoughts on the latest films, theories, and reviews. Dive deep into the world of cinema like never before"
            />
            <MovieSection title="Upcoming Movies" type="upcoming" Class="movie" style1="overflow-hidden" style2="overflow-x-scroll space-x-1 overflow-y-none ml-8 pl-9" />
            <MovieSection title="Airing today" type="airing_today" Class="tv" style1="overflow-hidden" style2="overflow-x-scroll space-x-1 overflow-y-none ml-8 pl-9" />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
