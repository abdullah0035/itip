import React, { useState } from 'react'
import {
    RiLockLine,
    RiQuestionLine,
    RiShieldCheckLine,
    RiLogoutBoxLine,
    RiEditLine
} from '@remixicon/react'
import EditProfile from './dashboardComponent/editProfile';
import ChangePassword from './changePassword';
import HelpSupport from './dashboardComponent/helpSupport';

const Account = () => {
    const qrCodesLength = 2;
    const [activeComponent, setActiveComponent] = useState('editProfile'); // Default to edit profile

    // Sample user data - replace with actual user data
    const user = {
        name: "SARAH SMITH",
        email: "sarahsmith@gmail.com",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" // placeholder image
    }

    // Function to handle sign out
    const handleSignOut = () => {
        // Add your sign out logic here
        console.log("Signing out...");
        // Example: redirect to login page, clear localStorage, etc.
    }

    // Function to handle privacy policy
    const handlePrivacyPolicy = () => {
        // Add your privacy policy logic here
        console.log("Opening Privacy Policy...");
        // Example: open modal, navigate to privacy page, etc.
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
            title: "Sign Out",
            icon: RiLogoutBoxLine,
            isActive: false, // Sign out should never appear active
            onClick: handleSignOut
        }
    ]

    // Function to get the current page title
    const getCurrentTitle = () => {
        switch(activeComponent) {
            case 'editProfile':
                return 'Account > Edit Profile';
            case 'changePassword':
                return 'Account > Change Password';
            case 'helpSupport':
                return 'Account > Help & Support';
            default:
                return 'Account';
        }
    }

    // Function to render the active component
    const renderActiveComponent = () => {
        switch(activeComponent) {
            case 'editProfile':
                return <EditProfile />;
            case 'changePassword':
                return <ChangePassword />;
            case 'helpSupport':
                return <HelpSupport />;
            default:
                return <EditProfile />;
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <div className='flex items-center justify-between'>
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">{getCurrentTitle()}</h1>
            </div>

            {/* Account Profile Section */}
            <div className={`bg-white ${qrCodesLength === 0 ? 'flex flex-col items-center justify-center ' : 'sm:px-5 py-5 px-3'} h_100vh rounded-lg`}>
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Profile Section */}
                    <div className="col-span-3">
                        {/* Profile Card */}
                        <div className="border border-[var(--border-color)] rounded-lg p-6 text-center">
                            {/* Profile Image */}
                            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                                <img
                                    src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Profile"
                                    className="min-w-[88px] max-h-[88px] w-[88px] h-[88px] object-cover"
                                />
                            </div>

                            {/* User Info */}
                            <h2 className="fs_14 plus_Jakarta_Sans_semibold text-gray-900 mb-1">
                                {user?.name}
                            </h2>
                            <p className="fs_12 text-[#252C32] mb-4">
                                {user?.email}
                            </p>

                            {/* Edit Profile Button */}
                            <button 
                                onClick={() => setActiveComponent('editProfile')}
                                className="flex items-center border border-[var(--border-color)] rounded-lg px-3 py-2 justify-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors mx-auto"
                            >
                                <RiEditLine className="w-4 h-4" />
                                <span className="text-sm">Edit profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Menu Items */}
                    <div className="col-span-9">
                        <div className="space-y-2 border border-[var(--border-color)] rounded-lg">
                            {menuItems?.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={item?.onClick}
                                    className={`w-full flex items-center space-x-3 px-4 h-[54px] text-left transition-colors ${item?.isActive
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
                    </div>
                </div>
                
                <hr className='my-10'/>

                {/* Render Active Component */}
                {renderActiveComponent()}
            </div>
        </div>
    )
}

export default Account