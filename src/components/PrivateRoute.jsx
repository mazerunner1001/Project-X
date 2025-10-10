import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserProfileQuery } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useEffect } from "react";

import React from 'react'

const PrivateRoute = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { data: profileData, isLoading, error } = useGetUserProfileQuery();

    useEffect(() => {
        if (profileData) {
            dispatch(setCredentials(profileData));
        }
    }, [profileData, dispatch]);

    // Show loading while checking authentication (only if we don't have any user data)
    if (isLoading && !userInfo) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If there's an error (like 401 unauthorized), redirect to login
    if (error) {
        return <Navigate to="/login" replace />;
    }

    // If we have user data from any source, allow access
    if (profileData || userInfo) {
        return <Outlet />;
    }

    // If no user data and not loading, redirect to login
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;
