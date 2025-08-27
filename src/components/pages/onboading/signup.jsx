import React, { useState } from 'react'
import { RiEyeFill } from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../../utils/input'
import Select from '../../../utils/select'
import { Logo } from '../../icons/icons'

const Signup = () => {
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    city: null
  })
  
  // Error state
  const [errors, setErrors] = useState({})
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // City options
  const cities = [
    { id: 1, name: 'New York' },
    { id: 2, name: 'Los Angeles' },
    { id: 3, name: 'Chicago' },
    { id: 4, name: 'Houston' },
    { id: 5, name: 'Phoenix' },
    { id: 6, name: 'Philadelphia' },
    { id: 7, name: 'San Antonio' },
    { id: 8, name: 'San Diego' },
    { id: 9, name: 'Dallas' },
    { id: 10, name: 'San Jose' },
    { id: 11, name: 'Austin' },
    { id: 12, name: 'Jacksonville' },
    { id: 13, name: 'Fort Worth' },
    { id: 14, name: 'Columbus' },
    { id: 15, name: 'Charlotte' }
  ]

  // Handle input changes
  const handleInputChange = (value, fieldName) => {
    let field = fieldName.toLowerCase().replace(' ', '').replace('address', '')
    
    // Handle field name mapping
    if (field === 'firstname') field = 'firstName'
    if (field === 'lastname') field = 'lastName'
    if (field === 'email') field = 'email'
    
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

  // Handle city selection
  const handleCityChange = (city) => {
    setFormData(prev => ({
      ...prev,
      city: city
    }))
    
    // Clear city error
    if (errors.city) {
      setErrors(prev => ({
        ...prev,
        city: ''
      }))
    }
  }

  // Validate form using FormValidator
  const validateForm = () => {
    const newErrors = {}
    
    // City validation
    if (!formData.city) {
      newErrors.city = 'City is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault()
    navigate('/success');
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
  }

  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 outfit_medium'>Sign Up</h1>
        <h2 className='outfit mb-10 fs_20'>Sign Up to your account</h2>
        
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name Row */}
          <div className='grid grid-cols-2 gap-4 mb-4'>
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
                <p className="text-red-500 fs_12 mt-1">{errors.firstName}</p>
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
                <p className="text-red-500 fs_12 mt-1">{errors.lastName}</p>
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
          />
          {errors.email && (
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.email}</p>
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
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.password}</p>
          )}
          
          <Input 
            labels='Country' 
            type='text' 
            placeholder='Country' 
            icon=""
            onChange={handleInputChange}
            value={formData.country}
            name="country"
          />
          {errors.country && (
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.country}</p>
          )}
          
          {/* City Dropdown */}
          <Select
            labels='City'
            options={cities}
            placeholder='Select City'
            value={formData.city}
            onChange={handleCityChange}
            displayKey='name'
            valueKey='id'
            marginBottom='20px'
          />
          {errors.city && (
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.city}</p>
          )}

          {errors.submit && (
            <p className="text-red-500 fs_14 mt-4 text-center">{errors.submit}</p>
          )}

          <button 
            type="submit"
            className={`primary_btn mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
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