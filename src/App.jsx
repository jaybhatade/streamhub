import './App.css';
import React, { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import Loader from './components/Loader';
import { createBrowserRouter, RouterProvider, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Navigation from './components/bottomNavigation';
import Home from './pages/Home';
import PlayerPage from './components/VideoSteaming';
import MoviePage from './pages/MoviePage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/About';
import AuthPage from './Auth/AuthPage';
import Profile from './pages/Profile';
import Jaybhatade from './components/SeriesSteaming';
import SeriesPage from './pages/SeriesPage';
import UserInputForm from './components/form';
import Premium from './pages/Premium';
import PaymentGateway from './pages/Payment';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const Layout = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const isPlayerPage = location.pathname.startsWith('/player/') || location.pathname.startsWith('/series/') || location.pathname.startsWith('/form');

  React.useEffect(() => {
    setProgress(100);
  }, [location]);

  return (
    <div className="w-full h-fit min-h-screen bg-black text-white">
      <main className={isPlayerPage ? '' : 'pb-16'}>
        <LoadingBar
          color='#269FB6'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Outlet />
      </main>
      {!isPlayerPage && <Navigation />}
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/player/:id", element: <PlayerPage /> },
      { path: "/series/:id/:season/:episode", element: <Jaybhatade /> },
      { path: "/profile", element: <Profile /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/movies", element: <MoviePage /> },
      { path: "/series", element: <SeriesPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/form", element: <UserInputForm /> },
      { path: "/premium", element: <Premium /> }
    ],
  },
  {
    path: "/login",
    element: <AuthPage isLogin={true} />
  },
  {
    path: "/payment/:id",
    element: <PaymentGateway isLogin={true} />
  },
  {
    path: "/signup", 
    element: <AuthPage isLogin={false} />
  }
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const simulateAPICall = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load resource:', error);
      }
    };

    simulateAPICall();
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <Loader />
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;