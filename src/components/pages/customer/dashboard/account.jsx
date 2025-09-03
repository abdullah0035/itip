import React, { useState } from 'react'
import {
    RiLockLine,
    RiQuestionLine,
    RiShieldCheckLine,
    RiLogoutBoxLine,
    RiEditLine,
    RiUserSettingsLine
} from '@remixicon/react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ChangePassword from './changePassword'
import EditProfile from './editProfile'
import HelpSupport from './helpSupport'
import { decryptData } from '../../../../utils/api/encrypted'
import { setLogout } from '../../../redux/loginForm'

const CustomerAccount = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const qrCodesLength = 2
    const [activeComponent, setActiveComponent] = useState('editProfile') // Default to edit profile

    // Sample user data - replace with actual user data
    const encryptedUser = useSelector(state => state.auth?.userData)
    const userData = decryptData(encryptedUser)
    
    const user = {
        ...userData,
        profileImage: userData?.profile_picture || "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
    }

    // Function to handle sign out
    const handleSignOut = () => {
        console.log("Signing out...")
        dispatch(setLogout())
        navigate('/customer-login')
    }

    // Function to handle privacy policy
    const handlePrivacyPolicy = () => {
        console.log("Opening Privacy Policy...")
        // Example: open modal, navigate to privacy page, etc.
        window.open('/privacy-policy', '_blank') // or handle as needed
    }

    const menuItems = [
        {
            title: "Change Password",
            icon: RiLockLine,
            isActive: activeComponent === 'changePassword',
            onClick: () => setActiveComponent('changePassword')
        },
        {
            title: "Help & Support",
            icon: RiQuestionLine,
            isActive: activeComponent === 'helpSupport',
            onClick: () => setActiveComponent('helpSupport')
        },
        {
            title: "Privacy Policy",
            icon: RiShieldCheckLine,
            isActive: activeComponent === 'privacyPolicy',
            onClick: handlePrivacyPolicy
        },
        {
            title: "Account Management",
            icon: RiUserSettingsLine,
            isActive: activeComponent === 'account',
            onClick: () => setActiveComponent('account')
        },
        {
            title: "Sign Out",
            icon: RiLogoutBoxLine,
            isActive: false, // Sign out should never appear active
            onClick: handleSignOut
        }
    ]

    // Function to get the current page title
    const getCurrentTitle = () => {
        switch (activeComponent) {
            case 'editProfile':
                return 'Account > Edit Profile'
            case 'changePassword':
                return 'Account > Change Password'
            case 'helpSupport':
                return 'Account > Help & Support'
            case 'account':
                return 'Account > Account Management'
            default:
                return 'Account'
        }
    }

    // Function to render the active component
    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'editProfile':
                return <EditProfile />
            case 'changePassword':
                return <ChangePassword />
            case 'helpSupport':
                return <HelpSupport />
            default:
                return <EditProfile />
        }
    }

    return (
        <div className="p-3 sm:p-6 space-y-6">
            {/* Dashboard Header */}
            <div className='flex items-center justify-between'>
                <h1 className="fs_24 sm:fs_32 outfit_medium text-[#2C2C2C]">{getCurrentTitle()}</h1>
            </div>

            {/* Account Profile Section */}
            <div className={`bg-white ${qrCodesLength === 0 ? 'flex flex-col items-center justify-center ' : 'sm:px-5 py-5 px-3'} h_100vh rounded-lg`}>

                {/* Mobile & Desktop Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Profile Section - Mobile: Full width, Desktop: Left Column */}
                    <div className="lg:col-span-3">
                        {/* Profile Card */}
                        <div className="border border-[var(--border-color)] rounded-lg p-4 sm:p-6 text-center">
                            {/* Profile Image - Updated to use user's profile picture */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-4">
                                <img
                                    src={user?.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                                    }}
                                />
                            </div>

                            {/* User Info */}
                            <h2 className="fs_14 plus_Jakarta_Sans_semibold text-gray-900 mb-1">
                                {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name || 'User Name'}
                            </h2>
                            <p className="fs_12 text-[#252C32] mb-4 truncate">
                                {user?.email}
                            </p>

                            {/* Edit Profile Button */}
                            <button
                                onClick={() => setActiveComponent('editProfile')}
                                className="md:flex hidden items-center border border-[var(--border-color)] rounded-lg px-3 py-2 justify-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors mx-auto w-full sm:w-auto"
                            >
                                <RiEditLine className="w-4 h-4" />
                                <span className="text-sm">Edit profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Menu Items - Mobile: Full width, Desktop: Right Column */}
                    <div className="lg:col-span-9">
                        {/* Desktop Menu */}
                        <div className="hidden lg:block space-y-2 border border-[var(--border-color)] rounded-lg">
                            {menuItems?.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={item?.onClick}
                                    className={`w-full flex items-center space-x-3 px-4 h-[42px] text-left transition-colors ${item?.isActive
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${item.isActive ? 'text-white' : 'text-[var(--primary)]'
                                        }`} />
                                    <span className="text-sm plus_Jakarta_Sans_medium">
                                        {item?.title}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile Tabs */}
                        <div className="lg:hidden">
                            {/* Mobile Tab Navigation */}
                            <div className=" overflow-x-auto no_scroll md:flex hidden border border-[var(--border-color)] rounded-lg mb-4">
                                <button
                                    onClick={() => setActiveComponent('editProfile')}
                                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 text-sm plus_Jakarta_Sans_medium transition-colors ${activeComponent === 'editProfile'
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <RiEditLine className={`w-4 h-4 ${activeComponent === 'editProfile' ? 'text-white' : 'text-[var(--primary)]'}`} />
                                    <span>Profile</span>
                                </button>
                                {menuItems?.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item?.onClick}
                                        className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 text-sm plus_Jakarta_Sans_medium transition-colors whitespace-nowrap ${item?.isActive
                                            ? 'bg-[var(--primary)] text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${item.isActive ? 'text-white' : 'text-[var(--primary)]'
                                            }`} />
                                        <span>{item?.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Menu Grid (Alternative Layout) */}
                            <div className="grid grid-cols-2 gap-2 mb-4 lg:hidden">
                                <button
                                    onClick={() => setActiveComponent('editProfile')}
                                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-colors ${activeComponent === 'editProfile'
                                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                        : 'text-gray-700 hover:bg-gray-50 border-[var(--border-color)]'
                                        }`}
                                >
                                    <RiEditLine className={`w-6 h-6 ${activeComponent === 'editProfile' ? 'text-white' : 'text-[var(--primary)]'}`} />
                                    <span className="text-xs plus_Jakarta_Sans_medium">Edit Profile</span>
                                </button>
                                {menuItems?.slice(0, 3).map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item?.onClick}
                                        className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-colors ${item?.isActive
                                            ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                            : 'text-gray-700 hover:bg-gray-50 border-[var(--border-color)]'
                                            }`}
                                    >
                                        <item.icon className={`w-6 h-6 ${item.isActive ? 'text-white' : 'text-[var(--primary)]'
                                            }`} />
                                        <span className="text-xs plus_Jakarta_Sans_medium text-center">{item?.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='my-6 lg:my-10' />

                {/* Render Active Component */}
                <div className="w-full">
                    {renderActiveComponent()}
                </div>
            </div>
        </div>
    )
}

export default CustomerAccount