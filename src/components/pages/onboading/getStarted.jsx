/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import { useNavigate } from 'react-router-dom'
import { RiInformationFill } from '@remixicon/react'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'

const GetStarted = () => {
  const navigate = useNavigate()

  // Form state
  const [contactMethod, setContactMethod] = useState('phone') // 'phone' or 'email'
  const [contactValue, setContactValue] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { post } = ApiFunction();
  
  // Handle method toggle
  const handleMethodToggle = (method) => {
    setContactMethod(method)
    setContactValue('') // Clear input when switching methods
    setErrors({}) // Clear any existing errors
  }

  // Handle input change
  const handleInputChange = (value, fieldName) => {
    setContactValue(value)

    // Clear errors when user starts typing
    if (errors.contact || errors.submit) {
      setErrors({})
    }
  }

  // Enhanced validation function
  const validateInput = () => {
    const newErrors = {}

    if (!contactValue.trim()) {
      newErrors.contact = `${contactMethod === 'phone' ? 'Phone number' : 'Email address'} is required`
    } else if (contactMethod === 'email') {
      // Enhanced email validation
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (!emailRegex.test(contactValue.trim())) {
        newErrors.contact = 'Please enter a valid email address'
      }
      // Additional email checks
      if (contactValue.length > 254) {
        newErrors.contact = 'Email address is too long'
      }
      if (contactValue.includes('..')) {
        newErrors.contact = 'Email address contains consecutive dots'
      }
    } else if (contactMethod === 'phone') {
      // Enhanced phone validation
      const cleanedPhone = contactValue.replace(/[\s\-\(\)\+]/g, '')

      // Check if it contains only digits after cleaning
      if (!/^\d+$/.test(cleanedPhone)) {
        newErrors.contact = 'Phone number should only contain digits, spaces, hyphens, parentheses, and plus sign'
      }
      // Check minimum length (10 digits for most countries)
      else if (cleanedPhone.length < 10) {
        newErrors.contact = 'Phone number must be at least 10 digits'
      }
      // Check maximum length (15 digits is international standard)
      else if (cleanedPhone.length > 15) {
        newErrors.contact = 'Phone number cannot exceed 15 digits'
      }
      // If starts with +, ensure it has country code format
      else if (contactValue.startsWith('+') && cleanedPhone.length < 11) {
        newErrors.contact = 'International phone number format requires country code and at least 10 digits'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission with API integration
  const handleSubmit = async (e) => {
    e?.preventDefault()

    // Validate input before proceeding
    if (!validateInput()) {
      return
    }
    
    let payload = {};
    
    if (contactMethod === 'phone') {
      // ==============================================
      // PHONE NUMBER API INTEGRATION
      // ==============================================
      const cleanedPhone = contactValue.replace(/[\s\-\(\)]/g, '')
      payload = {
        phoneNumber: cleanedPhone,
      }
    } else {
      // ==============================================
      // EMAIL API INTEGRATION
      // ==============================================
      payload = {
        email: contactValue?.trim()?.toLowerCase(),
        action: 'verificationCode'
      }
    }
    
    setIsLoading(true);
    
    if (contactMethod === 'phone') {
      // For phone verification, skip API call and go directly to verification
      setIsLoading(false);
      
      // Debug logging
      console.log('Navigating with phone data:', {
        phoneNumber: contactValue.trim(),
        type: 'phone'
      });
      
      navigate('/verification', { 
        state: { 
          phoneNumber: contactValue.trim(), // Pass phone number properly
          type: 'phone' // Pass the verification type
        } 
      });
      return;
    }
    
    // Only make API call for email verification
    await post('', payload)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        if (res?.status) {
          navigate('/verification', { 
            state: { 
              email: contactValue?.trim()?.toLowerCase(),
              type: 'email' // Pass the verification type
            } 
          });
        } else {
          if(res.message === 'Email is already Verified.'){
            navigate('/signup', { 
              state: { 
                email: contactValue?.trim()?.toLowerCase(),
                verified: true,
                type: 'email'
              } 
            });
            toast.warning('Email is already verified');
          } else if(res.message === 'Account Already Created'){
            toast.error('Account Already exists, Please Login');
            navigate('/');
          } else {
            console.log("the error from api is", res?.data?.message);
            setErrors({ submit: res?.message || 'An error occurred' });
          }
        }
      })
      .catch((error) => {
        setIsLoading(false)
        setErrors({ submit: error.message || 'An error occurred' })
      })
  }

  const isValidInput = contactValue.trim().length > 0

  return (
    <div className="flex flex-col ">
      {/* Logo */}
      <div className="pb-4">
        <img src={Logo} width={100} className='mx-auto' alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-6">
        <div className="max-w-md mx-auto">

          {/* Toggle Buttons */}
          <div className="flex bg-[var(--primary-light)] rounded-full p-[6px] mb-8">
            <button
              type="button"
              onClick={() => handleMethodToggle('phone')}
              className={`flex-1 py-2 px-4 rounded-full fs_17 transition-all ${contactMethod === 'phone'
                ? 'bg-white text-gray-900 shadow-sm open_sans_bold'
                : 'text-gray-600 hover:text-gray-900 open_sans'
                }`}
            >
              Phone
            </button>
            <button
              type="button"
              onClick={() => handleMethodToggle('email')}
              className={`flex-1 py-2 px-4 rounded-full fs_17 font-medium transition-all ${contactMethod === 'email'
                ? 'bg-white text-gray-900 shadow-sm open_sans_bold'
                : 'text-gray-600 hover:text-gray-900 open_sans'
                }`}
            >
              Email
            </button>
          </div>

          {/* Title */}
          <h1 className="fs_40 outfit_medium">Get Started</h1>

          {/* Subtitle */}
          <p className="outfit fs_20 text-gray-600 mb-5">
            Enter email or phone number to send OTP code
          </p>

          <form onSubmit={handleSubmit}>
            {/* Input Field */}
            <Input
              labels={contactMethod === 'phone' ? "Enter Your number" : "Enter Email address"}
              placeholder={contactMethod === 'phone' ? 'Mobile number' : 'Email address'}
              type={contactMethod === 'phone' ? 'tel' : 'email'}
              onChange={handleInputChange}
              value={contactValue}
              name={contactMethod === 'phone' ? 'phone' : 'email'}
            />

            {/* Error Message */}
            {errors?.contact && (
              <p className="text-red-500 fs_14 mt-1 mb-4 flex gap-[10px]">{errors?.contact}<RiInformationFill className='w-[16px] relative bottom-[2px]' /></p>
            )}

            {/* Submit Error Message */}
            {errors?.submit && (
              <p className="text-red-500 fs_14 mt-1 mb-4 flex gap-[10px]">{errors?.submit}<RiInformationFill className='w-[16px] relative bottom-[2px]' /></p>
            )}

            {/* Disclaimer Text */}
            <p className="text-gray-500 fs_14 mb-8 leading-relaxed">
              You will receive {contactMethod === 'phone' ? 'an SMS' : 'an email'} verification
              {contactMethod === 'phone' && ' that may apply message and data rates'}.
              {contactMethod === 'phone' && (
                <span className="block mt-1 text-xs text-blue-600">
                  For demo purposes, use code 12345 to verify.
                </span>
              )}
            </p>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={!isValidInput || isLoading}
              className={`primary_btn w-full transition-all ${!isValidInput || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[var(--primary-dark)]'
                }`}
            >
              {isLoading
                ? `Sending ${contactMethod === 'phone' ? 'SMS' : 'Email'}...`
                : 'Continue'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GetStarted