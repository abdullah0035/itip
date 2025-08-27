/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import { RiEyeFill } from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  // Error state
  const [errors, setErrors] = useState({})
  
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
  
  // Validate form using FormValidator
  const validateForm = () => {
    const newErrors = {}
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      // Use your API for login
      
      // Success - navigate to dashboard
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({
        submit: error.message
      })
    }
  }

  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 outfit_medium'>Login</h1>
        <h2 className='outfit mb-5 fs_20'>Login to your account</h2>
        
        <form onSubmit={handleSubmit}>
          <Input 
            labels='Email Address' 
            type='email' 
            placeholder='Enter your email' 
            icon="" 
            onChange={handleInputChange}
            value={formData.email}
            name="email"
          />
          {errors.email && (
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.email}</p>
          )}
          
          <Input 
            labels='Password' 
            type='password' 
            placeholder='password' 
            icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>}
            onChange={handleInputChange}
            value={formData.password}
            name="password"
          />
          {errors.password && (
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.password}</p>
          )}
          
          <Link to='' className='float-right text-[var(--primary)] poppins_medium fs_14'>Forgot Password?</Link>
          
          {/* Show auth error from hook or form submission error */}
          <button 
            type="submit"
            className={`primary_btn mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <span className='block poppins_medium fs_14 text-center mt-10'>
          Don't Have an account? 
          <Link to={'/get-started'} className='text-[var(--primary)]'> Create New</Link>
        </span>
      </div>
    </>
  )
}

export default Login