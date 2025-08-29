import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Input from '../../../../utils/input'
import Textarea from '../../../../utils/textarea'
import ApiFunction from '../../../../utils/api/apiFuntions'
import { decryptData } from '../../../../utils/api/encrypted'

const HelpSupport = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { post } = ApiFunction()
    
    // Get token from Redux store (same pattern as EditProfile)
    const encryptedToken = useSelector(state => state.auth?.token)
    const token = useMemo(() => {
        return encryptedToken ? decryptData(encryptedToken) : null
    }, [encryptedToken])

    const [supportData, setSupportData] = useState({
        name: '',
        email: '',
        message: ''
    })

    // Fixed input change handler (same pattern as EditProfile)
    const handleInputChange = (value, fieldName) => {
        console.log('Input changed:', { value, fieldName }) // Debug log
        
        // Convert fieldName (label) to match our state keys
        let stateField = fieldName.toLowerCase().replace(/\s+/g, '')
        
        // Handle specific mappings
        if (stateField === 'name' || fieldName === 'Name') {
            stateField = 'name'
        } else if (stateField === 'email' || fieldName === 'Email') {
            stateField = 'email'
        } else if (stateField === 'message' || fieldName === 'Message') {
            stateField = 'message'
        }
        
        console.log('Mapped to state field:', stateField) // Debug log
        
        setSupportData(prev => ({
            ...prev,
            [stateField]: value
        }))
        
        // Clear error for this field if it exists
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
        if (!supportData.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (supportData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long'
        }

        // Email validation
        if (!supportData.email.trim()) {
            newErrors.email = 'Email is required'
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(supportData.email.trim())) {
                newErrors.email = 'Please enter a valid email address'
            }
        }

        // Message validation
        if (!supportData.message.trim()) {
            newErrors.message = 'Message is required'
        } else if (supportData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters long'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSend = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors')
            return
        }

        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        const data = {
            action: 'helpSupport',
            token: token,
            name: supportData.name.trim(),
            email: supportData.email.trim(),
            message: supportData.message.trim()
        }

        setLoading(true)

        try {
            const response = await post('', data)
            
            if (response?.status === 'success') {
                toast.success(response?.message || 'Your support request has been sent successfully!')
                
                // Reset form after successful submission
                setSupportData({
                    name: '',
                    email: '',
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
            console.error('Support request error:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <h2 className="fs_24 poppins_medium text-[#2C2C2C] mb-6">
                Help & Support
            </h2>

            {/* Form */}
            <div className="space-y-4">
                {/* Name and Email - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Name"
                            placeholder="Name"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={supportData.name}
                            name="name"
                        />
                        {errors.name && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            labels="Email"
                            placeholder="Email"
                            type="email"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={supportData.email}
                            name="email"
                        />
                        {errors.email && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Message Field - Full Width */}
                <div>
                    <Textarea
                        labels="Message"
                        placeholder="Message"
                        value={supportData.message}
                        onChange={handleInputChange}
                        name="message"
                        rows={5}
                        marginBottom="20px"
                    />
                    {errors.message && (
                        <p className="text-red-500 fs_14 mt-1 mb-3">{errors.message}</p>
                    )}
                </div>

                {/* Send Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className={`bg-[#2C6B6F] hover:bg-[#245559] text-white px-8 py-3 rounded-lg fs_14 plus_Jakarta_Sans_medium transition-colors duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HelpSupport