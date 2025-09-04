import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApiFunction from '../../utils/api/apiFuntions'
import { Logo } from '../icons/icons'
import Input from '../../utils/input'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { post } = ApiFunction()
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    user_type: 'customer'
  })

  // Error state
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Handle input changes
  const handleInputChange = (value, fieldName) => {
    const field = fieldName.toLowerCase().replace(' ', '').replace('address', '')

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
  }

  // Handle user type change
  const handleUserTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      user_type: e.target.value
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!validateForm()) {
      return
    }

    const data = {
      action: 'forgotPassword',
      email: formData.email.trim().toLowerCase(),
      user_type: formData.user_type
    }

    setIsLoading(true)

    try {
      const res = await post('', data)
      
      if (res?.status === 'success') {
        toast.success(res?.message || 'Reset code sent successfully')
        
        // Navigate to FORGOT PASSWORD verification screen (NOT signup verification)
        navigate('/forgot-password-verification', { 
          state: { 
            email: formData.email.trim().toLowerCase(),
            user_type: formData.user_type,
            type: 'forgot_password',
            from: 'forgot-password' // Clear identifier
          } 
        })
      } else {
        if (res?.message) {
          toast.error(res?.message || 'Failed to send reset code')
        }
        setErrors({ submit: res?.message || 'Failed to send reset code' })
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setErrors({
        submit: error?.message || 'An error occurred. Please try again.'
      })
      toast.error('Failed to send reset code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="Logo" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 outfit_medium'>Forgot Password?</h1>
        <h2 className='outfit mb-5 fs_20'>Don't worry! Enter your email address and select your account type to receive a password reset code.</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="customer"
                checked={formData.user_type === 'customer'}
                onChange={handleUserTypeChange}
                className="mr-2"
                disabled={isLoading}
              />
              <span className="text-sm">Customer</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="service_worker"
                checked={formData.user_type === 'service_worker'}
                onChange={handleUserTypeChange}
                className="mr-2"
                disabled={isLoading}
              />
              <span className="text-sm">Service Worker</span>
            </label>
          </div>
        </div>

        <Input
          labels='Email Address'
          type='email'
          placeholder='Enter your email'
          icon=""
          onChange={handleInputChange}
          value={formData.email}
          name="email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 fs_14 mt-1 mb-3">{errors?.email}</p>
        )}

        <button
          onClick={handleSubmit}
          className={`primary_btn mt-6 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
        </button>

        <span className='block poppins_medium fs_14 text-center mt-8'>
          Remember your password?
          <Link to={'/login'} className='text-[var(--primary)] poppins_medium ms-1'>Back to Login</Link>
        </span>
      </div>
    </>
  )
}

export default ForgotPassword