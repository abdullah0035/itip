import React, { useState, useEffect } from 'react'
import { RiEyeFill } from '@remixicon/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApiFunction from '../../utils/api/apiFuntions'
import { Logo } from '../icons/icons'
import Input from '../../utils/input'

const NewPassword = ({ email: propEmail, userType: propUserType, verified: propVerified }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { post } = ApiFunction()
  
  // Get data from props, location state, or default
  const email = propEmail || location.state?.email || ""
  const userType = propUserType || location.state?.user_type || 'customer'
  const verified = propVerified || location.state?.verified || false
  
  console.log('New Password Debug:', {
    email,
    userType,
    verified,
    locationState: location.state
  });
  
  // Redirect if not verified or no email
  useEffect(() => {
    if (!email || !verified) {
      // navigate('/forgot-password');
    }
  }, [email, verified, navigate])

  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  })

  // Error state
  const [errors, setErrors] = useState({})

  // Handle input changes
  const handleInputChange = (value, fieldName) => {
    const field = fieldName.toLowerCase().replace(' ', '_')

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

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // New password validation
    if (!formData.new_password.trim()) {
      newErrors.new_password = 'New password is required'
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters long'
    }

    // Confirm password validation
    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password = 'Password confirmation is required'
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
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
      action: 'resetPassword',
      email: email.trim().toLowerCase(),
      new_password: formData.new_password,
      confirm_password: formData.confirm_password,
      user_type: userType
    }

    setLoading(true)

    try {
      const res = await post('', data)
      
      if (res?.status === 'success') {
        toast.success('Password reset successfully! You can now login with your new password.')
        
        // Navigate to appropriate login screen based on user type
        if (userType === 'customer') {
          // navigate('/customer-login')
        } else {
          // navigate('/login')
        }
      } else {
        if (res?.message) {
          toast.error(res?.message || 'Failed to reset password')
        }
        if (res?.errors && Array.isArray(res.errors)) {
          // Handle validation errors from API
          const apiErrors = {}
          res.errors.forEach(error => {
            if (error.includes('password')) {
              apiErrors.new_password = error
            }
          })
          setErrors({ ...errors, ...apiErrors, submit: res?.message })
        } else {
          setErrors({ submit: res?.message || 'Failed to reset password' })
        }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setErrors({
        submit: error?.message || 'An error occurred. Please try again.'
      })
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const displayUserType = userType === 'service_worker' ? 'Service Worker' : 'Customer'

  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="Logo" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 poppins_medium'>Create New Password</h1>
        <h2 className='poppins mb-5 fs_16'>
          Create a new password for your {displayUserType} account: <strong>{email}</strong>
        </h2>

        <Input
          labels='New Password'
          type='password'
          placeholder='Enter new password'
          icon={<RiEyeFill className='text-[var(--icon)] fs_16' />}
          onChange={handleInputChange}
          value={formData?.new_password}
          name="new_password"
        />
        {errors.new_password && (
          <p className="text-red-500 fs_14 mt-1 mb-3">{errors?.new_password}</p>
        )}

        <Input
          labels='Confirm Password'
          type='password'
          placeholder='Confirm new password'
          icon={<RiEyeFill className='text-[var(--icon)] fs_16' />}
          onChange={handleInputChange}
          value={formData?.confirm_password}
          name="confirm_password"
        />
        {errors.confirm_password && (
          <p className="text-red-500 fs_14 mt-1 mb-3">{errors?.confirm_password}</p>
        )}


        {/* Submit error */}
        {errors?.submit && (
          <p className="text-red-500 fs_14 text-center mt-4 mb-4">{errors?.submit}</p>
        )}

        <button
          onClick={handleSubmit}
          className={`primary_btn mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/forgot-password-verification', { 
              state: { email, user_type: userType, type: 'forgot_password' } 
            })}
            className="text-gray-500 fs_14 hover:text-gray-700 transition-colors mr-4"
          >
            Back to Verification
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => userType === 'customer' ? navigate('/customer-login') : navigate('/login')}
            className="text-[var(--primary)] fs_14 hover:text-[var(--primary-dark)] transition-colors ml-4"
          >
            Back to Login
          </button>
        </div>
      </div>
    </>
  )
}

export default NewPassword