import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Input from '../../../../utils/input'
import ApiFunction from '../../../../utils/api/apiFuntions'
import { decryptData, encryptData } from '../../../../utils/api/encrypted'
import { setUserData } from '../../../redux/loginForm'
import debounce from 'debounce'

const EditProfile = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const { post } = ApiFunction()
    
    // Get user data from Redux store
    const encryptedUser = useSelector(state => state.auth?.userData)
    const encryptedToken = useSelector(state => state.auth?.token)
    
    // MEMOIZE the decrypted data to prevent infinite re-renders
    const userData = useMemo(() => {
        return encryptedUser ? decryptData(encryptedUser) : null
    }, [encryptedUser])
    
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

    // Update form data when userData changes (now won't cause infinite loop)
    useEffect(() => {
        if (userData) {
            setFormData({
                first_name: userData?.first_name || '',
                last_name: userData?.last_name || '',
                email: userData?.email || '',
                phone: userData?.phone || '',
                country: userData?.country || '',
                city: userData?.city || ''
            })
        }
    }, [userData])

    // Fixed input change handler based on your working password component
    const handleInputChange = (value, fieldName) => {
        console.log('Input changed:', { value, fieldName }); // Debug log
        
        // Convert fieldName (label) to match our state keys
        let stateField = fieldName.toLowerCase().replace(/\s+/g, '_');
        
        // Handle specific mappings
        if (stateField === 'first_name' || fieldName === 'First Name') {
            stateField = 'first_name';
        } else if (stateField === 'last_name' || fieldName === 'Last Name') {
            stateField = 'last_name';
        } else if (stateField === 'country' || fieldName === 'Country') {
            stateField = 'country';
        } else if (stateField === 'city' || fieldName === 'City') {
            stateField = 'city';
        }
        
        console.log('Mapped to state field:', stateField); // Debug log
        
        setFormData(prev => ({
            ...prev,
            [stateField]: value
        }));
        
        // Clear error for this field if it exists
        if (errors[stateField]) {
            setErrors(prev => ({
                ...prev,
                [stateField]: ''
            }));
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

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleUpdate = debounce(async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors')
            return
        }

        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        const data = {
            action: 'updateProfile',
            token: token,
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            country: formData.country.trim(),
            city: formData.city.trim()
        }

        setLoading(true)

        try {
            const response = await post('', data)
            
            if (response?.status === 'success') {
                toast.success(response?.message || 'Profile updated successfully')
                
                // Update Redux store with new user data
                const updatedUserData = encryptData(response.user_data)
                dispatch(setUserData(updatedUserData))
                
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
                    toast.error('Failed to update profile')
                }
            }
        } catch (error) {
            console.error('Profile update error:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }, 300)

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

                {/* Email and Phone - Two Columns (Readonly) */}
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
                            onChange={() => {}} // No-op function since it's readonly
                            value={formData.phone}
                            name="phone"
                            readonly={true}
                        />
                        <p className="text-gray-500 fs_12 mt-1">Phone number cannot be changed</p>
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