import React, { useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import RadioGroup from '../../../utils/radioGroup'
import Textarea from '../../../utils/textarea'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'
import { setLogout } from '../../redux/loginForm'

const QRCodeSetup = ({ onGenerateQR }) => {
  const navigate = useNavigate()
  const { post } = ApiFunction()
  const dispatch = useDispatch();
  // Get encrypted token from Redux store
  const encryptedToken = useSelector(state => state?.auth?.token)
  const token = decryptData(encryptedToken)
  
  // Form state
  const [formData, setFormData] = useState({
    tipType: 'fixed', // 'fixed' or 'no_amount'
    tipAmount: '',
    title: '',
    description: ""
  })
  
  // Error state
  const [errors, setErrors] = useState({})
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  const tipTypeOptions = [
    { label: 'Fixed Amount', value: 'fixed' },
    { label: 'No Amount', value: 'no_amount' }
  ]

  // Handle tip type change
  const handleTipTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      tipType: type,
      tipAmount: type === 'no_amount' ? '' : prev.tipAmount || '50'
    }))
    
    // Clear amount error when switching to no_amount
    if (type === 'no_amount' && errors.tipAmount) {
      setErrors(prev => ({
        ...prev,
        tipAmount: ''
      }))
    }
  }

  // Handle input changes
  const handleInputChange = (value, fieldName) => {
    let field = fieldName.toLowerCase().replace(' ', '')
    
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

  // Handle tip amount change
  const handleTipAmountChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      tipAmount: value
    }))
    
    // Clear tip amount error
    if (errors.tipAmount) {
      setErrors(prev => ({
        ...prev,
        tipAmount: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Title must be less than 50 characters'
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    // Tip amount validation (only for fixed amount)
    if (formData.tipType === 'fixed') {
      if (!formData.tipAmount.trim()) {
        newErrors.tipAmount = 'Tip amount is required for fixed amount type'
      } else {
        const amount = parseFloat(formData.tipAmount)
        if (isNaN(amount) || amount <= 0) {
          newErrors.tipAmount = 'Please enter a valid amount greater than 0'
        } else if (amount > 1000) {
          newErrors.tipAmount = 'Tip amount cannot exceed $1000'
        } else if (amount < 0.01) {
          newErrors.tipAmount = 'Minimum tip amount is $0.01'
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission with real API integration
  const handleGenerateQR = async (e) => {
    e?.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Check if user is authenticated
    if (!token) {
      toast.error('Authentication required. Please log in again.')
      dispatch(setLogout())
      navigate('/')
      return
    }
    
    // Prepare payload for API
    const payload = {
      tipType: formData.tipType,
      tipAmount: formData.tipType === 'fixed' ? parseFloat(formData.tipAmount) : 0,
      title: formData.title.trim(),
      description: formData.description.trim(),
      token: token,
      action: 'generateQR'
    }
    
    setIsLoading(true)
    
    await post('', payload)
      .then((res) => {
        setIsLoading(false)
        
        if (res?.status === 'success') {
          const qrData = {
            ...res.qr_data,
            tipType: formData.tipType,
            tipAmount: formData.tipType === 'fixed' ? parseFloat(formData?.tipAmount) : null,
            title: formData.title.trim(),
            description: formData.description.trim(),
            createdAt: new Date().toISOString()
          }

          console.log('QR Code generated successfully:', qrData)
          
          // Call onGenerateQR if provided
          if (onGenerateQR) {
            onGenerateQR(qrData)
          }
          
          // Show success message
          toast.success(res?.message || 'QR Code generated successfully!')
          
          // Navigate to home page to display QR code
          navigate('/home')
          
        } else {
          // Handle API error response
          const errorMessage = res?.message || 'Failed to generate QR code. Please try again.'
          setErrors({
            submit: errorMessage
          })
          toast.error(errorMessage)
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('QR Generation error:', error)
        
        let errorMessage = 'Failed to generate QR code. Please try again.'
        
        // FIXED: Check response data message FIRST before checking error.message
        if (error?.response?.data?.message) {
          errorMessage = error?.response?.data?.message
        } else if (error.message && !error.message.includes('Request failed with status code')) {
          errorMessage = error.message
        }
        
        // Handle specific error cases based on status codes
        if (error?.response?.status === 405) {
          errorMessage = 'Method not allowed. Please try again.'
        } else if (error?.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }
        
        setErrors({
          submit: errorMessage
        })
        toast.error(errorMessage)
        
        // If unauthorized, redirect to login
        if (error?.response?.status === 403 || errorMessage?.includes('Unauthorized')) {
          dispatch(setLogout())
          navigate('/')
        }
      })
  }

  const isFormValid = () => {
    return (
      formData?.title.trim() && 
      formData?.description.trim() && 
      (formData?.tipType === 'no_amount' || formData?.tipAmount.trim())
    )
  }

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="pb-4">
        <img src={Logo} width={100} className='mx-auto' alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-6 overflow-y-auto">
        <div className="max-w-md mx-auto pb-8">

          {/* Title */}
          <h1 className="fs_40 outfit_medium text-black text-center mb-2">Setup your QR Code</h1>

          {/* Subtitle */}
          <p className="outfit fs_20 text-center text-gray-600">
            Welcome to iTIP! Now let's set up your QR Code to start receiving tips.
          </p>
          <hr className='my-8 text-[#E6E6E6]' />
          
          <form onSubmit={handleGenerateQR}>
            {/* Tip Type Section */}
            <RadioGroup
              label="Tip Type"
              options={tipTypeOptions}
              value={formData?.tipType}
              onChange={handleTipTypeChange}
              name="tipType"
              marginBottom="24px"
            />

            {/* Tip Amount (only show if Fixed Amount selected) */}
            {formData?.tipType === 'fixed' && (
              <div className="mb-6">
                <label className="block poppins fs_16 text-black mb-3">Tip Amount</label>
                <div className="customInputGroup">
                  <span className="text-gray-500 fs_16">$</span>
                  <input
                    type="number"
                    value={formData?.tipAmount}
                    onChange={handleTipAmountChange}
                    placeholder="0"
                    className="customInput fs_16 flex-1 ml-2"
                    min="0.01"
                    max="1000"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>
                {errors.tipAmount && (
                  <p className="text-red-500 fs_14 mt-1">{errors.tipAmount}</p>
                )}
              </div>
            )}

            {/* Title Field */}
            <div className="mb-6">
              <Input
                labels="Title"
                type="text"
                placeholder="Enter title"
                value={formData?.title}
                onChange={handleInputChange}
                name="title"
                marginBottom="0px"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-red-500 fs_14 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description Field */}
            <Textarea
              labels="Description"
              placeholder="Enter description"
              value={formData?.description}
              onChange={handleInputChange}
              name="description"
              rows={4}
              marginBottom="16px"
              maxLength={500}
              showCharCount={true}
              disabled={isLoading}
            />
            {errors?.description && (
              <p className="text-red-500 fs_14 mt-1 mb-4">{errors?.description}</p>
            )}
            
            {/* Submit Error */}
            {errors?.submit && (
              <p className="text-red-500 fs_14 mb-4 text-center flex items-center gap-[13px]">{errors?.submit}</p>
            )}

            {/* Generate QR Code Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading || !token}
              className={`primary_btn w-full transition-all ${
                !isFormValid() || isLoading || !token
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[var(--primary-dark)]'
              }`}
            >
              {isLoading ? 'Generating QR Code...' : 'Generate QR Code'}
            </button>
            <Link to={'/dashboard'}>
            <button
              type="submit"
              className={`primary_btn mt-2 w-full transition-all hover:bg-[var(--primary-dark)]`}>
              BacK to App
            </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QRCodeSetup