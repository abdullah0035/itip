/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { RiEyeFill, RiInformationFill } from '@remixicon/react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Input from '../../../utils/input'
import { Logo } from '../../icons/icons'
import ApiFunction from '../../../utils/api/apiFuntions'
import { useDispatch, useSelector } from 'react-redux'
import { encryptData } from '../../../utils/api/encrypted'
import { setLogin, setLoginRedirect, setToken, setUserData } from '../../redux/loginForm'
import { toast } from 'react-toastify'

const Signup = ({ email: propEmail }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { post } = ApiFunction()
  const dispatch = useDispatch();
  
  // Get email from props, location state, or default
  const verifiedEmail = propEmail || location.state?.email || ''
  const isEmailVerified = location.state?.verified || false
  
  if(verifiedEmail === ""){
    navigate('/');
  }

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: verifiedEmail,
    phone: '',
    password: '',
    country: '',
    city: ''
  })
  
  // Location state
  const [locationLoading, setLocationLoading] = useState(true)
  const [locationError, setLocationError] = useState('')
  
  // Error state
  const [errors, setErrors] = useState({})
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Set email when component mounts
  useEffect(() => {
    if (verifiedEmail) {
      setFormData(prev => ({
        ...prev,
        email: verifiedEmail
      }))
    }
  }, [verifiedEmail])

  // Get user's current location on component mount
  useEffect(() => {
    getUserLocation()
  }, [])

  // Function to get user's current location using IP-based geolocation (more reliable)
  const getUserLocation = async () => {
    setLocationLoading(true)
    setLocationError('')

    try {
      // Primary: Try IP-based geolocation (no permission needed)
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      if (data.country_name && data.city) {
        setFormData(prev => ({
          ...prev,
          country: data.country_name,
          city: data.city
        }))
        setLocationLoading(false)
        return
      }
      
      // Fallback: Try another IP service
      const fallbackResponse = await fetch('https://api.bigdatacloud.net/data/ip-geolocation?key=')
      const fallbackData = await fallbackResponse.json()
      
      if (fallbackData.country && fallbackData.city) {
        setFormData(prev => ({
          ...prev,
          country: fallbackData.country.name,
          city: fallbackData.city
        }))
        setLocationLoading(false)
        return
      }
      
      // If IP-based fails, try GPS geolocation
      getUserLocationWithGPS()
      
    } catch (error) {
      console.error('IP-based location error:', error)
      // Try GPS as fallback
      getUserLocationWithGPS()
    }
  }

  // Function to get user's location using GPS (requires permission)
  const getUserLocationWithGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser')
      setLocationLoading(false)
      setDefaultLocation()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        reverseGeocode(latitude, longitude)
      },
      (error) => {
        console.error('GPS Geolocation error:', error)
        let errorMessage = 'Unable to retrieve your location'
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred'
            break
        }
        
        setLocationError(errorMessage)
        setLocationLoading(false)
        setDefaultLocation()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // Function to reverse geocode coordinates to get country and city
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }
      
      const data = await response.json()
      
      const country = data.countryName || ''
      const city = data.city || data.locality || ''
      
      if (country && city) {
        setFormData(prev => ({
          ...prev,
          country: country,
          city: city
        }))
      } else if (country) {
        setFormData(prev => ({
          ...prev,
          country: country
        }))
      } else {
        throw new Error('Could not determine location')
      }
      
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      setLocationError('Could not determine your location')
      setDefaultLocation()
    } finally {
      setLocationLoading(false)
    }
  }

  // Set default location when detection fails
  const setDefaultLocation = () => {
    // You can customize these defaults based on your primary user base
    setFormData(prev => ({
      ...prev,
      country: 'Pakistan', // Based on your location (Faisalabad, Punjab, PK)
      city: 'Faisalabad'
    }))
  }

  // Handle input changes
  const handleInputChange = (value, fieldName) => {
    let field = fieldName.toLowerCase().replace(' ', '').replace('address', '').replace('number', '')
    
    // Handle field name mapping
    if (field === 'firstname') field = 'firstName'
    if (field === 'lastname') field = 'lastName'
    if (field === 'email') field = 'email'
    if (field === 'phone') field = 'phone'
    if (field === 'password') field = 'password'
    if (field === 'country') field = 'country'
    if (field === 'city') field = 'city'
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
    
    // Clear location error when user manually changes location
    if ((field === 'country' || field === 'city') && locationError) {
      setLocationError('')
    }
  }

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {}
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address'
      }
      if (formData.email.length > 254) {
        newErrors.email = 'Email address is too long'
      }
      if (formData.email.includes('..')) {
        newErrors.email = 'Email address contains consecutive dots'
      }
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      const cleanedPhone = formData.phone.replace(/[\s\-\(\)\+]/g, '')
      
      if (!/^\d+$/.test(cleanedPhone)) {
        newErrors.phone = 'Phone number should only contain digits, spaces, hyphens, parentheses, and plus sign'
      } else if (cleanedPhone.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits'
      } else if (cleanedPhone.length > 15) {
        newErrors.phone = 'Phone number cannot exceed 15 digits'
      } else if (formData.phone.startsWith('+') && cleanedPhone.length < 11) {
        newErrors.phone = 'International phone number format requires country code and at least 10 digits'
      }
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }
    
    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    } else if (formData.country.trim().length < 2) {
      newErrors.country = 'Country must be at least 2 characters'
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission with API integration
  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    // Validate form before proceeding
    if (!validateForm()) {
      return
    }
    
    const payload = {
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/[\s\-\(\)]/g, ''),
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      password: formData.password,
      country: formData.country.trim(),
      city: formData.city.trim(),
      action: 'createUser'
    }
    
    setIsLoading(true)
    
    await post('', payload)
      .then((res) => {
        setIsLoading(false)
        if (res?.status === 'success') {
          const token = encryptData(res?.token);
          const userData = encryptData(res?.user_data);
          dispatch(setLoginRedirect('/qr-setup'));
          dispatch(setToken(token));
          dispatch(setUserData(userData));
          dispatch(setLogin(true));
          toast.success('Account created successfully!');
          navigate('/success')
        } else {
          toast.success("There is an create your account",res?.message);
          setErrors({ 
            submit: res?.message || 'Failed to create account. Please try again.' 
          })
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Signup error:', error)
        setErrors({
          submit: error.message || 'An error occurred during signup. Please try again.'
        })
      })
  }

  // Function to manually detect location (optional button)
  const handleDetectLocation = () => {
    setLocationLoading(true)
    setLocationError('')
    getUserLocation()
  }

  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 outfit_medium'>Sign Up</h1>
        <h2 className='outfit mb-10 fs_20'>Sign Up to your account</h2>
        
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name Row */}
          <div className='grid grid-cols-2 gap-4 mb-1'>
            <div>
              <Input 
                labels='First Name' 
                type='text' 
                placeholder='First Name' 
                icon=""
                onChange={handleInputChange}
                value={formData.firstName}
                name="firstName"
              />
              {errors.firstName && (
                <p className="text-red-500 fs_12 mt-1 flex items-center gap-1">
                  {errors.firstName}
                  <RiInformationFill className='w-[14px]' />
                </p>
              )}
            </div>
            <div>
              <Input 
                labels='Last Name' 
                type='text' 
                placeholder='Last Name' 
                icon=""
                onChange={handleInputChange}
                value={formData.lastName}
                name="lastName"
              />
              {errors.lastName && (
                <p className="text-red-500 fs_12 mt-1 flex items-center gap-1">
                  {errors.lastName}
                  <RiInformationFill className='w-[14px]' />
                </p>
              )}
            </div>
          </div>

          <Input 
            labels='Email Address' 
            type='email' 
            placeholder='Your Email Address' 
            icon=""
            onChange={handleInputChange}
            value={formData.email}
            name="email"
            disabled={isEmailVerified}
            readonly={isEmailVerified}
          />
          {errors.email && (
            <p className="text-red-500 fs_14 mt-1 mb-3 flex items-center gap-2">
              {errors.email}
              <RiInformationFill className='w-[16px]' />
            </p>
          )}
          
          <Input 
            labels='Phone Number' 
            type='tel' 
            placeholder='Your Phone Number' 
            icon=""
            onChange={handleInputChange}
            value={formData.phone}
            name="phone"
          />
          {errors.phone && (
            <p className="text-red-500 fs_14 mt-1 mb-3 flex items-center gap-2">
              {errors.phone}
              <RiInformationFill className='w-[16px]' />
            </p>
          )}
          
          <Input 
            labels='Password' 
            type='password' 
            placeholder='Password' 
            icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
            onChange={handleInputChange}
            value={formData.password}
            name="password"
          />
          {errors.password && (
            <p className="text-red-500 fs_14 mt-1 mb-3 flex items-center gap-2">
              {errors.password}
              <RiInformationFill className='w-[16px]' />
            </p>
          )}
          
          {/* Country and City Row */}
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <Input 
                labels='Country' 
                type='text' 
                placeholder={locationLoading ? 'Detecting...' : 'Enter your country'}
                icon=""
                onChange={handleInputChange}
                value={formData.country}
                name="country"
                disabled={locationLoading}
              />
              {errors.country && (
                <p className="text-red-500 fs_12 mt-1 flex items-center gap-1">
                  {errors.country}
                  <RiInformationFill className='w-[14px]' />
                </p>
              )}
            </div>
            <div>
              <Input 
                labels='City' 
                type='text' 
                placeholder={locationLoading ? 'Detecting...' : 'Enter your city'}
                icon=""
                onChange={handleInputChange}
                value={formData.city}
                name="city"
                disabled={locationLoading}
              />
              {errors.city && (
                <p className="text-red-500 fs_12 mt-1 flex items-center gap-1">
                  {errors.city}
                  <RiInformationFill className='w-[14px]' />
                </p>
              )}
            </div>
          </div>

          <button 
            type="submit"
            className={`primary_btn mt-4 ${isLoading || locationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading || locationLoading}
          >
            {isLoading 
              ? 'Creating Account...' 
              : locationLoading 
                ? 'Detecting Location...' 
                : 'Sign Up'
            }
          </button>
        </form>

        <span className='block poppins_medium fs_14 text-center mt-10'>
          I already have an account? 
          <Link to={'/'} className='text-[var(--primary)]'> Sign In</Link>
        </span>
      </div>
    </>
  )
}

export default Signup