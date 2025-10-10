import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetUserProfileQuery } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { data: userProfile, isLoading, error } = useGetUserProfileQuery();

  useEffect(() => {
    if (userProfile) {
      dispatch(setCredentials(userProfile));
    }
  }, [userProfile, dispatch]);

  // Don't render anything while checking authentication on initial load
  // But don't show loading for too long to avoid blocking the app
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Initializing...</p>
        </div>
      </div>
    );
  }

  // If there's an auth error, just continue with the app (user will be redirected to login when needed)
  return children;
};

export default AuthProvider;