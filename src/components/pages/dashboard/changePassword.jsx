import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RiEyeFill } from '@remixicon/react'
import Input from '../../../utils/input'
import ApiFunction from '../../../utils/api/apiFuntions'
import { decryptData } from '../../../utils/api/encrypted'

const ChangePassword = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { post } = ApiFunction()
    
    // Get token from Redux store
    const encryptedToken = useSelector(state => state.auth?.token)
    const token = decryptData(encryptedToken)

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleInputChange = (value, fieldName) => {
        // Convert fieldName to match our state keys
        const field = fieldName.toLowerCase().replace(' ', '')
        let stateField = field
        
        if (field === 'oldpassword') {
            stateField = 'oldPassword'
        } else if (field === 'newpassword') {
            stateField = 'newPassword'
        } else if (field === 'confirmpassword') {
            stateField = 'confirmPassword'
        }
        
        setPasswordData(prev => ({
            ...prev,
            [stateField]: value
        }))

        // Clear error when user starts typing
        if (errors[stateField]) {
            setErrors(prev => ({
                ...prev,
                [stateField]: ''
            }))
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        // Old password validation
        if (!passwordData.oldPassword.trim()) {
            newErrors.oldPassword = 'Current password is required'
        }

        // New password validation
        if (!passwordData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required'
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters long'
        }

        // Confirm password validation
        if (!passwordData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Password confirmation is required'
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'New password and confirmation do not match'
        }

        // Check if new password is same as old password
        if (passwordData.oldPassword && passwordData.newPassword && 
            passwordData.oldPassword === passwordData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleUpdate = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors')
            return
        }

        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        const data = {
            action: 'changePassword',
            token: token,
            old_password: passwordData.oldPassword,
            new_password: passwordData.newPassword,
            confirm_password: passwordData.confirmPassword
        }

        setLoading(true)

        try {
            const response = await post('', data)
            
            if (response?.status === 'success') {
                toast.success(response?.message || 'Password changed successfully')
                
                // Reset form after successful update
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                
                // Clear any existing errors
                setErrors({})
            }else if(response?.message === 'Current password is incorrect'){
                toast.error('Current password is incorrect');
            } else {
                if (response?.errors && Array.isArray(response.errors)) {
                    // Handle validation errors from API
                    response.errors.forEach(error => {
                        toast.error(error)
                    })
                } else if (response?.message) {
                    toast.error(response.message)
                } else {
                    toast.error('Failed to change password')
                }
            }
        } catch (error) {
            console.error('Password change error:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

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
                        placeholder="Enter current password"
                        type="password"
                        icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
                        marginBottom="20px"
                        onChange={handleInputChange}
                        value={passwordData.oldPassword}
                        name="oldPassword"
                    />
                    {errors.oldPassword && (
                        <p className="text-red-500 fs_14 mt-1 mb-3">{errors.oldPassword}</p>
                    )}
                </div>

                {/* New Password and Confirm Password - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="New Password"
                            placeholder="Enter new password"
                            type="password"
                            icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={passwordData.newPassword}
                            name="newPassword"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.newPassword}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            labels="Confirm Password"
                            placeholder="Confirm new password"
                            type="password"
                            icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={passwordData.confirmPassword}
                            name="confirmPassword"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className={`bg-[#2C6B6F] hover:bg-[#245559] text-white px-8 py-3 rounded-lg fs_14 plus_Jakarta_Sans_medium transition-colors duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword