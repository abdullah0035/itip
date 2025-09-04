import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Input from '../../../../utils/input'
import ApiFunction from '../../../../utils/api/apiFuntions'
import { decryptData, encryptData } from '../../../../utils/api/encrypted'
import { setUserData } from '../../../redux/loginForm'

const EditProfile = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const { post } = ApiFunction()
    
    // Get customer data from Redux store
    const encryptedCustomer = useSelector(state => state.auth?.userData)
    const encryptedToken = useSelector(state => state.auth?.token)
    
    // MEMOIZE the decrypted data to prevent infinite re-renders
    const customerData = useMemo(() => {
        return encryptedCustomer ? decryptData(encryptedCustomer) : null
    }, [encryptedCustomer])
    
    const token = useMemo(() => {
        return encryptedToken ? decryptData(encryptedToken) : null
    }, [encryptedToken])

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country: '',
        city: ''
    })

    // Update form data when customerData changes
    useEffect(() => {
        if (customerData) {
            setFormData({
                first_name: customerData?.first_name || '',
                last_name: customerData?.last_name || '',
                email: customerData?.email || '',
                phone: customerData?.phone || '',
                country: customerData?.country || '',
                city: customerData?.city || ''
            })
        }
    }, [customerData])

    // Handle input changes
    const handleInputChange = (value, fieldName) => {
        console.log('Input changed:', { value, fieldName })
        
        // Convert fieldName (label) to match our state keys
        let stateField = fieldName.toLowerCase().replace(/\s+/g, '_')
        
        // Handle specific mappings
        if (stateField === 'first_name' || fieldName === 'First Name') {
            stateField = 'first_name'
        } else if (stateField === 'last_name' || fieldName === 'Last Name') {
            stateField = 'last_name'
        } else if (stateField === 'country' || fieldName === 'Country') {
            stateField = 'country'
        } else if (stateField === 'city' || fieldName === 'City') {
            stateField = 'city'
        } else if (stateField === 'phone_number' || fieldName === 'Phone Number') {
            stateField = 'phone'
        }
        
        console.log('Mapped to state field:', stateField)
        
        setFormData(prev => ({
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

        // First name validation
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required'
        } else if (formData.first_name.trim().length < 2) {
            newErrors.first_name = 'First name must be at least 2 characters'
        }

        // Last name validation
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required'
        } else if (formData.last_name.trim().length < 2) {
            newErrors.last_name = 'Last name must be at least 2 characters'
        }

        // Country validation
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required'
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = 'City is required'
        }

        // Phone validation (optional but if provided, must be valid)
        if (formData.phone.trim() && formData.phone.trim().length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleUpdate = async (e) => {
        e?.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix the validation errors')
            return
        }

        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        // Create data object for API (following the same pattern as login)
        const dataToSend = {
            action: 'updateCustomerProfile',
            token: token,
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            phone: formData.phone.trim(),
            country: formData.country.trim(),
            city: formData.city.trim()
        }

        setLoading(true)

        try {
            await post('', dataToSend)
                .then(res => {
                    console.log("Customer profile update response:", res);
                    
                    if (res?.status === 'success') {
                        toast.success(res?.message || 'Profile updated successfully')
                        
                        // Update Redux store with new customer data (same pattern as login)
                        const updatedCustomerData = encryptData(res.customer_data)
                        dispatch(setUserData(updatedCustomerData))
                        
                        // Clear any existing errors
                        setErrors({})
                    } else {
                        // Handle API error response (same pattern as login)
                        if (res?.errors && Array.isArray(res.errors)) {
                            // Handle validation errors from API
                            res.errors.forEach(error => {
                                toast.error(error)
                            })
                        } else if (res?.message) {
                            toast.error(res.message)
                        } else {
                            toast.error('Failed to update profile')
                        }
                    }
                })
        } catch (error) {
            console.error('Profile update error:', error)
            
            // Handle errors the same way as login component
            let errorMessage = 'An error occurred. Please try again.'
            
            // Check for specific error messages from API response
            if (error?.response?.data?.message) {
                errorMessage = error?.response?.data?.message
            } else if (error.message && !error.message.includes('Request failed with status code')) {
                errorMessage = error.message
            }

            setErrors({
                submit: errorMessage
            })
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <h2 className="fs_24 poppins_medium text-[#2C2C2C] mb-6">
                Edit Profile
            </h2>

            {/* Form */}
            <div className="space-y-4">
                {/* First Name and Last Name - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="First Name"
                            placeholder="Enter your first name"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.first_name}
                            name="first_name"
                        />
                        {errors.first_name && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.first_name}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            labels="Last Name"
                            placeholder="Enter your last name"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.last_name}
                            name="last_name"
                        />
                        {errors.last_name && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                {/* Email and Phone - Two Columns (Email is readonly for customers) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Email"
                            placeholder="Email address"
                            type="email"
                            marginBottom="20px"
                            onChange={() => {}} // No-op function since it's readonly
                            value={formData.email}
                            name="email"
                            readonly={true}
                        />
                        <p className="text-gray-500 fs_12 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                        <Input
                            labels="Phone Number"
                            placeholder="Phone number"
                            type="tel"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.phone}
                            name="phone"
                        />
                        {errors.phone && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Country and City - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Country"
                            placeholder="Enter your country"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.country}
                            name="country"
                        />
                        {errors.country && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.country}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            labels="City"
                            placeholder="Enter your city"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.city}
                            name="city"
                        />
                        {errors.city && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.city}</p>
                        )}
                    </div>
                </div>

                {/* Submit Error Display */}
                {errors.submit && (
                    <p className="text-red-500 fs_14 mb-4 text-center">{errors.submit}</p>
                )}

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

export default EditProfile