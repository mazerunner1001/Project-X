import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import HomePage from './pages/FeedPage';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import MainLayout from './layouts/MainLayout';
import ExplorePage from './pages/ExplorePage';
import MovieList from './components/MovieList';
import MovieList2 from './components/MovieList2';
import Movie from './pages/MoviePage';
import Footer from './components/Footer';
import NavbarExplore from './components/NavbarExplore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './toastStyles.module.css';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import CastDetail from "../src/pages/CastDetail";
import UpdateProfile from "./pages/UpdateProfile";
import CastPhotos from './pages/CastPhotos';
import AuthProvider from './components/AuthProvider';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<ExplorePage />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='feed' element={<HomePage />} />
      <Route path='popular' element={<><NavbarExplore /><MovieList type="popular" style2="flex-wrap m-auto justify-center space-x-1 mt-4 w-11/12" /><Footer /></>} />
      <Route path='upcoming' element={<><NavbarExplore /><MovieList type="upcoming" style2="flex-wrap m-auto justify-center space-x-1 mt-4 w-11/12"/><Footer /></>} />
      <Route path='top_rated' element={<><NavbarExplore /><MovieList type="top_rated" style2="flex-wrap m-auto justify-center space-x-1 mt-4 w-11/12"/><Footer /></>} />
      <Route path='genre/:genre' element={<><NavbarExplore /><MovieList2/><Footer /></>} />
      <Route path="/:mediaType/:id" element={<Movie />} />
      <Route path="/person/:id" element={<CastDetail />} />
      <Route path="/photos/:id" element={<CastPhotos />} />
      {/* Private Routes */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='profile' element={<ProfilePage />} />
        <Route path='profile/edit' element={<UpdateProfile />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        toastClassName={styles['toast-container']}
        bodyClassName={styles['toast-body']}
        closeButtonClassName={styles['close-button']}
        progressClassName={styles['progress-bar']}
        iconClassName={styles['toast-icon']}
      />
    </AuthProvider>
  );
}

export default App;
