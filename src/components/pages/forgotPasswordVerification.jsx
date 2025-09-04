import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApiFunction from '../../utils/api/apiFuntions'
import { Logo } from '../icons/icons'

const ForgotPasswordVerification = ({ email: propEmail, userType: propUserType }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { post } = ApiFunction()
  
  // Get data from props, location state, or default
  const email = propEmail || location.state?.email || ""
  const userType = propUserType || location.state?.user_type || 'customer'
  
  // Debug logging
  console.log('Forgot Password Verification Debug:', {
    email,
    userType,
    locationState: location.state
  });
  
  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate])
  
  // Form state
  const [code, setCode] = useState(['', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef([])

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5)
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Clear errors when user starts typing
  const clearErrors = () => {
    if (Object.keys(errors).length > 0) {
      setErrors({})
    }
  }

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    clearErrors()

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input if value entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
        clearErrors()
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5)
    
    if (pastedData.length > 0) {
      const newCode = [...code]
      for (let i = 0; i < 5; i++) {
        newCode[i] = pastedData[i] || ''
      }
      setCode(newCode)
      
      // Focus appropriate input
      const focusIndex = Math.min(pastedData.length, 4)
      inputRefs.current[focusIndex]?.focus()
      
      clearErrors()
    }
  }

  // Validate code
  const validateCode = () => {
    const enteredCode = code.join('')
    const newErrors = {}
    
    if (!enteredCode.trim()) {
      newErrors.code = 'Verification code is required'
    } else if (enteredCode.length !== 5) {
      newErrors.code = 'Please enter the complete 5-digit code'
    } else if (!/^\d{5}$/.test(enteredCode)) {
      newErrors.code = 'Code must contain only numbers'
    }

    if (!email || !email.trim()) {
      newErrors.contact = 'Email is required for verification'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.contact = 'Invalid email format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle code verification
  const handleSubmit = async () => {
    if (!validateCode()) {
      return
    }
    
    const enteredCode = code.join('')
    
    // IMPORTANT: Make sure we're using the forgot password verification action
    const payload = {
      action: 'verifyResetCode', // NOT 'verifyCode' - this is for password reset
      email: email.trim().toLowerCase(),
      code: enteredCode,
      user_type: userType
    }
    
    console.log('Sending reset verification payload:', payload) // Debug log
    
    setIsLoading(true)
    
    try {
      const res = await post('', payload)
      
      console.log('Reset verification response:', res) // Debug log
      
      if (res?.status === 'success') {
        toast.success('Reset code verified successfully!')
        
        // Navigate to new password screen - NOT to login/signup
        navigate('/new-password', { 
          state: { 
            email: email.trim().toLowerCase(),
            user_type: userType,
            verified: true,
            from: 'forgot-password' // Add identifier
          } 
        })
      } else {
        setErrors({ 
          code: res?.message || 'Invalid reset code. Please try again.' 
        })
        // Clear the code on error
        setCode(['', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error('Reset code verification error:', error)
      setErrors({
        code: error.message || 'Reset verification failed. Please try again.'
      })
      setCode(['', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) return
    
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({
        resend: 'Invalid email address for resending code'
      })
      return
    }
    
    const payload = {
      action: 'forgotPassword',
      email: email.trim().toLowerCase(),
      user_type: userType
    }
    
    setIsLoading(true)
    clearErrors()
    
    try {
      const res = await post('', payload)
      
      if (res?.status === 'success') {
        // Success - reset timer and state
        setResendTimer(60)
        setCanResend(false)
        setCode(['', '', '', '', ''])
        
        // Show success message briefly
        setErrors({
          success: res?.message || 'Reset code sent successfully!'
        })
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setErrors({})
        }, 3000)
        
        // Focus first input
        inputRefs.current[0]?.focus()
        
      } else {
        setErrors({
          resend: res?.message || 'Failed to resend code. Please try again.'
        })
      }
    } catch (error) {
      console.error('Resend error:', error)
      setErrors({
        resend: error.message || 'Failed to resend code. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isCodeComplete = code.every(digit => digit !== '')
  const displayUserType = userType === 'service_worker' ? 'Service Worker' : 'Customer'

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="">
        <img src={Logo} width={100} className='mx-auto' alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-8">
        <div className="w-full mx-auto">
          {/* Title */}
          <h1 className="fs_40 text-start outfit_medium text-black">Enter Reset Code</h1>
          
          {/* Subtitle */}
          <p className="outfit fs_16 text-gray-600 mb-8 max-w-[450px]">
            We sent a 5-digit reset code to <strong>{email}</strong> for your {displayUserType} account. 
            Enter the code below to reset your password.
          </p>

          {/* Code Input Boxes */}
          <div className="flex gap-3 mb-4 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-14 h-14 text-center text-xl font-medium border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.code 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[var(--primary)]'
                }`}
                maxLength="1"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={isLoading}
              />
            ))}
          </div>
          
          {/* Error Messages */}
          {errors.code && (
            <p className="text-red-500 fs_14 text-center mb-4">{errors.code}</p>
          )}
          
          {errors.contact && (
            <p className="text-red-500 fs_14 text-center mb-4">{errors.contact}</p>
          )}
          
          {errors.success && (
            <p className="text-green-500 fs_14 text-center mb-4">{errors.success}</p>
          )}
          
          {errors.resend && (
            <p className="text-red-500 fs_14 text-center mb-4">{errors.resend}</p>
          )}

          {/* Resend Code */}
          <div className="text-start mb-8">
            <button
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className={`fs_16 poppins_medium transition-colors ${
                !canResend || isLoading
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-[var(--primary)] hover:text-[var(--primary-dark)] cursor-pointer'
              }`}
            >
              {isLoading && !canResend ? 'Sending...' : 'Resend Code'} 
              {!canResend && !isLoading && ` (${resendTimer}s)`}
            </button>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleSubmit}
            disabled={!isCodeComplete || isLoading}
            className={`primary_btn w-full transition-all ${
              !isCodeComplete || isLoading
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-[var(--primary-dark)]'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          {/* Back to Forgot Password */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-gray-500 fs_14 hover:text-gray-700 transition-colors"
            >
              Back to Forgot Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordVerification