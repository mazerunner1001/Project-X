import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateUserMutation, useGetUserProfileQuery } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';

const ProfileScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bio, setBio] = useState('');
    const [contact, setContact] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [socialLinks, setSocialLinks] = useState({ facebook: '', twitter: '', linkedin: '' });
    const [activeTab, setActiveTab] = useState('profile');

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const [updateProfile, { isLoading }] = useUpdateUserMutation();
    
    // Fetch fresh user profile data from the backend
    const { data: freshUserData, isLoading: profileLoading, error: profileError } = useGetUserProfileQuery();

    useEffect(() => {
        // Update Redux store with fresh data when it arrives
        if (freshUserData) {
            dispatch(setCredentials(freshUserData));
        }
    }, [freshUserData, dispatch]);

    // Use fresh data if available, otherwise fall back to Redux store
    const displayUserInfo = freshUserData || userInfo;

    useEffect(() => {
        if (displayUserInfo) {
            setName(displayUserInfo.name || '');
            setEmail(displayUserInfo.email || '');
            setBio(displayUserInfo.bio || '');
            setContact(displayUserInfo.contact || '');
            setSocialLinks(displayUserInfo.socialLinks || { facebook: '', twitter: '', linkedin: '' });
            setProfilePicture(displayUserInfo.profilePicture || null);
        }
    }, [displayUserInfo]);

    // Show loading state while fetching user data
    if (profileLoading || !displayUserInfo) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading profile settings...</p>
                </div>
            </div>
        );
    }

    // Show error state if user data can't be loaded
    if (profileError) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Unable to load profile settings</p>
                    <Link 
                        to="/profile" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Back to Profile
                    </Link>
                </div>
            </div>
        );
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await updateProfile({
                    _id: displayUserInfo._id,
                    name,
                    email,
                    password,
                    bio,
                    contact,
                    socialLinks,
                    profilePicture,
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 2MB for better performance)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file (JPG, PNG, GIF)');
                return;
            }

            const reader = new FileReader();
            reader.onloadstart = () => {
                toast.info('Processing image...');
            };
            reader.onloadend = () => {
                // Store base64 string
                setProfilePicture(reader.result);
                toast.success('Image uploaded successfully');
            };
            reader.onerror = () => {
                toast.error('Error reading the image file');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSocialLinksChange = (e) => {
        const { name, value } = e.target;
        setSocialLinks((prevLinks) => ({ ...prevLinks, [name]: value }));
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: '👤' },
        { id: 'account', name: 'Account', icon: '⚙️' },
        { id: 'social', name: 'Social', icon: '🔗' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-black border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <h1 className="text-xl font-bold">Settings</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        <span className="font-medium">{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <form onSubmit={submitHandler}>
                            
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <span className="text-2xl">👤</span>
                                        <h2 className="text-xl font-semibold">Profile Information</h2>
                                    </div>
                                    
                                    {/* Profile Picture Section */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-300 mb-4">Profile Picture</label>
                                        <div className="flex items-center space-x-6">
                                            <div className="relative">
                                                <img
                                                    src={profilePicture || displayUserInfo.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserInfo.name || 'User')}&background=3b82f6&color=fff&size=80`}
                                                    alt="Profile"
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserInfo.name || 'User')}&background=3b82f6&color=fff&size=80`;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="profilePicture"
                                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                                                >
                                                    Change Photo
                                                </label>
                                                <input
                                                    type="file"
                                                    id="profilePicture"
                                                    className="hidden"
                                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                                    onChange={handleProfilePictureChange}
                                                />
                                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 2MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name and Bio */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-2">
                                                Contact Information
                                            </label>
                                            <input
                                                type="text"
                                                id="contact"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                placeholder="Phone number or other contact"
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white resize-none"
                                            placeholder="Tell us about yourself..."
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Write a short description about yourself</p>
                                    </div>
                                </div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <span className="text-2xl">⚙️</span>
                                        <h2 className="text-xl font-semibold">Account Settings</h2>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                    placeholder="Enter new password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                    placeholder="Confirm new password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">Leave password fields empty to keep current password</p>
                                    </div>
                                </div>
                            )}

                            {/* Social Tab */}
                            {activeTab === 'social' && (
                                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <span className="text-2xl">🔗</span>
                                        <h2 className="text-xl font-semibold">Social Links</h2>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="facebook" className="block text-sm font-medium text-gray-300 mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">f</span>
                                                    </div>
                                                    <span>Facebook</span>
                                                </div>
                                            </label>
                                            <input
                                                type="url"
                                                id="facebook"
                                                name="facebook"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                placeholder="https://facebook.com/username"
                                                value={socialLinks.facebook}
                                                onChange={handleSocialLinksChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">𝕏</span>
                                                    </div>
                                                    <span>Twitter / X</span>
                                                </div>
                                            </label>
                                            <input
                                                type="url"
                                                id="twitter"
                                                name="twitter"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                placeholder="https://twitter.com/username"
                                                value={socialLinks.twitter}
                                                onChange={handleSocialLinksChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">in</span>
                                                    </div>
                                                    <span>LinkedIn</span>
                                                </div>
                                            </label>
                                            <input
                                                type="url"
                                                id="linkedin"
                                                name="linkedin"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                                placeholder="https://linkedin.com/in/username"
                                                value={socialLinks.linkedin}
                                                onChange={handleSocialLinksChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
