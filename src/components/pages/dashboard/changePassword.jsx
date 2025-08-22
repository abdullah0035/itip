import React, { useState } from 'react'
import { RiEyeFill } from '@remixicon/react'
import Input from '../../../utils/input';

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (value, fieldName) => {
        // Convert fieldName to match our state keys
        const field = fieldName.toLowerCase().replace(' ', '');
        let stateField = field;
        
        if (field === 'oldpassword') {
            stateField = 'oldPassword';
        } else if (field === 'newpassword') {
            stateField = 'newPassword';
        } else if (field === 'confirmpassword') {
            stateField = 'confirmPassword';
        }
        
        setPasswordData(prev => ({
            ...prev,
            [stateField]: value
        }));
    };

    const handleUpdate = () => {
        // Add password validation logic here
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New password and confirm password do not match!');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            alert('New password must be at least 6 characters long!');
            return;
        }
        
        console.log('Password updated:', {
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        });
        
        // Add your password update logic here
        // Reset form after successful update
        setPasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <h2 className="fs_24 poppins_medium text-[#2C2C2C] mb-6">
                Change Password
            </h2>

            {/* Form */}
            <div className="space-y-4">
                {/* Old Password Field - Full Width */}
                <div>
                    <Input
                        labels="Old Password"
                        placeholder="Password"
                        type="password"
                        icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
                        marginBottom="20px"
                        onChange={handleInputChange}
                        value={passwordData.oldPassword}
                        name="oldPassword"
                    />
                </div>

                {/* New Password and Confirm Password - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="New Password"
                            placeholder="Password"
                            type="password"
                            icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={passwordData.newPassword}
                            name="newPassword"
                        />
                    </div>
                    <div>
                        <Input
                            labels="Confirm Password"
                            placeholder="Confirm Password"
                            type="password"
                            icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={passwordData.confirmPassword}
                            name="confirmPassword"
                        />
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleUpdate}
                        className="bg-[#2C6B6F] hover:bg-[#245559] text-white px-8 py-3 rounded-lg fs_14 plus_Jakarta_Sans_medium transition-colors duration-200"
                    >
                        Updated
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword