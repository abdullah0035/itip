import React, { useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import RadioGroup from '../../../utils/radioGroup'
import Textarea from '../../../utils/textarea'
import { useNavigate } from 'react-router-dom'

const QRCodeSetup = ({ onGenerateQR }) => {
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    tipType: 'fixed', // 'fixed' or 'no-amount'
    tipAmount: '50',
    title: 'Evening Shift',
    description: "I've been driving for 8 hours today"
  })
  
  // Error state
  const [errors, setErrors] = useState({})
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  const tipTypeOptions = [
    { label: 'Fixed Amount', value: 'fixed' },
    { label: 'No Amount', value: 'no-amount' }
  ]

  // Handle tip type change
  const handleTipTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      tipType: type,
      tipAmount: type === 'no-amount' ? '' : prev.tipAmount || '50'
    }))
    
    // Clear amount error when switching to no-amount
    if (type === 'no-amount' && errors.tipAmount) {
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

  // Handle form submission
  const handleGenerateQR = async (e) => {
    e?.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const qrData = {
        tipType: formData.tipType,
        tipAmount: formData.tipType === 'fixed' ? parseFloat(formData.tipAmount) : null,
        title: formData.title.trim(),
        description: formData.description.trim(),
        createdAt: new Date().toISOString(),
        id: Date.now().toString() // Simple ID generation for demo
      }

      console.log('Generating QR Code with data:', qrData)
      
      // Here you would typically save the QR data to your backend
      // const response = await createQRCode(qrData)
      
      // Store QR data for the home page
      sessionStorage.setItem('qrData', JSON.stringify(qrData))
      
      // Call onGenerateQR if provided
      if (onGenerateQR) {
        onGenerateQR(qrData)
      }
      
      // Navigate to home page to display QR code
      navigate('/home')
      
    } catch (error) {
      console.error('QR Generation error:', error)
      setErrors({
        submit: error.message || 'Failed to generate QR code. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.title.trim() && 
      formData.description.trim() && 
      (formData.tipType === 'no-amount' || formData.tipAmount.trim())
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
          <h1 className="fs_40 outfit_medium text-black mb-2">Setup your first QR Code</h1>

          {/* Subtitle */}
          <p className="outfit fs_20 text-gray-600">
            Welcome to iTIP! Now let's set up your first QR Code to start receiving tips.
          </p>
          <hr className='my-8 text-[#E6E6E6]' />
          
          <form onSubmit={handleGenerateQR}>
            {/* Tip Type Section */}
            <RadioGroup
              label="Tip Type"
              options={tipTypeOptions}
              value={formData.tipType}
              onChange={handleTipTypeChange}
              name="tipType"
              marginBottom="24px"
            />

            {/* Tip Amount (only show if Fixed Amount selected) */}
            {formData.tipType === 'fixed' && (
              <div className="mb-6">
                <label className="block poppins fs_16 text-black mb-3">Tip Amount</label>
                <div className="customInputGroup">
                  <span className="text-gray-500 fs_16">$</span>
                  <input
                    type="number"
                    value={formData.tipAmount}
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
                value={formData.title}
                onChange={handleInputChange}
                name="title"
                marginBottom="0px"
              />
              {errors.title && (
                <p className="text-red-500 fs_14 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description Field */}
            <Textarea
              labels="Description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              name="description"
              rows={4}
              marginBottom="16px"
              maxLength={500}
              showCharCount={true}
            />
            {errors.description && (
              <p className="text-red-500 fs_14 mt-1 mb-4">{errors.description}</p>
            )}
            
            {/* Submit Error */}
            {errors.submit && (
              <p className="text-red-500 fs_14 mb-4 text-center">{errors.submit}</p>
            )}

            {/* Generate QR Code Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`primary_btn w-full transition-all ${
                !isFormValid() || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[var(--primary-dark)]'
              }`}
            >
              {isLoading ? 'Generating QR Code...' : 'Generate QR Code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QRCodeSetup