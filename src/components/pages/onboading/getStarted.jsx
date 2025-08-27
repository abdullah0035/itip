/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import { useNavigate } from 'react-router-dom'

const GetStarted = ({ onContinue }) => {
  const navigate = useNavigate()
  
  // Form state
  const [contactMethod, setContactMethod] = useState('phone') // 'phone' or 'email'
  const [contactValue, setContactValue] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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

  // Validate input based on contact method
  const validateInput = () => {
    const newErrors = {}
    
    if (!contactValue.trim()) {
      newErrors.contact = `${contactMethod === 'phone' ? 'Phone number' : 'Email address'} is required`
    } else if (contactMethod === 'email') {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactValue)) {
        newErrors.contact = 'Please enter a valid email address'
      }
    } else if (contactMethod === 'phone') {
      // Phone validation - basic format check
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(contactValue.replace(/\s/g, ''))) {
        newErrors.contact = 'Please enter a valid phone number (minimum 10 digits)'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!validateInput()) {
      return
    }
    
    // setIsLoading(true)
    

  }

  const isValidInput = contactValue.trim().length > 0

  return (
    <div className="flex flex-col bg-gray-50">
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
            {errors.contact && (
              <p className="text-red-500 fs_14 mt-1 mb-4">{errors.contact}</p>
            )}

            {/* Disclaimer Text */}
            <p className="text-gray-500 fs_14 mb-8 leading-relaxed">
              You will receive {contactMethod === 'phone' ? 'an SMS' : 'an email'} verification
              {contactMethod === 'phone' && ' that may apply message and data rates'}.
            </p>
            
            {/* Submit Error */}
            {errors.submit && (
              <p className="text-red-500 fs_14 mb-4 text-center">{errors.submit}</p>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={!isValidInput || isLoading}
              className={`primary_btn w-full transition-all ${
                !isValidInput || isLoading
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