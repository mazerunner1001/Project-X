import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { useGetUserProfileQuery } from '../slices/usersApiSlice';
import profile from '../assets/profileicon.jpg'

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  // Fetch fresh user profile data from the backend
  const { data: freshUserData, isLoading, error } = useGetUserProfileQuery();

  useEffect(() => {
    // Update Redux store with fresh data when it arrives
    if (freshUserData) {
      dispatch(setCredentials(freshUserData));
    }
  }, [freshUserData, dispatch]);

  // Use fresh data if available, otherwise fall back to Redux store
  const displayUserInfo = freshUserData || userInfo;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Please log in to view your profile</p>
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!displayUserInfo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Profile</h1>
            <Link 
              to="/profile/edit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Cover Photo Area */}
        <div className="relative">
          <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900"></div>
          
          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={displayUserInfo.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserInfo.name || 'User')}&background=3b82f6&color=fff&size=128`}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-900 bg-gray-900"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserInfo.name || 'User')}&background=3b82f6&color=fff&size=128`;
                  }}
                />
              </div>
              
              {/* Name and Email */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">{displayUserInfo.name}</h2>
                <p className="text-gray-300 text-sm sm:text-base">{displayUserInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Bio Section */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">About</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {displayUserInfo.bio && displayUserInfo.bio.trim() !== '' ? displayUserInfo.bio : 'No bio available. Share something about yourself!'}
                </p>
              </div>

              {/* Activity/Stats Section */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Activity</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">0</div>
                    <div className="text-sm text-gray-400">Movies Watched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">0</div>
                    <div className="text-sm text-gray-400">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">0</div>
                    <div className="text-sm text-gray-400">Favorites</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Social */}
            <div className="space-y-6">
              
              {/* Contact Info */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Contact</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  {displayUserInfo.contact && displayUserInfo.contact.trim() !== '' ? displayUserInfo.contact : 'No contact information available'}
                </p>
              </div>

              {/* Social Links */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Social Links</h3>
                </div>
                <div className="space-y-3">
                  {displayUserInfo.socialLinks?.facebook && displayUserInfo.socialLinks.facebook.trim() !== '' ? (
                    <a 
                      href={displayUserInfo.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                      <span className="text-sm">Facebook</span>
                    </a>
                  ) : null}
                  
                  {displayUserInfo.socialLinks?.twitter && displayUserInfo.socialLinks.twitter.trim() !== '' ? (
                    <a 
                      href={displayUserInfo.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                        <span className="text-white text-xs font-bold">𝕏</span>
                      </div>
                      <span className="text-sm">Twitter</span>
                    </a>
                  ) : null}
                  
                  {displayUserInfo.socialLinks?.linkedin && displayUserInfo.socialLinks.linkedin.trim() !== '' ? (
                    <a 
                      href={displayUserInfo.socialLinks.linkedin.startsWith('http') ? displayUserInfo.socialLinks.linkedin : `https://linkedin.com/in/${displayUserInfo.socialLinks.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  ) : null}
                  
                  {(!displayUserInfo.socialLinks?.facebook || displayUserInfo.socialLinks.facebook.trim() === '') && 
                   (!displayUserInfo.socialLinks?.twitter || displayUserInfo.socialLinks.twitter.trim() === '') && 
                   (!displayUserInfo.socialLinks?.linkedin || displayUserInfo.socialLinks.linkedin.trim() === '') && (
                    <p className="text-gray-400 text-sm">No social links added</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
