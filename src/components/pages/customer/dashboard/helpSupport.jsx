import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RiMailLine, RiUserLine, RiMessageLine } from '@remixicon/react'
import ApiFunction from '../../../../utils/api/apiFuntions'
import { decryptData } from '../../../../utils/api/encrypted'
import Input from '../../../../utils/input'

const HelpSupport = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { post } = ApiFunction()
    
    // Get token and user data from Redux store
    const encryptedToken = useSelector(state => state.auth?.token)
    const encryptedUser = useSelector(state => state.auth?.userData)
    const token = decryptData(encryptedToken)
    const userData = decryptData(encryptedUser)

    const [formData, setFormData] = useState({
        name: userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : '',
        email: userData?.email || '',
        message: ''
    })

    const handleInputChange = (value, fieldName) => {
        const field = fieldName.toLowerCase().replace(/\s+/g, '_')
        let stateField = field
        
        if (field === 'your_name' || fieldName === 'Your Name') {
            stateField = 'name'
        } else if (field === 'email_address' || fieldName === 'Email Address') {
            stateField = 'email'
        } else if (field === 'your_message' || fieldName === 'Your Message') {
            stateField = 'message'
        }
        
        setFormData(prev => ({
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

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long'
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required'
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters long'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors')
            return
        }

        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        const data = {
            action: 'customerHelpSupport',
            token: token,
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim()
        }

        setLoading(true)

        try {
            const response = await post('', data)
            
            if (response?.status === 'success') {
                toast.success(response?.message || 'Your support request has been sent successfully')
                
                // Reset form after successful submission
                setFormData({
                    name: userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : '',
                    email: userData?.email || '',
                    message: ''
                })
                
                // Clear any existing errors
                setErrors({})
            } else {
                if (response?.errors && Array.isArray(response.errors)) {
                    // Handle validation errors from API
                    response.errors.forEach(error => {
                        toast.error(error)
                    })
                } else if (response?.message) {
                    toast.error(response.message)
                } else {
                    toast.error('Failed to send support request')
                }
            }
        } catch (error) {
            console.error('Help support error:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="fs_24 poppins_medium text-[#2C2C2C] mb-4">
                    Help & Support
                </h2>
                <p className="text-gray-600 fs_16">
                    Need assistance? We're here to help! Send us a message and we'll get back to you within 24-48 hours.
                </p>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
                <h3 className="fs_20 poppins_medium text-[#2C2C2C] mb-4">
                    Send us a Message
                </h3>

                {/* Name and Email - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Your Name"
                            placeholder="Enter your full name"
                            type="text"
                            icon={<RiUserLine className='text-[var(--icon)] fs_16'/>}
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.name}
                            name="name"
                        />
                        {errors.name && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            labels="Email Address"
                            placeholder="Enter your email address"
                            type="email"
                            icon={<RiMailLine className='text-[var(--icon)] fs_16'/>}
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.email}
                            name="email"
                        />
                        {errors.email && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Message Field - Full Width */}
                <div>
                    <label className="block fs_14 poppins_medium text-gray-700 mb-2">
                        Your Message
                    </label>
                    <div className="relative">
                        <RiMessageLine className="absolute left-3 top-3 text-[var(--icon)] text-gray-400 w-4 h-4" />
                        <textarea
                            placeholder="Please describe your issue or question in detail..."
                            rows={6}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-vertical"
                            value={formData.message}
                            onChange={(e) => handleInputChange(e.target.value, 'Your Message')}
                        />
                    </div>
                    {errors.message && (
                        <p className="text-red-500 fs_14 mt-1">{errors.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`bg-[#2C6B6F] hover:bg-[#245559] text-white px-8 py-3 rounded-lg fs_14 plus_Jakarta_Sans_medium transition-colors duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HelpSupport